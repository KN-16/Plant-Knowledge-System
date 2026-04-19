# Sử dụng image Python chuẩn (3.10 slim gọn nhẹ, độ tương thích cao với các lib AI)
FROM python:3.10-slim

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Copy file requirements.txt vào trước để tận dụng Docker Cache cho các packages
COPY requirements.txt .

# Cài đặt các thư viện Python (Thêm --no-cache-dir để giảm dung lượng image)
RUN pip install --no-cache-dir -r requirements.txt

# Copy toàn bộ mã nguồn ứng dụng vào container
COPY . .

# Expose port 8000 (khớp với docker-compose)
EXPOSE 8000

# Lệnh khởi chạy ứng dụng (Mặc định gợi ý dùng FastAPI + Uvicorn)
# Lưu ý: Nếu file chính của bạn tên khác (vd app.py), hãy đổi "main:app" thành "app:app"
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
