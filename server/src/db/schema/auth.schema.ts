// server/src/db/schema/auth.schema.ts
import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").unique().notNull(), 
  username: text("username"), 
  googleId: text("google_id").unique(), // Tetap ada (Fitur Google Login)
  picture: text("picture"), 
  password: text("password"), 
  
  // 🔥 FITUR GAMIFIKASI (BARU)
  xp: integer("xp").default(0),
  level: integer("level").default(1),
  
  createdAt: text("created_at").default(new Date().toISOString())
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  expiresAt: integer("expires_at").notNull()
});

// RELASI (TETAP SAMA)
export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));