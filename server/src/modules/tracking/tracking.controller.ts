// server/src/modules/tracking/tracking.controller.ts
import { Elysia, t } from "elysia";
import { TrackingService } from "./tracking.service";
import { AuthService } from "../auth/auth.service"; // Import Auth Service

export const trackingController = new Elysia({ prefix: "/api" })

  // 🔥 MIDDLEWARE: Cek Login Dulu
// 🔥 MIDDLEWARE: Cek Login (Support Cookie & Header)
  .derive(async ({ cookie, headers, set }) => {
    // 1. Coba ambil token dari Cookie (Cara Lama)
    let token = cookie.session_id?.value;

    // 2. Jika di Cookie kosong, coba ambil dari Header (Cara Baru Anti-Blokir)
    if (!token) {
        const authHeader = headers['authorization'];
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1]; // Ambil token setelah kata "Bearer"
        }
    }

    // 3. Validasi: Jika Token tidak ada di keduanya -> Error
    if (!token) {
      set.status = 401;
      throw new Error("Unauthorized: Token Missing");
    }

    // 4. Cek Session di Database
    const user = await AuthService.getSession(token);
    if (!user) {
        set.status = 401;
        throw new Error("Session Expired");
    }

    return { user }; // User sekarang tersedia di setiap request
  })

  // 1. GET PROJECTS (Untuk List Project)
  .get("/projects", async ({ user }) => {
    return await TrackingService.getProjects(user.id);
  })

  // 2. CREATE PROJECT
  .post("/projects", async ({ user, body }) => {
    const { title, description, startDate, deadline, priority } = body as any;
    return await TrackingService.createProject(user.id, title, description, startDate, deadline, priority);
  })

  // 3. DELETE PROJECT
  .delete("/projects/:id", async ({ params }) => {
    return await TrackingService.deleteProject(Number(params.id));
  })

  // 4. GET STATS & LEVEL (Endpoint Gabungan buat Dashboard & Profile)
  // Ini yang memperbaiki "NaN" dan "Guest"
  .get("/stats", async ({ user }) => {
    // Ambil Data Level & User Info
    const userData = await TrackingService.getUserLevel(user.id);
    
    // Ambil Data Chart (Grafik)
    const statsData = await TrackingService.getDashboardStats(user.id);

    // Gabungkan hasilnya
    return {
        // Data Diri
        username: userData?.username || "User",
        email: userData?.email,
        picture: userData?.picture, // Foto Profil Google
        level: userData?.level || 1,
        xp: userData?.xp || 0,
        
        // Data Grafik
        chartData: statsData.chartData
    };
  })

  // 5. TASKS (CRUD)
  .post("/tasks", async ({ body }) => {
    const { projectId, title, duration, targetCount, deadline, isRecurring, repeatFrequency, repeatInterval } = body as any;
    return await TrackingService.createTask(projectId, title, duration, targetCount, deadline, isRecurring, repeatFrequency, repeatInterval);
  })

  .delete("/tasks/:id", async ({ params }) => {
    return await TrackingService.deleteTask(Number(params.id));
  })

  .patch("/tasks/:id/check", async ({ params }) => {
    return await TrackingService.toggleTask(Number(params.id));
  })

  .patch("/tasks/:id/progress", async ({ params, body }) => {
    const { spentTime } = body as any;
    return await TrackingService.updateProgress(Number(params.id), spentTime);
  })
  
  .patch("/tasks/:id/increment", async ({ params }) => {
    return await TrackingService.incrementCount(Number(params.id));
  })

  // 6. GOALS (Side Quests)
  .get("/goals", async ({ user }) => {
    return await TrackingService.getGoals(user.id);
  })

  .post("/goals", async ({ user, body }) => {
    const { title, targetValue, unit } = body as any;
    return await TrackingService.createGoal(user.id, title, targetValue, unit);
  })

  .post("/goals/:id/increment", async ({ body, params }) => {
    const { amount } = body as any;
    return await TrackingService.incrementGoal(Number(params.id), amount || 1);
  })

  .delete("/goals/:id", async ({ params }) => {
    return await TrackingService.deleteGoal(Number(params.id));
  })

  // 7. CALENDAR
  .get("/calendar", async ({ user }) => {
    return await TrackingService.getCalendarData(user.id);
  });