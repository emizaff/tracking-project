import { Elysia, t } from "elysia";
import { AppService } from "./app.service";
import { AuthService } from "../auth/auth.service";

export const appController = new Elysia({ prefix: "/app" })
  
  // --- MIDDLEWARE PROTEKSI ---
  // Semua endpoint di bawah ini WAJIB login.
  // Kita cek cookie session, kalau valid, kita inject 'user' ke dalam request.
  .derive(async ({ cookie, set }) => {
    if (!cookie.session_id.value) {
      set.status = 401;
      throw new Error("Unauthorized");
    }
    const user = await AuthService.getSession(cookie.session_id.value);
    if (!user) {
      set.status = 401;
      throw new Error("Unauthorized");
    }
    return { user }; // Variable 'user' sekarang tersedia di semua handler
  })

  // --- 1. MISSIONS ---
  .get("/missions", async ({ user }) => {
    return await AppService.getMissions(user.id);
  })
  
  .post("/missions", async ({ user, body }) => {
    return await AppService.createMission(user.id, body.title, body.reward, body.deadline);
  }, {
    body: t.Object({
      title: t.String(),
      reward: t.Optional(t.Number()),
      deadline: t.Optional(t.String())
    })
  })

  .patch("/missions/:id", async ({ user, params, body }) => {
    return await AppService.toggleMission(parseInt(params.id), user.id, body.isCompleted);
  }, {
    body: t.Object({ isCompleted: t.Boolean() })
  })

  .delete("/missions/:id", async ({ user, params }) => {
    await AppService.deleteMission(parseInt(params.id), user.id);
    return { success: true };
  })

  // --- 2. IDEAS ---
  .get("/ideas", async ({ user }) => {
    return await AppService.getIdeas(user.id);
  })

  .post("/ideas", async ({ user, body }) => {
    return await AppService.createIdea(user.id, body.content);
  }, {
    body: t.Object({ content: t.String() })
  })

  .delete("/ideas/:id", async ({ user, params }) => {
    await AppService.deleteIdea(parseInt(params.id), user.id);
    return { success: true };
  })

  // --- 3. RESOLUTIONS ---
  .get("/resolutions", async ({ user }) => {
    return await AppService.getResolutions(user.id);
  })

  .post("/resolutions", async ({ user, body }) => {
    return await AppService.createResolution(user.id, body.title, body.targetAmount);
  }, {
    body: t.Object({ 
      title: t.String(),
      targetAmount: t.Number()
    })
  })

  .patch("/resolutions/:id", async ({ user, params, body }) => {
    return await AppService.updateResolutionProgress(parseInt(params.id), user.id, body.currentAmount);
  }, {
    body: t.Object({ currentAmount: t.Number() })
  });