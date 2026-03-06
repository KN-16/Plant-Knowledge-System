FROM node:18-alpine

WORKDIR /app

# Copy file config và cài package trước để tận dụng cache của Docker
COPY package*.json ./
RUN npm install

# Copy toàn bộ source code
COPY . .

# Port mà backend của bạn lắng nghe (ví dụ 5000)
EXPOSE 3000

# Lệnh chạy BE (Tùy theo cấu hình package.json của bạn)
# CMD ["npm", "start"]
CMD ["sh", "-c", "node seed.js && npm start"]