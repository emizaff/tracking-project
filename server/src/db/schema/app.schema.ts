//server\src\db\schema\app.schema.ts
import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./auth.schema"; // Import users buat relasi

// 1. TABEL MISI (Tasks)
export const missions = pgTable("missions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(), // Punya siapa?
  title: text("title").notNull(),
  isCompleted: boolean("is_completed").default(false),
  reward: integer("reward").default(0), // Misal: Rp 10.000 per misi
  deadline: text("deadline"), // Format YYYY-MM-DD
  createdAt: timestamp("created_at").defaultNow(),
});

// 2. TABEL RESOLUSI (Goals Tahunan)
export const resolutions = pgTable("resolutions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  targetAmount: integer("target_amount").default(0), // Target uang/angka
  currentAmount: integer("current_amount").default(0), // Progres saat ini
  year: integer("year").default(2026),
});

// 3. TABEL IDE (Notes)
export const ideas = pgTable("ideas", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// --- RELASI (Agar enak saat query) ---
export const missionsRelations = relations(missions, ({ one }) => ({
  user: one(users, { fields: [missions.userId], references: [users.id] }),
}));

export const resolutionsRelations = relations(resolutions, ({ one }) => ({
  user: one(users, { fields: [resolutions.userId], references: [users.id] }),
}));

export const ideasRelations = relations(ideas, ({ one }) => ({
  user: one(users, { fields: [ideas.userId], references: [users.id] }),
}));