// admin-dashboard/src/services/trackingService.ts
import type { Project, CalendarData, Task } from "../types";
import { API_BASE_URL } from "../config"; 

const API_URL = `${API_BASE_URL}/tracking`;
const ROOT_API = API_BASE_URL;

// 🔥 Helper Fetcher (Tetap Sama)
const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const res = await fetch(endpoint, {
      ...options,
      credentials: "include", 
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      try {
        const jsonError = JSON.parse(errorText);
        throw new Error(jsonError.message || `Error ${res.status}`);
      } catch (e) {
        throw new Error(errorText || `Error ${res.status}`);
      }
    }

    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await res.json();
    }
    return true; 
    
  } catch (error) {
    console.error("Fetch Error:", error);
    throw error;
  }
};

export const TrackingService = {
  // --- 1. PROJECTS ---
  getProjects: async (): Promise<Project[]> => {
    return await fetchWithAuth(`${API_URL}/projects`);
  },

  createProject: async (title: string, description?: string, startDate?: string, deadline?: string, priority: string = "MEDIUM") => {
    return await fetchWithAuth(`${API_URL}/projects`, {
      method: "POST",
      body: JSON.stringify({ title, description, startDate, deadline, priority }),
    });
  },

  deleteProject: async (projectId: number) => {
    return await fetchWithAuth(`${API_URL}/projects/${projectId}`, { method: "DELETE" });
  },

  // --- 2. TASKS (🔥 INI YANG SAYA PERBAIKI BIAR GAK ERROR) ---
  // Kita kembalikan ke parameter terpisah biar SmartTaskInput.tsx gak kaget
  createTask: async (
    arg1: any, 
    title?: string, 
    duration: number = 0, 
    targetCount: number = 1, 
    deadline?: string, 
    isRecurring: boolean = false, 
    repeatFrequency?: string, 
    repeatInterval: number = 1
  ) => {
    let payload;

    // 🕵️‍♂️ DETEKSI: Apakah arg1 itu Object? (Cara Lama)
    if (typeof arg1 === 'object' && arg1 !== null) {
        payload = arg1; 
    } 
    // 🕵️‍♂️ Kalau bukan Object, berarti dia Angka (Project ID) -> (Cara Baru/Parameter Terpisah)
    else {
        payload = {
            projectId: arg1,
            title,
            duration,
            targetCount,
            deadline,
            isRecurring,
            repeatFrequency,
            repeatInterval
        };
    }

    // Kirim Payload yang sudah rapi ke Server
    return await fetchWithAuth(`${API_URL}/tasks`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  deleteTask: async (taskId: number) => { 
      return await fetchWithAuth(`${API_URL}/tasks/${taskId}`, { method: "DELETE" }); 
  },

  toggleTask: async (taskId: number) => { 
      return await fetchWithAuth(`${API_URL}/tasks/${taskId}/check`, { method: "PATCH" }); 
  },

  updateProgress: async (taskId: number, spentTime: number) => {
    return await fetchWithAuth(`${API_URL}/tasks/${taskId}/progress`, {
      method: "PATCH",
      body: JSON.stringify({ spentTime }),
    });
  },

  incrementCount: async (taskId: number) => { 
      return await fetchWithAuth(`${API_URL}/tasks/${taskId}/increment`, { method: "PATCH" }); 
  },

  // --- 3. CALENDAR & STATS ---
  getCalendarData: async (): Promise<CalendarData> => {
    const res = await fetchWithAuth(`${API_URL}/calendar`);
    if (!res) return { habits: [], deadlines: [] };
    return res;
  },

  getDashboardStats: async () => { return await fetchWithAuth(`${API_URL}/stats`); },

  getUserLevel: async () => { 
      return await fetchWithAuth(`${API_URL}/stats`); 
  },

  // --- 4. GOALS / QUESTS ---
  getGoals: async () => {
    return await fetchWithAuth(`${API_URL}/goals`);
  },

  createGoal: async (title: string, targetValue: number, unit: string = "item") => {
    return await fetchWithAuth(`${API_URL}/goals`, {
      method: "POST",
      body: JSON.stringify({ title, targetValue, unit }),
    });
  },

  incrementGoal: async (goalId: number, amount: number = 1) => {
    return await fetchWithAuth(`${API_URL}/goals/${goalId}/increment`, { 
        method: "POST", 
        body: JSON.stringify({ amount }) 
    });
  },

  deleteGoal: async (goalId: number) => {
    return await fetchWithAuth(`${API_URL}/goals/${goalId}`, { method: "DELETE" });
  },

  // --- 5. PUBLIC IDEAS MANAGEMENT ---
  getPublicIdeas: async () => {
    return await fetchWithAuth(`${ROOT_API}/admin/ideas`);
  },

  approveIdea: async (id: number) => {
    return await fetchWithAuth(`${ROOT_API}/admin/ideas/${id}/approve`, { method: "PATCH" });
  },

  deleteIdea: async (id: number) => {
    return await fetchWithAuth(`${ROOT_API}/admin/ideas/${id}`, { method: "DELETE" });
  },

  // --- BACKUP & RESTORE ---
  exportData: async () => {
    try {
        const [projects, goals, userLevel] = await Promise.all([
            TrackingService.getProjects(),
            TrackingService.getGoals(),
            TrackingService.getUserLevel()
        ]);
        const vault = JSON.parse(localStorage.getItem('focus_grimoire_notes') || '[]');

        const data = {
            projects, goals, userLevel, vault,
            exportedAt: new Date().toISOString(),
            version: '2.0'
        };
        
        return JSON.stringify(data, null, 2);
    } catch (error) {
        console.error("Gagal Export Data:", error);
        throw new Error("Gagal mengambil data dari server untuk backup.");
    }
  },

  importData: async (jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.vault && Array.isArray(data.vault)) {
          localStorage.setItem('focus_grimoire_notes', JSON.stringify(data.vault));
      }
      return true;
    } catch (error) {
      console.error("Gagal Import:", error);
      return false;
    }
  }
};