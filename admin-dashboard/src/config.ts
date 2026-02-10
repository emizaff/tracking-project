// admin-dashboard/src/config.ts

// Cek apakah kita lagi mode development (localhost) atau production (online)
const IS_LOCAL = import.meta.env.DEV;

export const API_BASE_URL = IS_LOCAL
  ? "http://localhost:3000" // Kalau di laptop, pake localhost
  : "https://disastrous-thekla-puchy-e6c69f50.koyeb.app"; // 🔥 Kalau Online, pake Koyeb!

export const GOOGLE_CLIENT_ID = "884684234418-gcnhiv92aeam0nme8d6j6aoml1munmn2.apps.googleusercontent.com"; 
// (Kalau Client ID lu aman terekspos di frontend, kalau gak mau ribet biarin string kosong dulu gapapa, karena login diurus backend)