// server/src/modules/tracking/tracking.service.ts
import { eq, desc, and, isNotNull, inArray, sql, gte } from "drizzle-orm";
import { db } from "../../db";
import { projects, tasks, taskLogs, goals } from "../../db/schema/tracking.schema"; 
import { users } from "../../db/schema/auth.schema"; 

export const TrackingService = {
  
  // 🔥 AUTO RESET TASK RUTIN
  async checkAndResetRecurringTasks(userId: number) {
    const recurringTasks = await db.select()
        .from(tasks)
        .innerJoin(projects, eq(tasks.projectId, projects.id))
        .where(and(
            eq(projects.userId, userId),
            eq(tasks.isRecurring, true)
        ));

    const now = new Date();

    for (const { tasks: task } of recurringTasks) {
        if (!task.lastResetAt) continue;

        const lastReset = new Date(task.lastResetAt);
        let shouldReset = false;

        if (task.repeatFrequency === 'DAILY') {
            if (now.toDateString() !== lastReset.toDateString() && now > lastReset) {
                const diffTime = Math.abs(now.getTime() - lastReset.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                if (diffDays >= (task.repeatInterval || 1)) shouldReset = true;
            }
        } 
        else if (task.repeatFrequency === 'WEEKLY') {
            const oneWeek = 1000 * 60 * 60 * 24 * 7;
            const diffTime = now.getTime() - lastReset.getTime();
            if (diffTime >= oneWeek * (task.repeatInterval || 1)) shouldReset = true;
        }
        else if (task.repeatFrequency === 'MONTHLY') {
             if (now.getMonth() !== lastReset.getMonth() && now > lastReset) shouldReset = true;
        }

        if (shouldReset) {
            await db.update(tasks).set({
                isCompleted: false,
                currentCount: 0,
                spentTime: 0,
                lastResetAt: now 
            }).where(eq(tasks.id, task.id));
        }
    }
  },

  // --- 1. PROJECTS ---

  async getProjects(userId: number) {
    await this.checkAndResetRecurringTasks(userId);

    const data = await db.query.projects.findMany({
      where: eq(projects.userId, userId),
      orderBy: [desc(projects.createdAt)],
      with: {
        tasks: {
          orderBy: [desc(tasks.createdAt)],
          with: { 
            logs: { limit: 5, orderBy: [desc(taskLogs.completedAt)] } 
          }
        }
      }
    }); 

    // 🔥 FITUR BARU: SORTING PRIORITAS (High -> Medium -> Low)
    return data.sort((a, b) => {
        const priorityScore: Record<string, number> = { HIGH: 3, MEDIUM: 2, LOW: 1 };
        const scoreA = priorityScore[a.priority || 'MEDIUM'] || 2;
        const scoreB = priorityScore[b.priority || 'MEDIUM'] || 2;
        
        // Urutkan skor tertinggi (HIGH) di atas
        if (scoreA !== scoreB) return scoreB - scoreA;
        
        // Jika skor sama, yang terbaru di atas
        return b.id - a.id;
    });
  },

  // 🔥 FITUR BARU: Parameter 'priority' ditambahkan
  async createProject(userId: number, title: string, description?: string, startDate?: string, deadline?: string, priority: string = "MEDIUM") {
    const start = startDate ? new Date(`${startDate}T12:00:00`) : new Date();
    const end = deadline ? new Date(`${deadline}T12:00:00`) : null;
    
    return await db.insert(projects).values({ 
        userId, 
        title, 
        description, 
        startDate: start, 
        deadline: end, 
        priority // 👈 Disimpan ke DB
    }).returning();
  },

  async deleteProject(projectId: number) {
    const projectTasks = await db.select({ id: tasks.id }).from(tasks).where(eq(tasks.projectId, projectId));
    const taskIds = projectTasks.map(t => t.id);

    if (taskIds.length > 0) {
        await db.delete(taskLogs).where(inArray(taskLogs.taskId, taskIds));
        await db.delete(tasks).where(eq(tasks.projectId, projectId));
    }
    return await db.delete(projects).where(eq(projects.id, projectId));
  },

  // --- 2. TASKS ---

  async createTask(
    projectId: number, 
    title: string, 
    duration: number = 0, 
    targetCount: number = 1, 
    deadline?: string,
    isRecurring: boolean = false,
    repeatFrequency?: string,
    repeatInterval: number = 1
  ) {
    let derivedType = "SINGLE";
    if (duration > 0) derivedType = "TIMER";
    else if (targetCount > 1) derivedType = "REPEATING";

    const deadlineDate = deadline ? new Date(deadline) : null;

    return await db.insert(tasks).values({ 
        projectId, title, type: derivedType, duration, spentTime: 0, targetCount: targetCount || 1, currentCount: 0, deadline: deadlineDate,
        isRecurring, repeatFrequency, repeatInterval, lastResetAt: new Date()
    }).returning();
  },

  async incrementCount(taskId: number) {
    const task = await db.query.tasks.findFirst({ where: eq(tasks.id, taskId) });
    if (!task) throw new Error("Task not found");

    const newCount = (task.currentCount || 0) + 1;
    const target = task.targetCount || 1;
    const isNowCompleted = newCount >= target;

    return await db.update(tasks).set({ currentCount: newCount, isCompleted: isNowCompleted }).where(eq(tasks.id, taskId)).returning();
  },

  async updateProgress(taskId: number, additionalSeconds: number) {
    return await db.update(tasks).set({ spentTime: sql`${tasks.spentTime} + ${additionalSeconds}` }).where(eq(tasks.id, taskId)).returning();
  },

  async deleteTask(taskId: number) {
     await db.delete(taskLogs).where(eq(taskLogs.taskId, taskId));
     return await db.delete(tasks).where(eq(tasks.id, taskId));
  },

  // GAMIFIKASI XP SYSTEM (TASK)
  async toggleTask(taskId: number) {
    const task = await db.query.tasks.findFirst({ 
        where: eq(tasks.id, taskId),
        with: { project: true } 
    });
    
    if (!task) throw new Error("Task not found");
    
    const newState = !task.isCompleted;
    await db.update(tasks).set({ isCompleted: newState }).where(eq(tasks.id, taskId));

    let xpGained = 0;
    let newLevel = 0;

    if (newState) {
        await db.insert(taskLogs).values({ taskId });
        const userId = task.project.userId;
        const currentUser = await db.query.users.findFirst({ where: eq(users.id, userId) });
        if (currentUser) {
            const currentXp = currentUser.xp || 0;
            const addedXp = 10; 
            const totalXp = currentXp + addedXp;
            const calculatedLevel = 1 + Math.floor(totalXp / 100);
            
            await db.update(users).set({ xp: totalXp, level: calculatedLevel }).where(eq(users.id, userId));
            xpGained = addedXp;
            newLevel = calculatedLevel;
        }
    }
    return { success: true, newState, xpGained, newLevel };
  },

  // --- 3. CALENDAR & STATS ---
  async getCalendarData(userId: number) {
    const toISODate = (date: Date) => date.toISOString().split('T')[0];
    const projectDeadlines = await db.query.projects.findMany({
      where: and(eq(projects.userId, userId), isNotNull(projects.deadline)),
      columns: { id: true, title: true, deadline: true }
    });
    return { habits: [], deadlines: projectDeadlines.map(p => ({ date: toISODate(p.deadline!), title: `📢 Project: ${p.title}`, projectId: p.id })) };
  },

  async getDashboardStats(userId: number) {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); 
      sevenDaysAgo.setHours(0,0,0,0);

      const logs = await db.select({ completedAt: taskLogs.completedAt })
          .from(taskLogs)
          .innerJoin(tasks, eq(taskLogs.taskId, tasks.id))
          .innerJoin(projects, eq(tasks.projectId, projects.id))
          .where(and(
              eq(projects.userId, userId),
              gte(taskLogs.completedAt, sevenDaysAgo)
          ));

      const statsMap = new Map<string, number>();
      for (let i = 0; i < 7; i++) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const key = d.toLocaleDateString('id-ID', { weekday: 'short' }); 
          if (!statsMap.has(key)) statsMap.set(key, 0);
      }

      logs.forEach(log => {
          if (log.completedAt) {
              const key = log.completedAt.toLocaleDateString('id-ID', { weekday: 'short' });
              statsMap.set(key, (statsMap.get(key) || 0) + 1);
          }
      });

      const chartData = Array.from(statsMap).map(([name, total]) => ({ name, total })).reverse();
      return { chartData };
  },

  async getUserLevel(userId: number) {
    const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
        columns: { xp: true, level: true, username: true, email: true, picture: true }
    });
    return user;
  },

  // 🔥 4. GOALS / QUESTS
  
  async getGoals(userId: number) {
      return await db.select().from(goals).where(eq(goals.userId, userId));
  },

  async createGoal(userId: number, title: string, targetValue: number, unit: string = "item") {
      return await db.insert(goals).values({
          userId,
          title,
          targetValue,
          unit,
          currentValue: 0,
          isCompleted: false
      }).returning();
  },

  async incrementGoal(goalId: number, incrementBy: number = 1) {
      const goal = await db.select().from(goals).where(eq(goals.id, goalId)).limit(1);
      if (!goal.length) throw new Error("Goal not found");

      const current = goal[0];
      const newValue = (current.currentValue || 0) + incrementBy;
      const isCompleted = newValue >= current.targetValue;

      await db.update(goals).set({ currentValue: newValue, isCompleted: isCompleted }).where(eq(goals.id, goalId));

      let xpGained = 0;
      if (isCompleted && !current.isCompleted) {
          const currentUser = await db.query.users.findFirst({ where: eq(users.id, current.userId) });
          if (currentUser) {
             xpGained = 100;
             const newXp = (currentUser.xp || 0) + xpGained;
             const newLevel = 1 + Math.floor(newXp / 100);
             await db.update(users).set({ xp: newXp, level: newLevel }).where(eq(users.id, current.userId));
          }
      }

      return { success: true, newValue, isCompleted, xpGained };
  },

  async deleteGoal(goalId: number) {
      return await db.delete(goals).where(eq(goals.id, goalId));
  }
};