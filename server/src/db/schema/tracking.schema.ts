// server/src/db/schema/tracking.schema.ts
import { pgTable, text, serial, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm"; 
import { users } from "./auth.schema"; 

export const taskTypeEnum = pgEnum("task_type", ["SINGLE", "REPEATING"]);

// 1. PROJECTS
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  
  // 🔥 KOLOM BARU: PRIORITY
  // Value: 'HIGH', 'MEDIUM', 'LOW'
  priority: text("priority").default("MEDIUM"), 
  
  startDate: timestamp("start_date").defaultNow(),
  deadline: timestamp("deadline"),
  createdAt: timestamp("created_at").defaultNow(),
});

// 2. TASKS
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id).notNull(),
  title: text("title").notNull(),
  type: text("type").default("SINGLE"), 
  isCompleted: boolean("is_completed").default(false),
  
  duration: integer("duration").default(0),
  spentTime: integer("spent_time").default(0),
  targetCount: integer("target_count").default(1),
  currentCount: integer("current_count").default(0),
  deadline: timestamp("deadline"),
  
  isRecurring: boolean("is_recurring").default(false),
  repeatFrequency: text("repeat_frequency"), 
  repeatInterval: integer("repeat_interval").default(1),
  lastResetAt: timestamp("last_reset_at"),

  createdAt: timestamp("created_at").defaultNow(),
});

// 3. TASK LOGS
export const taskLogs = pgTable("task_logs", {
  id: serial("id").primaryKey(),
  taskId: integer("task_id").references(() => tasks.id).notNull(),
  completedAt: timestamp("completed_at").defaultNow(),
});

// 4. GOALS / QUESTS
export const goals = pgTable("goals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  unit: text("unit").default("item"),
  targetValue: integer("target_value").notNull(),
  currentValue: integer("current_value").default(0),
  isCompleted: boolean("is_completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// 5. PUBLIC IDEAS (Kotak Saran)
// Ini tabel buat nampung ide dari orang asing
export const publicIdeas = pgTable("public_ideas", {
  id: serial("id").primaryKey(),
  senderName: text("sender_name").default("Anonim"), // Nama pengirim (opsional)
  content: text("content").notNull(), // Isi ide
  isApproved: boolean("is_approved").default(false), // 🔥 Default FALSE biar gak langsung muncul (Moderasi)
  createdAt: timestamp("created_at").defaultNow(),
});

// --- RELASI ---
export const projectsRelations = relations(projects, ({ many }) => ({
  tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
  logs: many(taskLogs),
}));

export const taskLogsRelations = relations(taskLogs, ({ one }) => ({
  task: one(tasks, {
    fields: [taskLogs.taskId],
    references: [tasks.id],
  }),
}));

export const goalsRelations = relations(goals, ({ one }) => ({
  user: one(users, {
    fields: [goals.userId],
    references: [users.id],
  }),
}));