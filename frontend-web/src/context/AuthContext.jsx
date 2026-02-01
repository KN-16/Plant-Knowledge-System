import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";
import { AuthContext } from "./useAuthContext";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // ⬅️ Khai báo trước (fix lỗi hoisting)
    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            try {
                const decoded = jwtDecode(token);

                // Kiểm tra hạn token
                if (decoded.exp * 1000 < Date.now()) {
                    logout();
                } else {
                    setUser(decoded);
                }
            } catch {
                logout();
            }
        }

        setLoading(false);
    }, []);

    const login = async (username, password) => {
        const res = await api.post("/auth/login", { identifier: username, password });
        localStorage.setItem("token", res.data.token);
        setUser(jwtDecode(res.data.token));
        return;
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
