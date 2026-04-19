# config.py
import os
import psycopg2
import threading

# ================= BIẾN MÔI TRƯỜNG =================
BACKEND_NODEJS_URL = os.getenv("BACKEND_NODEJS_URL", "http://localhost:3000")
RABBITMQ_HOST = os.getenv("RABBITMQ_HOST", "localhost")
RABBITMQ_PORT = os.getenv("RABBITMQ_PORT", "5672")
RABBITMQ_USER = os.getenv("RABBITMQ_USER", "admin")
RABBITMQ_PASSWORD = os.getenv("RABBITMQ_PASSWORD", "admin")
MAX_RETRIES = int(os.getenv("MAX_RETRIES", 3))
API_PRIORITY_PAUSE_TIME = float(os.getenv("API_PRIORITY_PAUSE_TIME", 10.0))

# Thông số DB
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_USER = os.getenv("DB_USER", "admin")
DB_PASSWORD = os.getenv("DB_PASSWORD", "adminpass")
DB_NAME = os.getenv("DB_NAME", "plant_knowledge_db")

# ================= KẾT NỐI DATABASE =================
def get_db_connection():
    return psycopg2.connect(
        host=DB_HOST,
        port=DB_PORT,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME
    )

# ================= BIẾN CHIA SẺ (SHARED STATE) =================
# Dùng chung giữa worker.py và api.py
predict_lock = threading.Lock()
last_api_call_time = [0.0]

# ================= CẤU HÌNH ĐƯỜNG DẪN MÔ HÌNH =================
# Lấy đường dẫn từ biến môi trường, nếu không có thì dùng giá trị mặc định.
LEAF_MODEL_PATH = os.getenv("LEAF_MODEL_PATH", "./models/MobileNetV3LargeModelEmbed.keras")
GENERAL_MODEL_PATH = os.getenv("GENERAL_MODEL_PATH", "./models/MobileNetV3LargeModelBaseLine.keras")