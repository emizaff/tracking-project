import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { rateLimit } from "elysia-rate-limit";
import { authController } from "./modules/auth/auth.controller";
import { trackingController } from "./modules/tracking/tracking.controller";

// 🔥 IMPORT DATABASE
import { db } from "./db";
import { publicIdeas, goals } from "./db/schema/tracking.schema";
import { eq, desc } from "drizzle-orm";

const app = new Elysia()
  // ---------------------------------------------------------
  // 🛡️ SECURITY LAYER 1: RATE LIMIT GLOBAL
  // ---------------------------------------------------------
  .use(rateLimit({
      duration: 60000, // 1 Menit
      max: 60,         // Maks 60 request
      responseMessage: "Terlalu banyak request. Santai dulu bang! ☕",
      countFailedRequest: true
  }))

  // ---------------------------------------------------------
  // 🛡️ SECURITY LAYER 2: CORS (FIXED & CORRECT)
  // ---------------------------------------------------------
  .use(cors({
      // ✅ ORIGIN YANG BENAR (String atau Array String)
      origin: "https://faiq-tracking-project.netlify.app", // Khusus Prod
      // Kalau mau dev lokal juga bisa pakai function:
      // origin: (request) => {
      //    const origin = request.headers.get('origin');
      //    if (origin === 'http://localhost:5173') return true;
      //    if (origin === 'https://faiq-tracking-project.netlify.app') return true;
      //    return false;
      // },

      credentials: true, // 🔥 WAJIB TRUE BIAR COOKIE MASUK
      allowedHeaders: ['Content-Type', 'Authorization'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
  }))

  // --- GLOBAL ERROR HANDLER ---
  .onError(({ code, error, set }) => {
    if (code === 'VALIDATION') {
      set.status = 400;
      // @ts-ignore
      const firstError = error.all ? error.all[0] : error; 
      return { 
        success: false, 
        // @ts-ignore
        message: firstError.schema ? firstError.schema.error : `Data tidak valid` 
      };
    }
    if (code === 'NOT_FOUND') {
        set.status = 404;
        return { success: false, message: "Endpoint tidak ditemukan" };
    }
    
    console.error("🔥 SERVER ERROR:", error);
    return { success: false, message: error.message || "Terjadi kesalahan internal" };
  })

  // ---------------------------------------------------------
  // 🔥 LOAD MODULES UTAMA (SETELAH CORS!)
  // ---------------------------------------------------------
  .use(authController)      // 👈 Login/Register/Logout
  .use(trackingController)  // 👈 Dashboard Data

  // ---------------------------------------------------------
  // 🔥 GROUP 1: PUBLIC API (Goals, Projects, Ideas)
  // ---------------------------------------------------------
  .group("/public", (app) => 
      app
        .get("/goals", async () => {
            return await db.select().from(goals).limit(5); 
        })
        .get("/projects", async () => {
            try {
                // @ts-ignore
                return await db.query.projects.findMany({
                    with: { tasks: true },
                    // @ts-ignore
                    orderBy: (projects, { desc }) => [desc(projects.createdAt)],
                    limit: 6 // Batasi biar gak berat
                });
            } catch (error) {
                console.error("Error fetching public projects:", error);
                return [];
            }
        })
        .post("/ideas", async ({ body }) => {
            // @ts-ignore
            const { senderName, content } = body;
            
            if (!content || content.length > 500) {
                throw new Error("Isi ide tidak valid atau kepanjangan!");
            }

            await db.insert(publicIdeas).values({
                senderName: senderName || "Anonim",
                content,
                isApproved: false,
                // @ts-ignore
                createdAt: new Date(),
                // @ts-ignore
                updatedAt: new Date()
            });

            return { success: true, message: "Ide terkirim! Menunggu moderasi." };
        }, {
            body: t.Object({
                senderName: t.Optional(t.String()),
                content: t.String()
            })
        })
  )

  // ---------------------------------------------------------
  // 🔥 GROUP 2: ADMIN API (Untuk Halaman Inbox / Moderasi)
  // ---------------------------------------------------------
  .group("/admin", (app) => 
      app
        .get("/ideas", async () => {
            return await db.select().from(publicIdeas).orderBy(desc(publicIdeas.createdAt));
        })
        .patch("/ideas/:id/approve", async ({ params }) => {
            await db.update(publicIdeas)
                .set({ isApproved: true })
                .where(eq(publicIdeas.id, Number(params.id)));
            return { success: true, message: "Ide disetujui!" };
        })
        .delete("/ideas/:id", async ({ params }) => {
            await db.delete(publicIdeas)
                .where(eq(publicIdeas.id, Number(params.id)));
            return { success: true, message: "Ide dihapus!" };
        })
  )
  
  // 🔥 PENTING BUAT KOYEB/RENDER: LISTEN KE 0.0.0.0
  .listen({
      port: process.env.PORT || 3000,
      hostname: "0.0.0.0"
  });

console.log(`🦊 Server Secured via Koyeb: 0.0.0.0:${process.env.PORT || 3000}`);