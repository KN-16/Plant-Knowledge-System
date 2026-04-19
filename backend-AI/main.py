import threading
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from contextlib import asynccontextmanager # <--- 1. Import thêm thư viện này

# Import các thành phần đã tách
from utils.models import get_leaf_model, get_general_model
from worker import start_rabbitmq_worker
from api import router as api_router, init_api_models


# ================= LIFECYCLE: KHỞI TẠO HỆ THỐNG =================
print("⏳ Đang khởi động hệ thống...")
print("⏳ Đang nạp các mô hình AI vào RAM/GPU (Chỉ nạp 1 lần)...")
leaf_model_global = get_leaf_model()
general_model_global = get_general_model()
print("✅ Nạp mô hình thành công!")

# Tiêm (Inject) model vào API module
init_api_models(leaf_model_global, general_model_global)

# 2. Định nghĩa hàm lifespan thay cho @app.on_event
@asynccontextmanager
async def lifespan(app: FastAPI):
    # --- PHẦN CODE CHẠY TRƯỚC YIELD TƯƠNG ĐƯƠNG VỚI "STARTUP" ---
    print("🚀 Đang khởi động RabbitMQ Worker ở luồng nền...")
    mq_thread = threading.Thread(
        target=start_rabbitmq_worker, 
        args=(leaf_model_global, general_model_global), 
        daemon=True
    )
    mq_thread.start()

    # Nhường quyền cho ứng dụng FastAPI chạy (nhận request)
    yield 

    # --- PHẦN CODE CHẠY SAU YIELD TƯƠNG ĐƯƠNG VỚI "SHUTDOWN" ---
    # Khi bạn tắt server (Ctrl+C), code ở đây sẽ chạy.
    # Rất hữu ích nếu sau này bạn muốn clean up RAM, tắt kết nối DB an toàn.
    print("🛑 FastAPI server đang tắt. Dọn dẹp tài nguyên...")


# 3. Truyền hàm lifespan vào tham số khi khởi tạo app
app = FastAPI(title="Plant AI Service", lifespan=lifespan)

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # Cho phép tất cả các nguồn (có thể điều chỉnh sau)
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# Gắn router từ api.py vào app (đặt tiền tố là /api)
app.include_router(api_router, prefix="/api")

# API Documentation
# POST /api/ai/reindex-features
# POST /api/ai/search

if __name__ == "__main__":
    print("🌐 Bắt đầu chạy Uvicorn Server...")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False) 
    # reload=False RẤT QUAN TRỌNG, nếu True nó sẽ load lại model nhiều lần gây sập RAM