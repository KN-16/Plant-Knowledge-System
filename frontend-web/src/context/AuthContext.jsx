import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";
import { AuthContext } from "./useAuthContext";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // ⬅️ Khai báo trước (fix lỗi hoisting)
    const logout = async () => {
        try {
            await api.post("/auth/logout");
        } catch (err) {
            // ignore
        }

        localStorage.removeItem("accessToken");
        setUser(null);
    };

    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem("accessToken");

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const res = await api.get("/auth/me");
                setUser(res.data);
            } catch (err) {
                // Nếu vào đây nghĩa là Token hết hạn VÀ Refresh Token cũng hết hạn/không hợp lệ
                console.log("Session expired or invalid");
                console.error(err);
                localStorage.removeItem("accessToken");
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const login = async (username, password) => {
        const res = await api.post("/auth/login", { identifier: username, password });
        localStorage.setItem("accessToken", res.data.accessToken);
        setUser(res.data.user);
        return;
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
