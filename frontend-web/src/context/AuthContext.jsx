import { useState, useEffect } from "react";
import { AuthContext } from "./useAuthContext";
import adminService from "../services/adminService";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // ⬅️ Khai báo trước (fix lỗi hoisting)
    const logout = async () => {
        try {
            await adminService.logout();
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
                const res = await adminService.getMyProfile();
                setUser(res);
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
        const res = await adminService.login({ identifier: username, password });
        localStorage.setItem("accessToken", res.accessToken);
        setUser(res.user);
        return;
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
