// admin-dashboard/src/services/authService.ts
import { API_BASE_URL } from "../config";

export const AuthService = {
    
    // --- LOGIN (Tambahkan Ini) ---
    login: async (credentials: { email: string; password: string }) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(credentials),
                credentials: "include", // 🔥 WAJIB: Biar cookie session kesimpen
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Email atau password salah");
            }
            // 🔥 SIMPAN TOKEN KE LOCAL STORAGE
        if (data.token) {
            localStorage.setItem("auth_token", data.token);
        }

            return data;
        } catch (error) {
            console.error("Login Error:", error);
            throw error;
        }
    },

    // --- REGISTER ---
    register: async (userData: any) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
                credentials: "include",
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Gagal daftar");
            // 🔥 SIMPAN TOKEN KE LOCAL STORAGE
        if (data.token) {
            localStorage.setItem("auth_token", data.token);
        }
            return data;
        } catch (error) {
            console.error("Register Error:", error);
            throw error;
        }
    },

    // --- LOGOUT ---
    logout: async () => {
        try {
            await fetch(`${API_BASE_URL}/auth/logout`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });
            localStorage.removeItem("auth_token");
            return true;
        } catch (error) {
            console.error("Logout Error:", error);
            throw error;
        }
    }
};