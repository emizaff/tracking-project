// admin-dashboard/src/config.ts

// 🔍 Deteksi "Hardware": Cek langsung alamat di browser
const IS_LOCALHOST = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

export const API_BASE_URL = IS_LOCALHOST
  ? "http://localhost:3000" // Kalau browser bilang localhost, tembak localhost
  : "https://disastrous-thekla-puchy-e6c69f50.koyeb.app"; // 🔥 Kalau bukan, tembak Koyeb!

export const GOOGLE_CLIENT_ID = "884684234418-gcnhiv92aeam0nme8d6j6aoml1munmn2.apps.googleusercontent.com";