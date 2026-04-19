import os
import numpy as np
import keras
from keras.models import load_model
from keras.applications.resnet50 import preprocess_input as resnet_preprocess
from PIL import Image
from keras.preprocessing import image
from config import LEAF_MODEL_PATH, GENERAL_MODEL_PATH

# ================= 1. ĐĂNG KÝ HÀM CHO KERAS 3 =================
# Bắt buộc phải khai báo chính xác module 'builtins' như trong thông báo lỗi của bạn
@keras.saving.register_keras_serializable(package="builtins", name="preprocess_input")
def preprocess_input_fn(x):
    return resnet_preprocess(x)

# ================= 2. HÀM LOAD MÔ HÌNH =================
def get_leaf_model():
    """
    Load mô hình chuyên gia xử lý Lá.
    """
    if not os.path.exists(LEAF_MODEL_PATH):
        raise FileNotFoundError(f"❌ KHÔNG TÌM THẤY MÔ HÌNH LÁ TẠI: {LEAF_MODEL_PATH}")
    
    print(f"Loading Leaf Model từ {LEAF_MODEL_PATH}...")
    
    # [TUYỆT CHIÊU]: Thêm safe_mode=False để Keras 3 cho phép load lớp Lambda từ bản cũ
    return load_model(
        LEAF_MODEL_PATH, 
        compile=False,
        safe_mode=False, 
        custom_objects={'preprocess_input': preprocess_input_fn}
    )

def get_general_model():
    """
    Load mô hình chuyên gia xử lý Thân/Hoa (General).
    """
    if not os.path.exists(GENERAL_MODEL_PATH):
        raise FileNotFoundError(f"❌ KHÔNG TÌM THẤY MÔ HÌNH GENERAL TẠI: {GENERAL_MODEL_PATH}")
    
    print(f"Loading General Model từ {GENERAL_MODEL_PATH}...")
    
    return load_model(
        GENERAL_MODEL_PATH, 
        compile=False,
        safe_mode=False,
        custom_objects={'preprocess_input': preprocess_input_fn}
    )

# ================= 3. HÀM TIỀN XỬ LÝ ẢNH =================
def preprocess_image(img, target_size=(224, 224)):
    """
    Tiền xử lý ảnh: Giữ nguyên tỷ lệ (Aspect Ratio) bằng kỹ thuật Letterboxing,
    tránh làm méo hình dáng của Lá/Thân/Hoa trước khi đưa vào ResNet50.
    """
    # 1. Lấy kích thước gốc
    w, h = img.size
    
    # 2. Tính tỷ lệ scale sao cho cạnh dài nhất vừa khít target_size
    scale = min(target_size[0] / w, target_size[1] / h)
    new_w = int(w * scale)
    new_h = int(h * scale)
    
    # 3. Resize giữ nguyên tỷ lệ
    img_resized = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    # 4. Tạo một phông nền đen kích thước chuẩn 224x224
    new_img = Image.new('RGB', target_size, (0, 0, 0))
    
    # 5. Dán ảnh đã resize vào chính giữa phông nền
    paste_x = (target_size[0] - new_w) // 2
    paste_y = (target_size[1] - new_h) // 2
    new_img.paste(img_resized, (paste_x, paste_y))
    
    # 6. Chuyển thành Tensor
    x = image.img_to_array(new_img)
    x = np.expand_dims(x, axis=0)
    
    return x