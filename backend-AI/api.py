# api.py
import time
import base64
import psycopg2.extras
from io import BytesIO
from PIL import Image
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import json
import pika
from config import (
    get_db_connection, 
    predict_lock, 
    last_api_call_time, 
    RABBITMQ_HOST, RABBITMQ_PORT,
    RABBITMQ_USER, RABBITMQ_PASSWORD)
from utils.models import preprocess_image

# Khởi tạo Router (thay vì app) để có thể gộp vào main.py
router = APIRouter()

class Bbox(BaseModel):
    x: float
    y: float
    w: float
    h: float

class SearchRequest(BaseModel):
    imageBase64: str
    bbox: Bbox
    parts: list[str]

# Dùng Dependency Injection mộc mạc: Biến toàn cục sẽ được set từ main.py
leaf_model_instance = None
general_model_instance = None

def init_api_models(leaf, general):
    global leaf_model_instance, general_model_instance
    leaf_model_instance = leaf
    general_model_instance = general

@router.post("/ai/search")
async def ai_search(request: SearchRequest):
    last_api_call_time[0] = time.time()
    
    try:
        # 1. Giải mã Base64
        header, encoded = request.imageBase64.split(",", 1)
        image_data = base64.b64decode(encoded)
        img = Image.open(BytesIO(image_data)).convert('RGB')
        
        # 2. Lấy kích thước ảnh gốc (pixel)
        img_w, img_h = img.size
        
        # ==================== LOGIC CẮT ẢNH AN TOÀN (SAFE CROP) ====================
        # Đảm bảo phần trăm gửi lên nằm trong khoảng 0 -> 100
        safe_x = max(0, min(100, request.bbox.x))
        safe_y = max(0, min(100, request.bbox.y))
        safe_w = max(0, min(100, request.bbox.w))
        safe_h = max(0, min(100, request.bbox.h))

        if safe_x == 0 and safe_y == 0 and safe_w == 100 and safe_h == 100:
            cropped_img = img
        else:
            left = (safe_x / 100) * img_w
            top = (safe_y / 100) * img_h
            right = left + ((safe_w / 100) * img_w)
            bottom = top + ((safe_h / 100) * img_h)
            
            left = int(left)
            top = int(top)
            right = int(right)
            bottom = int(bottom)
            
            if right > left and bottom > top:
                cropped_img = img.crop((left, top, right, bottom))
            else:
                cropped_img = img
        # ===========================================================================
        
        cropped_img.save('cropped.png') # Lưu file test
        img.save('original.png') # Lưu file test
    
        # 3. Đưa vào hàm tiền xử lý (Sẽ tự động Letterboxing chống méo)
        processed_img = preprocess_image(cropped_img) 
        
        # ... Phần query cơ sở dữ liệu và trả kết quả giữ nguyên như cũ ...
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) 
        final_results = {}

        for part in request.parts:
            model = leaf_model_instance if part == 'Leaf' else general_model_instance
            
            with predict_lock:
                features = model.predict(processed_img, verbose=0)
                
            vector_str = f"[{','.join(map(str, features.flatten().tolist()))}]" 
            
            query = """
                WITH UniqueVarieties AS (
                    SELECT DISTINCT ON (v.variety_id)
                        v.variety_id, v.common_name, v.variety_name,
                        pi.url as thumbnail,
                        1 - (pi.cnn_feature_vector::vector <=> %s::vector) AS similarity
                    FROM plant_images pi
                    JOIN varieties v ON pi.variety_id = v.variety_id
                    WHERE pi.part_type = %s 
                      AND pi.is_standard = true
                      AND pi.cnn_feature_vector::vector IS NOT NULL
                    ORDER BY v.variety_id, pi.cnn_feature_vector::vector <=> %s::vector ASC
                )
                SELECT * FROM UniqueVarieties
                ORDER BY similarity DESC
                LIMIT 5;
            """
            cursor.execute(query, (vector_str, part, vector_str))
            final_results[part] = cursor.fetchall()
            
        cursor.close()
        conn.close()

        last_api_call_time[0] = time.time()
        return {"success": True, "results": final_results}

    except Exception as e:
        print(f"❌ Lỗi xử lý AI Search: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/ai/reindex-features")
async def reindex_features_mq():
    """
    API Admin: Reset cnn_feature_vector của ảnh chuẩn và đẩy vào RabbitMQ để trích xuất lại.
    """
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    
    try:
        # 1. Quét DB lấy các ảnh đạt chuẩn
        cursor.execute("""
            SELECT plant_image_id, url, part_type 
            FROM plant_images 
            WHERE is_standard = true
        """)
        images = cursor.fetchall()
        
        if not images:
            return {"success": True, "message": "Không có ảnh chuẩn nào.", "total": 0}
        
        image_ids = [img['plant_image_id'] for img in images]
        
        # 2. Xóa vector cũ, chuyển trạng thái về Pending
        cursor.execute("""
            UPDATE plant_images 
            SET cnn_feature_vector = NULL, status = 'Pending' 
            WHERE plant_image_id = ANY(%s)
        """, (image_ids,))
        conn.commit()

        # 3. Kết nối RabbitMQ
        params = pika.ConnectionParameters(
            host=RABBITMQ_HOST, port=RABBITMQ_PORT, 
            credentials=pika.PlainCredentials(RABBITMQ_USER, RABBITMQ_PASSWORD)
        )
        connection = pika.BlockingConnection(params)
        channel = connection.channel()
        
        # Đảm bảo queue có tồn tại
        channel.queue_declare(queue='leaf_processing_queue', durable=True)
        channel.queue_declare(queue='general_processing_queue', durable=True)

        # 4. Bắn hàng loạt message vào Queue
        leaf_count = 0
        general_count = 0

        for img in images:
            payload = {
                'plant_image_id': img['plant_image_id'],
                'object_key': img['url'],
                'part_type': img['part_type'],
                'retry_count': 0
            }
            
            queue_name = 'leaf_processing_queue' if img['part_type'] == 'Leaf' else 'general_processing_queue'
            
            channel.basic_publish(
                exchange='',
                routing_key=queue_name,
                body=json.dumps(payload),
                properties=pika.BasicProperties(delivery_mode=2) # Lưu xuống ổ cứng, chống mất mát
            )
            
            if img['part_type'] == 'Leaf': leaf_count += 1
            else: general_count += 1
                
        connection.close()
        
        return {
            "success": True,
            "message": f"Đã đẩy {len(image_ids)} task trích xuất ngầm vào RabbitMQ.",
            "details": {
                "leaf_queue": leaf_count,
                "general_queue": general_count
            }
        }

    except Exception as e:
        conn.rollback()
        print(f"❌ Lỗi khi reindex MQ: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()