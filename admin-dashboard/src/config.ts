// admin-dashboard/src/config.ts

// Ini config pintar:
// Kalau di laptop (dev), dia pake localhost:3000.
// Kalau nanti di-deploy (production), dia bakal baca settingan server aslinya.
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";