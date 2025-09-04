import {
  users,
  screeningAssessments,
  appointments,
  forumPosts,
  forumReplies,
  resources,
  moodEntries,
  crisisAlerts,
  counselors,
  chatSessions,
  customPersonalities,
  type User,
  type InsertUser,
  type ScreeningAssessment,
  type InsertScreeningAssessment,
  type Appointment,
  type InsertAppointment,
  type ForumPost,
  type InsertForumPost,
  type ForumReply,
  type InsertForumReply,
  type Resource,
  type MoodEntry,
  type InsertMoodEntry,
  type CrisisAlert,
  type InsertCrisisAlert,
  type Counselor,
  type ChatSession,
  type CustomPersonality,
  type InsertCustomPersonality,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, sql, count } from "drizzle-orm";

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;

  // Screening assessments
  createScreeningAssessment(assessment: InsertScreeningAssessment): Promise<ScreeningAssessment>;
  getUserScreeningHistory(userId: string, type?: string): Promise<ScreeningAssessment[]>;
  getLatestScreening(userId: string, type: string): Promise<ScreeningAssessment | undefined>;

  // Appointments
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  getUserAppointments(userId: string): Promise<Appointment[]>;
  getCounselorAppointments(counselorId: string): Promise<Appointment[]>;
  updateAppointmentStatus(id: string, status: string): Promise<Appointment>;
  getCounselors(): Promise<Counselor[]>;

  // Forum
  createForumPost(post: InsertForumPost): Promise<ForumPost>;
  getForumPosts(category?: string): Promise<ForumPost[]>;
  getForumPostWithReplies(postId: string): Promise<ForumPost & { replies: ForumReply[] }>;
  createForumReply(reply: InsertForumReply): Promise<ForumReply>;
  likeForumPost(postId: string): Promise<void>;
  flagForumPost(postId: string): Promise<void>;

  // Resources
  getResources(category?: string, language?: string): Promise<Resource[]>;
  getResourceById(id: string): Promise<Resource | undefined>;
  likeResource(id: string): Promise<void>;

  // Mood tracking
  createMoodEntry(mood: InsertMoodEntry): Promise<MoodEntry>;
  getUserMoodHistory(userId: string, days?: number): Promise<MoodEntry[]>;

  // Crisis management
  createCrisisAlert(alert: InsertCrisisAlert): Promise<CrisisAlert>;
  getActiveCrisisAlerts(): Promise<CrisisAlert[]>;
  resolveCrisisAlert(id: string, resolvedBy: string, notes?: string): Promise<CrisisAlert>;

  // Chat sessions
  createChatSession(userId: string): Promise<ChatSession>;
  updateChatSession(id: string, messages: any[]): Promise<ChatSession>;
  getChatSession(id: string): Promise<ChatSession | undefined>;

  // Custom AI Personalities
  createCustomPersonality(personality: InsertCustomPersonality): Promise<CustomPersonality>;
  getUserCustomPersonalities(userId: string): Promise<CustomPersonality[]>;
  updateCustomPersonality(id: string, updates: Partial<CustomPersonality>): Promise<CustomPersonality>;
  deleteCustomPersonality(id: string, userId: string): Promise<void>;

  // Analytics (anonymized)
  getAnalytics(): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async createScreeningAssessment(assessment: InsertScreeningAssessment): Promise<ScreeningAssessment> {
    const [result] = await db
      .insert(screeningAssessments)
      .values(assessment)
      .returning();
    return result;
  }

  async getUserScreeningHistory(userId: string, type?: string): Promise<ScreeningAssessment[]> {
    let query = db
      .select()
      .from(screeningAssessments)
      .where(eq(screeningAssessments.userId, userId))
      .orderBy(desc(screeningAssessments.completedAt));
    
    if (type) {
      query = db
        .select()
        .from(screeningAssessments)
        .where(and(eq(screeningAssessments.userId, userId), eq(screeningAssessments.type, type)))
        .orderBy(desc(screeningAssessments.completedAt));
    }
    
    return await query;
  }

  async getLatestScreening(userId: string, type: string): Promise<ScreeningAssessment | undefined> {
    const [result] = await db
      .select()
      .from(screeningAssessments)
      .where(and(eq(screeningAssessments.userId, userId), eq(screeningAssessments.type, type)))
      .orderBy(desc(screeningAssessments.completedAt))
      .limit(1);
    
    return result || undefined;
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const [result] = await db.insert(appointments).values(appointment).returning();
    return result;
  }

  async getUserAppointments(userId: string): Promise<Appointment[]> {
    return await db
      .select()
      .from(appointments)
      .where(eq(appointments.userId, userId))
      .orderBy(desc(appointments.scheduledFor));
  }

  async getCounselorAppointments(counselorId: string): Promise<Appointment[]> {
    return await db
      .select()
      .from(appointments)
      .where(eq(appointments.counselorId, counselorId))
      .orderBy(desc(appointments.scheduledFor));
  }

  async updateAppointmentStatus(id: string, status: string): Promise<Appointment> {
    const [appointment] = await db
      .update(appointments)
      .set({ status })
      .where(eq(appointments.id, id))
      .returning();
    return appointment;
  }

  async getCounselors(): Promise<Counselor[]> {
    return await db.select().from(counselors).where(eq(counselors.isAvailable, true));
  }

  async createForumPost(post: InsertForumPost): Promise<ForumPost> {
    const [result] = await db.insert(forumPosts).values(post).returning();
    return result;
  }

  async getForumPosts(category?: string): Promise<ForumPost[]> {
    let query = db
      .select()
      .from(forumPosts)
      .where(eq(forumPosts.isModerated, true))
      .orderBy(desc(forumPosts.createdAt));
    
    if (category) {
      query = db
        .select()
        .from(forumPosts)
        .where(and(eq(forumPosts.category, category), eq(forumPosts.isModerated, true)))
        .orderBy(desc(forumPosts.createdAt));
    }
    
    return await query;
  }

  async getForumPostWithReplies(postId: string): Promise<ForumPost & { replies: ForumReply[] }> {
    const [post] = await db.select().from(forumPosts).where(eq(forumPosts.id, postId));
    const replies = await db
      .select()
      .from(forumReplies)
      .where(eq(forumReplies.postId, postId))
      .orderBy(forumReplies.createdAt);
    
    return { ...post, replies };
  }

  async createForumReply(reply: InsertForumReply): Promise<ForumReply> {
    const [result] = await db.insert(forumReplies).values(reply).returning();
    return result;
  }

  async likeForumPost(postId: string): Promise<void> {
    await db
      .update(forumPosts)
      .set({ likes: sql`${forumPosts.likes} + 1` })
      .where(eq(forumPosts.id, postId));
  }

  async flagForumPost(postId: string): Promise<void> {
    await db
      .update(forumPosts)
      .set({ isFlagged: true })
      .where(eq(forumPosts.id, postId));
  }

  async getResources(category?: string, language?: string): Promise<Resource[]> {
    const conditions = [];
    if (category) conditions.push(eq(resources.category, category));
    if (language) conditions.push(eq(resources.language, language));
    
    if (conditions.length > 0) {
      return await db
        .select()
        .from(resources)
        .where(and(...conditions))
        .orderBy(desc(resources.likes));
    }
    
    return await db
      .select()
      .from(resources)
      .orderBy(desc(resources.likes));
  }

  async getResourceById(id: string): Promise<Resource | undefined> {
    const [resource] = await db.select().from(resources).where(eq(resources.id, id));
    return resource || undefined;
  }

  async likeResource(id: string): Promise<void> {
    await db
      .update(resources)
      .set({ likes: sql`${resources.likes} + 1` })
      .where(eq(resources.id, id));
  }

  async createMoodEntry(mood: InsertMoodEntry): Promise<MoodEntry> {
    const [result] = await db.insert(moodEntries).values(mood).returning();
    return result;
  }

  async getUserMoodHistory(userId: string, days: number = 7): Promise<MoodEntry[]> {
    const since = new Date();
    since.setDate(since.getDate() - days);
    
    return await db
      .select()
      .from(moodEntries)
      .where(and(eq(moodEntries.userId, userId), gte(moodEntries.date, since)))
      .orderBy(moodEntries.date);
  }

  async createCrisisAlert(alert: InsertCrisisAlert): Promise<CrisisAlert> {
    const [result] = await db.insert(crisisAlerts).values(alert).returning();
    return result;
  }

  async getActiveCrisisAlerts(): Promise<CrisisAlert[]> {
    return await db
      .select()
      .from(crisisAlerts)
      .where(eq(crisisAlerts.isResolved, false))
      .orderBy(desc(crisisAlerts.createdAt));
  }

  async resolveCrisisAlert(id: string, resolvedBy: string, notes?: string): Promise<CrisisAlert> {
    const [alert] = await db
      .update(crisisAlerts)
      .set({
        isResolved: true,
        resolvedBy,
        notes,
        resolvedAt: new Date(),
      })
      .where(eq(crisisAlerts.id, id))
      .returning();
    return alert;
  }

  async createChatSession(userId: string): Promise<ChatSession> {
    const [session] = await db
      .insert(chatSessions)
      .values({ userId, messages: [] })
      .returning();
    return session;
  }

  async updateChatSession(id: string, messages: any[]): Promise<ChatSession> {
    const [session] = await db
      .update(chatSessions)
      .set({ messages })
      .where(eq(chatSessions.id, id))
      .returning();
    return session;
  }

  async getChatSession(id: string): Promise<ChatSession | undefined> {
    const [session] = await db.select().from(chatSessions).where(eq(chatSessions.id, id));
    return session || undefined;
  }

  async createCustomPersonality(personality: InsertCustomPersonality): Promise<CustomPersonality> {
    const [result] = await db.insert(customPersonalities).values(personality).returning();
    return result;
  }

  async getUserCustomPersonalities(userId: string): Promise<CustomPersonality[]> {
    return await db
      .select()
      .from(customPersonalities)
      .where(and(eq(customPersonalities.userId, userId), eq(customPersonalities.isActive, true)))
      .orderBy(desc(customPersonalities.createdAt));
  }

  async updateCustomPersonality(id: string, updates: Partial<CustomPersonality>): Promise<CustomPersonality> {
    const [personality] = await db
      .update(customPersonalities)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(customPersonalities.id, id))
      .returning();
    return personality;
  }

  async deleteCustomPersonality(id: string, userId: string): Promise<void> {
    await db
      .update(customPersonalities)
      .set({ isActive: false, updatedAt: new Date() })
      .where(and(eq(customPersonalities.id, id), eq(customPersonalities.userId, userId)));
  }

  async getAnalytics(): Promise<any> {
    // Anonymized analytics for institutional insights
    const [activeUsersCount] = await db
      .select({ count: count() })
      .from(users)
      .where(gte(users.updatedAt, new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))); // Last 30 days

    const [screeningsThisMonth] = await db
      .select({ count: count() })
      .from(screeningAssessments)
      .where(gte(screeningAssessments.completedAt, new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)));

    const [appointmentsCount] = await db
      .select({ count: count() })
      .from(appointments)
      .where(gte(appointments.createdAt, new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)));

    const [crisisAlertsCount] = await db
      .select({ count: count() })
      .from(crisisAlerts)
      .where(eq(crisisAlerts.isResolved, false));

    // Risk level distribution
    const riskDistribution = await db
      .select({
        riskLevel: screeningAssessments.riskLevel,
        count: count(),
      })
      .from(screeningAssessments)
      .where(gte(screeningAssessments.completedAt, new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)))
      .groupBy(screeningAssessments.riskLevel);

    return {
      activeUsers: activeUsersCount.count,
      screeningsCompleted: screeningsThisMonth.count,
      counselingSessions: appointmentsCount.count,
      highRiskAlerts: crisisAlertsCount.count,
      riskDistribution,
    };
  }
}

export const storage = new DatabaseStorage();
