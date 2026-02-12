// server/src/modules/public/public.controller.ts
import { Elysia } from "elysia";
import { TrackingService } from "../tracking/tracking.service";

export const publicController = new Elysia({ prefix: "/public" })
  .get("/projects", async () => {
    try {
      // HARDCODE ID: 1 (Asumsi Anda adalah user pertama/admin)
      // Ini akan mengambil semua project milik user ID 1 beserta tasks-nya
      const projects = await TrackingService.getProjects(1);
      
      // Kembalikan dalam format object agar konsisten dengan frontend
      return { 
        success: true, 
        data: projects 
      };
    } catch (error) {
      console.error("Public Project Error:", error);
      return { success: false, data: [] };
    }
  });