# worker.py
import time
import json
import urllib.request
import pika
from PIL import Image
from io import BytesIO
from utils.models import preprocess_image

from config import (
    RABBITMQ_HOST, RABBITMQ_PORT, 
    RABBITMQ_USER, RABBITMQ_PASSWORD,
    BACKEND_NODEJS_URL, MAX_RETRIES, 
    API_PRIORITY_PAUSE_TIME, get_db_connection, 
    predict_lock, last_api_call_time
)

def create_mq_callback(leaf_model, general_model):
    """
    Sử dụng Closure (Factory function) để truyền các model đã được load 
    từ main.py vào trong callback một cách an toàn.
    """
    def mq_callback(ch, method, properties, body):
        payload = json.loads(body)
        plant_image_id = payload['plant_image_id']
        img_path = payload['object_key']
        part_type = payload['part_type']
        retry_count = payload.get('retry_count', 0)
        
        # Ưu tiên API
        while time.time() - last_api_call_time[0] < API_PRIORITY_PAUSE_TIME:
            print(f"⏸️ [MQ] Tạm dừng ưu tiên API Search... (Đợi {API_PRIORITY_PAUSE_TIME}s)")
            time.sleep(0.5)

        print(f"▶️ [MQ] Đang xử lý ảnh ngầm: {plant_image_id} ({part_type})")
        conn = get_db_connection()
        cursor = conn.cursor()

        try:
            # Kiểm tra dữ liệu
            cursor.execute("SELECT is_standard, cnn_feature_vector FROM plant_images WHERE plant_image_id = %s", (plant_image_id,))
            row = cursor.fetchone()
            
            if not row:
                print(f"⚠️ [MQ] Ảnh {plant_image_id} không tồn tại trong DB.")
                ch.basic_ack(delivery_tag=method.delivery_tag)
                return
                
            if row[0] is False or row[1] is not None:
                print(f"⚠️ [MQ] Ảnh {plant_image_id} không tiêu chuẩn hoặc đã xử lý.")
                ch.basic_ack(delivery_tag=method.delivery_tag)
                return

            # Xử lý ảnh
            img_url = img_path if img_path.startswith("http") else f"{BACKEND_NODEJS_URL}/{img_path.lstrip('/')}"
            req = urllib.request.Request(img_url, headers={'User-Agent': 'Mozilla/5.0'})
            response = urllib.request.urlopen(req)
            img = Image.open(BytesIO(response.read())).convert('RGB')
            processed_img = preprocess_image(img)

            model = leaf_model if part_type == 'Leaf' else general_model
            
            with predict_lock:
                features = model.predict(processed_img, verbose=0)
            
            vector_str = f"{{{','.join(map(str, features.flatten().tolist()))}}}"

            cursor.execute(
                "UPDATE plant_images SET cnn_feature_vector = %s::real[], status = 'Completed' WHERE plant_image_id = %s",
                (vector_str, plant_image_id)
            )
            conn.commit()
            ch.basic_ack(delivery_tag=method.delivery_tag)
            print(f"[MQ] ✅ Hoàn thành: {plant_image_id}")

        except Exception as e:
            print(f"[MQ] ❌ Lỗi {plant_image_id}: {str(e)}")
            conn.rollback()
            
            if retry_count < MAX_RETRIES:
                payload['retry_count'] = retry_count + 1
                time.sleep(1) 
                ch.basic_publish(exchange='', routing_key=method.routing_key, body=json.dumps(payload))
            else:
                cursor.execute("UPDATE plant_images SET status = 'Failed' WHERE plant_image_id = %s", (plant_image_id,))
                conn.commit()
            ch.basic_ack(delivery_tag=method.delivery_tag)
            
        finally:
            cursor.close()
            conn.close()

    return mq_callback

def start_rabbitmq_worker(leaf_model, general_model):
    callback = create_mq_callback(leaf_model, general_model)
    while True:
        try:
            params = pika.ConnectionParameters(host=RABBITMQ_HOST, port=RABBITMQ_PORT, credentials=pika.PlainCredentials(RABBITMQ_USER, RABBITMQ_PASSWORD))
            connection = pika.BlockingConnection(params)
            channel = connection.channel()
            
            channel.queue_declare(queue='leaf_processing_queue', durable=True)
            channel.queue_declare(queue='general_processing_queue', durable=True)
            channel.basic_qos(prefetch_count=1)
            channel.basic_consume(queue='leaf_processing_queue', on_message_callback=callback)
            channel.basic_consume(queue='general_processing_queue', on_message_callback=callback)
            
            print("🐰 [RabbitMQ] Worker đang lắng nghe...")
            channel.start_consuming()
        except Exception as e:
            print(f"🐰 [RabbitMQ] Mất kết nối, thử lại sau 5s... Lỗi: {e}")
            time.sleep(5)