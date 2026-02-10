import { eq, desc, and } from "drizzle-orm";
import { db } from "../../db";
import { missions, ideas, resolutions } from "../../db/schema";

export const AppService = {
  // --- MISSIONS (Misi Harian) ---
  async getMissions(userId: number) {
    return await db.query.missions.findMany({
      where: eq(missions.userId, userId),
      orderBy: [desc(missions.createdAt)], // Yang baru di atas
    });
  },

  async createMission(userId: number, title: string, reward: number = 0, deadline: string | null = null) {
    return await db.insert(missions).values({ userId, title, reward, deadline }).returning();
  },

  async toggleMission(id: number, userId: number, isCompleted: boolean) {
    return await db
      .update(missions)
      .set({ isCompleted })
      .where(and(eq(missions.id, id), eq(missions.userId, userId))) // Pastikan punya user sendiri
      .returning();
  },

  async deleteMission(id: number, userId: number) {
    return await db
      .delete(missions)
      .where(and(eq(missions.id, id), eq(missions.userId, userId)));
  },

  // --- IDEAS (Ide/Notes) ---
  async getIdeas(userId: number) {
    return await db.query.ideas.findMany({
      where: eq(ideas.userId, userId),
      orderBy: [desc(ideas.createdAt)],
    });
  },

  async createIdea(userId: number, content: string) {
    return await db.insert(ideas).values({ userId, content }).returning();
  },

  async deleteIdea(id: number, userId: number) {
    return await db
      .delete(ideas)
      .where(and(eq(ideas.id, id), eq(ideas.userId, userId)));
  },

  // --- RESOLUTIONS (Target Tahunan) ---
  async getResolutions(userId: number) {
    return await db.query.resolutions.findMany({
      where: eq(resolutions.userId, userId),
    });
  },

  async createResolution(userId: number, title: string, target: number) {
    return await db.insert(resolutions).values({ userId, title, targetAmount: target }).returning();
  },

  async updateResolutionProgress(id: number, userId: number, currentAmount: number) {
    return await db
      .update(resolutions)
      .set({ currentAmount })
      .where(and(eq(resolutions.id, id), eq(resolutions.userId, userId)))
      .returning();
  }
};