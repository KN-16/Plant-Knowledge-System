# ---- STAGE 1: BUILD ----
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Nhận biến môi trường từ docker-compose để nhúng vào build của Vite
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

# Lệnh build của Vite (sẽ sinh ra thư mục /app/dist)
RUN npm run build


# ---- STAGE 2: SERVE bằng NGINX ----
FROM nginx:alpine

# Xóa trang mặc định của Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copy file cấu hình Nginx custom
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy thư mục dist từ Stage 1 sang thư mục host của Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]