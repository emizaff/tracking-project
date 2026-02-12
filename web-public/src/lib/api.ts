// web-public/src/lib/api.ts

// Pastikan di Netlify Anda set Environment Variable: PUBLIC_API_URL
const API_URL = import.meta.env.PUBLIC_API_URL || "http://localhost:3000";

export const api = {
  // Method KHUSUS Data Public (Project List, Statistik)
  // Tidak pakai 'credentials: include' agar aman dari blokir browser
  async getPublic(endpoint: string) {
    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) { 
      console.error("Public API Error:", e);
      return null; 
    }
  },

  // Method KHUSUS Post Public (Kirim Ide)
  async postPublic(endpoint: string, body: any) {
    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      return await res.json();
    } catch (e) { return null; }
  }
};