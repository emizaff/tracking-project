// admin-dashboard/src/types/index.ts

export type TaskType = "SINGLE" | "REPEATING" | "TIMER";

export interface TaskLog {
  id: number;
  completedAt: string;
}

export interface Task {
  id: number;
  projectId: number;
  title: string;
  type: TaskType;
  isCompleted: boolean;
  logs: TaskLog[];

  // 🔥 DATA TAMBAHAN (Sesuai Backend)
  duration?: number;       // Untuk Timer
  spentTime?: number;      // Waktu terpakai
  targetCount?: number;    // Target hitungan (misal 10x)
  currentCount?: number;   // Hitungan saat ini
  isRecurring?: boolean;   // Apakah berulang?
  repeatFrequency?: string;// DAILY, WEEKLY, dll
  
  // 👇 INI YANG BIKIN ERROR (TADI HILANG)
  deadline?: string | null; 
}

export interface Project {
  id: number;
  title: string;
  description?: string;
  startDate?: string;
  deadline?: string;
  
  // 🔥 KOLOM BARU: PRIORITY
  priority: 'HIGH' | 'MEDIUM' | 'LOW'; 
  
  tasks: Task[];
}

export interface CalendarData {
  habits: string[]; 
  deadlines: { 
    date: string; 
    title: string; 
    projectId: number; 
  }[];
}