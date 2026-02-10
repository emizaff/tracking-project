// client/src/lib/api.ts
const API_URL = "http://localhost:3000";

export const api = {
  async post(endpoint: string, body: any) {
    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      // Coba parsing JSON apapun statusnya (200, 400, 500)
      const data = await res.json().catch(() => null);

      // Jika parsing gagal (misal server mati/kirim HTML), return error manual
      if (!data) return { success: false, message: `Server Error (${res.status})` };

      // Kembalikan data aslinya (yang sudah diformat oleh onError backend tadi)
      return data;

    } catch (error) {
      console.error("Network Error:", error);
      return { success: false, message: "Gagal terhubung ke server (Cek koneksi)" };
    }
  },

  async get(endpoint: string) {
    try {
        const res = await fetch(`${API_URL}${endpoint}`, { 
            method: "GET", 
            credentials: "include" 
        });
        if (!res.ok) return null;
        return await res.json();
    } catch (e) { return null; }
  }
};