// // src/services/api.js

import axios from "axios";
import Swal from "sweetalert2";
// Base axios (KHÔNG interceptor – dùng cho refresh)
const baseURL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL,
    withCredentials: true,
});

// ----------------------------
// 1. REQUEST INTERCEPTOR
// ----------------------------
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// ----------------------------
// 2. RESPONSE INTERCEPTOR
// ----------------------------
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error);
        } else {
            resolve(token);
        }
    });

    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        // Không refresh khi login fail
        if (originalRequest.url.includes("/auth/login")) {
            return Promise.reject(error);
        }

        // Chỉ xử lý 401
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // CASE 1: Đang refresh → đưa request vào queue
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then((newToken) => {
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return api(originalRequest);
                });
            }

            // CASE 2: Request đầu tiên → bắt đầu refresh
            isRefreshing = true;

            try {
                // DÙNG axios thường (tránh loop interceptor)
                const { data } = await axios.post(
                    `${baseURL}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                const newToken = data.token;

                // Lưu token mới
                localStorage.setItem("token", newToken);

                // Giải quyết queue
                processQueue(null, newToken);

                // Retry request gốc
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);

            } catch (refreshError) {
                processQueue(refreshError, null);
                // Refresh fail → logout
                localStorage.removeItem("token");
                await Swal.fire({
                title: 'Phiên đăng nhập hết hạn',
                text: 'Vui lòng đăng nhập lại.',
                icon: 'warning',
                timer: 2000,
                showConfirmButton: false,
                })

                // Điều hướng về login (React)
                window.location.href = '/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;