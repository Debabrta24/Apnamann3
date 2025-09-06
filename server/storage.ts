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
  coinTransactions,
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
  type InsertResource,
  type MoodEntry,
  type InsertMoodEntry,
  type CrisisAlert,
  type InsertCrisisAlert,
  type Counselor,
  type ChatSession,
  type CustomPersonality,
  type InsertCustomPersonality,
  type CoinTransaction,
  type InsertCoinTransaction,
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
  createResource(resource: InsertResource): Promise<Resource>;
  createResourcesBulk(resources: InsertResource[]): Promise<Resource[]>;
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

  // Coin management
  addCoins(userId: string, amount: number, type: string, description: string, relatedEntityId?: string): Promise<CoinTransaction>;
  getUserCoinTransactions(userId: string, limit?: number): Promise<CoinTransaction[]>;
  getUserCoinBalance(userId: string): Promise<number>;

  // Analytics (anonymized)
  getAnalytics(): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db().select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db().select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db().select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db().insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const [user] = await db()
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async createScreeningAssessment(assessment: InsertScreeningAssessment): Promise<ScreeningAssessment> {
    const [result] = await db()
      .insert(screeningAssessments)
      .values(assessment)
      .returning();
    return result;
  }

  async getUserScreeningHistory(userId: string, type?: string): Promise<ScreeningAssessment[]> {
    let query = db()
      .select()
      .from(screeningAssessments)
      .where(eq(screeningAssessments.userId, userId))
      .orderBy(desc(screeningAssessments.completedAt));
    
    if (type) {
      query = db()
        .select()
        .from(screeningAssessments)
        .where(and(eq(screeningAssessments.userId, userId), eq(screeningAssessments.type, type)))
        .orderBy(desc(screeningAssessments.completedAt));
    }
    
    return await query;
  }

  async getLatestScreening(userId: string, type: string): Promise<ScreeningAssessment | undefined> {
    const [result] = await db()
      .select()
      .from(screeningAssessments)
      .where(and(eq(screeningAssessments.userId, userId), eq(screeningAssessments.type, type)))
      .orderBy(desc(screeningAssessments.completedAt))
      .limit(1);
    
    return result || undefined;
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const [result] = await db().insert(appointments).values(appointment).returning();
    return result;
  }

  async getUserAppointments(userId: string): Promise<Appointment[]> {
    return await db()
      .select()
      .from(appointments)
      .where(eq(appointments.userId, userId))
      .orderBy(desc(appointments.scheduledFor));
  }

  async getCounselorAppointments(counselorId: string): Promise<Appointment[]> {
    return await db()
      .select()
      .from(appointments)
      .where(eq(appointments.counselorId, counselorId))
      .orderBy(desc(appointments.scheduledFor));
  }

  async updateAppointmentStatus(id: string, status: string): Promise<Appointment> {
    const [appointment] = await db()
      .update(appointments)
      .set({ status })
      .where(eq(appointments.id, id))
      .returning();
    return appointment;
  }

  async getCounselors(): Promise<Counselor[]> {
    return await db().select().from(counselors).where(eq(counselors.isAvailable, true));
  }

  async createForumPost(post: InsertForumPost): Promise<ForumPost> {
    const [result] = await db().insert(forumPosts).values(post).returning();
    return result;
  }

  async getForumPosts(category?: string): Promise<ForumPost[]> {
    let query = db()
      .select()
      .from(forumPosts)
      .where(eq(forumPosts.isModerated, true))
      .orderBy(desc(forumPosts.createdAt));
    
    if (category) {
      query = db()
        .select()
        .from(forumPosts)
        .where(and(eq(forumPosts.category, category), eq(forumPosts.isModerated, true)))
        .orderBy(desc(forumPosts.createdAt));
    }
    
    return await query;
  }

  async getForumPostWithReplies(postId: string): Promise<ForumPost & { replies: ForumReply[] }> {
    const [post] = await db().select().from(forumPosts).where(eq(forumPosts.id, postId));
    const replies = await db()
      .select()
      .from(forumReplies)
      .where(eq(forumReplies.postId, postId))
      .orderBy(forumReplies.createdAt);
    
    return { ...post, replies };
  }

  async createForumReply(reply: InsertForumReply): Promise<ForumReply> {
    const [result] = await db().insert(forumReplies).values(reply).returning();
    return result;
  }

  async likeForumPost(postId: string): Promise<void> {
    await db()
      .update(forumPosts)
      .set({ likes: sql`${forumPosts.likes} + 1` })
      .where(eq(forumPosts.id, postId));
  }

  async flagForumPost(postId: string): Promise<void> {
    await db()
      .update(forumPosts)
      .set({ isFlagged: true })
      .where(eq(forumPosts.id, postId));
  }

  async getResources(category?: string, language?: string): Promise<Resource[]> {
    const conditions = [];
    if (category) conditions.push(eq(resources.category, category));
    if (language) conditions.push(eq(resources.language, language));
    
    if (conditions.length > 0) {
      return await db()
        .select()
        .from(resources)
        .where(and(...conditions))
        .orderBy(desc(resources.likes));
    }
    
    return await db()
      .select()
      .from(resources)
      .orderBy(desc(resources.likes));
  }

  async getResourceById(id: string): Promise<Resource | undefined> {
    const [resource] = await db().select().from(resources).where(eq(resources.id, id));
    return resource || undefined;
  }

  async createResource(resource: InsertResource): Promise<Resource> {
    const [result] = await db().insert(resources).values(resource).returning();
    return result;
  }

  async createResourcesBulk(resourcesData: InsertResource[]): Promise<Resource[]> {
    const results = await db().insert(resources).values(resourcesData).returning();
    return results;
  }

  async likeResource(id: string): Promise<void> {
    await db()
      .update(resources)
      .set({ likes: sql`${resources.likes} + 1` })
      .where(eq(resources.id, id));
  }

  async createMoodEntry(mood: InsertMoodEntry): Promise<MoodEntry> {
    const [result] = await db().insert(moodEntries).values(mood).returning();
    return result;
  }

  async getUserMoodHistory(userId: string, days: number = 7): Promise<MoodEntry[]> {
    const since = new Date();
    since.setDate(since.getDate() - days);
    
    return await db()
      .select()
      .from(moodEntries)
      .where(and(eq(moodEntries.userId, userId), gte(moodEntries.date, since)))
      .orderBy(moodEntries.date);
  }

  async createCrisisAlert(alert: InsertCrisisAlert): Promise<CrisisAlert> {
    const [result] = await db().insert(crisisAlerts).values(alert).returning();
    return result;
  }

  async getActiveCrisisAlerts(): Promise<CrisisAlert[]> {
    return await db()
      .select()
      .from(crisisAlerts)
      .where(eq(crisisAlerts.isResolved, false))
      .orderBy(desc(crisisAlerts.createdAt));
  }

  async resolveCrisisAlert(id: string, resolvedBy: string, notes?: string): Promise<CrisisAlert> {
    const [alert] = await db()
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
    const [session] = await db()
      .insert(chatSessions)
      .values({ userId, messages: [] })
      .returning();
    return session;
  }

  async updateChatSession(id: string, messages: any[]): Promise<ChatSession> {
    const [session] = await db()
      .update(chatSessions)
      .set({ messages })
      .where(eq(chatSessions.id, id))
      .returning();
    return session;
  }

  async getChatSession(id: string): Promise<ChatSession | undefined> {
    const [session] = await db().select().from(chatSessions).where(eq(chatSessions.id, id));
    return session || undefined;
  }

  async createCustomPersonality(personality: InsertCustomPersonality): Promise<CustomPersonality> {
    const [result] = await db().insert(customPersonalities).values(personality).returning();
    return result;
  }

  async getUserCustomPersonalities(userId: string): Promise<CustomPersonality[]> {
    return await db()
      .select()
      .from(customPersonalities)
      .where(and(eq(customPersonalities.userId, userId), eq(customPersonalities.isActive, true)))
      .orderBy(desc(customPersonalities.createdAt));
  }

  async updateCustomPersonality(id: string, updates: Partial<CustomPersonality>): Promise<CustomPersonality> {
    const [personality] = await db()
      .update(customPersonalities)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(customPersonalities.id, id))
      .returning();
    return personality;
  }

  async deleteCustomPersonality(id: string, userId: string): Promise<void> {
    await db()
      .update(customPersonalities)
      .set({ isActive: false, updatedAt: new Date() })
      .where(and(eq(customPersonalities.id, id), eq(customPersonalities.userId, userId)));
  }

  async addCoins(userId: string, amount: number, type: string, description: string, relatedEntityId?: string): Promise<CoinTransaction> {
    // Create transaction record
    const [transaction] = await db()
      .insert(coinTransactions)
      .values({
        userId,
        amount,
        type,
        description,
        relatedEntityId: relatedEntityId || null,
      })
      .returning();

    // Update user's coin balance
    await db()
      .update(users)
      .set({ 
        coins: sql`${users.coins} + ${amount}`,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));

    return transaction;
  }

  async getUserCoinTransactions(userId: string, limit: number = 50): Promise<CoinTransaction[]> {
    return await db()
      .select()
      .from(coinTransactions)
      .where(eq(coinTransactions.userId, userId))
      .orderBy(desc(coinTransactions.createdAt))
      .limit(limit);
  }

  async getUserCoinBalance(userId: string): Promise<number> {
    const [user] = await db()
      .select({ coins: users.coins })
      .from(users)
      .where(eq(users.id, userId));
    
    return user?.coins || 0;
  }

  async getAnalytics(): Promise<any> {
    // Anonymized analytics for institutional insights
    const [activeUsersCount] = await db()
      .select({ count: count() })
      .from(users)
      .where(gte(users.updatedAt, new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))); // Last 30 days

    const [screeningsThisMonth] = await db()
      .select({ count: count() })
      .from(screeningAssessments)
      .where(gte(screeningAssessments.completedAt, new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)));

    const [appointmentsCount] = await db()
      .select({ count: count() })
      .from(appointments)
      .where(gte(appointments.createdAt, new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)));

    const [crisisAlertsCount] = await db()
      .select({ count: count() })
      .from(crisisAlerts)
      .where(eq(crisisAlerts.isResolved, false));

    // Risk level distribution
    const riskDistribution = await db()
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

// Mock storage for development when database is not available
class MockStorage implements IStorage {
  private mockUsers = new Map<string, User>();
  private mockTransactions = new Map<string, CoinTransaction[]>();

  constructor() {
    // Initialize with some sample users and coins for testing
    this.mockUsers.set('773f9dcc-d68d-45a2-ac3f-1969d5846d7c', {
      id: '773f9dcc-d68d-45a2-ac3f-1969d5846d7c',
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      institution: 'Test University',
      language: 'en',
      isAdmin: false,
      coins: 50, // Start with 50 coins for testing
      password: 'hashed',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Add some sample transactions
    this.mockTransactions.set('773f9dcc-d68d-45a2-ac3f-1969d5846d7c', [
      {
        id: 'tx-1',
        userId: '773f9dcc-d68d-45a2-ac3f-1969d5846d7c',
        amount: 15,
        type: 'profile_completion',
        description: 'Completed your profile',
        relatedEntityId: null,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        id: 'tx-2',
        userId: '773f9dcc-d68d-45a2-ac3f-1969d5846d7c',
        amount: 10,
        type: 'screening_completed',
        description: 'Completed PHQ-9 screening assessment',
        relatedEntityId: null,
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      },
      {
        id: 'tx-3',
        userId: '773f9dcc-d68d-45a2-ac3f-1969d5846d7c',
        amount: 5,
        type: 'chat_session',
        description: 'Chat session with AI assistant',
        relatedEntityId: null,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
      {
        id: 'tx-4',
        userId: '773f9dcc-d68d-45a2-ac3f-1969d5846d7c',
        amount: 3,
        type: 'mood_entry',
        description: 'Daily mood tracking entry',
        relatedEntityId: null,
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      },
      {
        id: 'tx-5',
        userId: '773f9dcc-d68d-45a2-ac3f-1969d5846d7c',
        amount: 2,
        type: 'daily_login',
        description: 'Daily login bonus',
        relatedEntityId: null,
        createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      }
    ]);
  }

  async addCoins(userId: string, amount: number, type: string, description: string, relatedEntityId?: string): Promise<CoinTransaction> {
    const transaction: CoinTransaction = {
      id: `tx-${Date.now()}`,
      userId,
      amount,
      type,
      description,
      relatedEntityId: relatedEntityId || null,
      createdAt: new Date(),
    };

    if (!this.mockTransactions.has(userId)) {
      this.mockTransactions.set(userId, []);
    }
    this.mockTransactions.get(userId)!.push(transaction);

    // Update user's coin balance
    const user = this.mockUsers.get(userId);
    if (user) {
      user.coins = (user.coins || 0) + amount;
    }

    return transaction;
  }

  async getUserCoinTransactions(userId: string, limit: number = 50): Promise<CoinTransaction[]> {
    const transactions = this.mockTransactions.get(userId) || [];
    return transactions.slice(0, limit);
  }

  async getUserCoinBalance(userId: string): Promise<number> {
    const user = this.mockUsers.get(userId);
    return user?.coins || 0;
  }

  // Add mock implementations for all other methods to avoid errors
  async getUser(id: string): Promise<User | undefined> {
    return this.mockUsers.get(id);
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const user = this.mockUsers.get(id);
    if (user) {
      Object.assign(user, updates);
      return user;
    }
    throw new Error('User not found');
  }

  // Stub implementations for other methods
  async getUserByUsername(username: string): Promise<User | undefined> { return undefined; }
  async getUserByEmail(email: string): Promise<User | undefined> { return undefined; }
  async createUser(user: InsertUser): Promise<User> { throw new Error('Not implemented in mock'); }
  async createScreeningAssessment(assessment: InsertScreeningAssessment): Promise<ScreeningAssessment> { throw new Error('Not implemented in mock'); }
  async getUserScreeningHistory(userId: string, type?: string): Promise<ScreeningAssessment[]> { return []; }
  async getLatestScreening(userId: string, type: string): Promise<ScreeningAssessment | undefined> { return undefined; }
  async createAppointment(appointment: InsertAppointment): Promise<Appointment> { throw new Error('Not implemented in mock'); }
  async getUserAppointments(userId: string): Promise<Appointment[]> { return []; }
  async getCounselorAppointments(counselorId: string): Promise<Appointment[]> { return []; }
  async updateAppointmentStatus(id: string, status: string): Promise<Appointment> { throw new Error('Not implemented in mock'); }
  async getCounselors(): Promise<Counselor[]> { return []; }
  async createForumPost(post: InsertForumPost): Promise<ForumPost> { throw new Error('Not implemented in mock'); }
  async getForumPosts(category?: string): Promise<ForumPost[]> { return []; }
  async getForumPostWithReplies(postId: string): Promise<ForumPost & { replies: ForumReply[] }> { throw new Error('Not implemented in mock'); }
  async createForumReply(reply: InsertForumReply): Promise<ForumReply> { throw new Error('Not implemented in mock'); }
  async likeForumPost(postId: string): Promise<void> { }
  async flagForumPost(postId: string): Promise<void> { }
  async getResources(category?: string, language?: string): Promise<Resource[]> { return []; }
  async getResourceById(id: string): Promise<Resource | undefined> { return undefined; }
  async createResource(resource: InsertResource): Promise<Resource> { throw new Error('Not implemented in mock'); }
  async createResourcesBulk(resources: InsertResource[]): Promise<Resource[]> { return []; }
  async likeResource(id: string): Promise<void> { }
  async createMoodEntry(mood: InsertMoodEntry): Promise<MoodEntry> { throw new Error('Not implemented in mock'); }
  async getUserMoodHistory(userId: string, days?: number): Promise<MoodEntry[]> { return []; }
  async createCrisisAlert(alert: InsertCrisisAlert): Promise<CrisisAlert> { throw new Error('Not implemented in mock'); }
  async getActiveCrisisAlerts(): Promise<CrisisAlert[]> { return []; }
  async resolveCrisisAlert(id: string, resolvedBy: string, notes?: string): Promise<CrisisAlert> { throw new Error('Not implemented in mock'); }
  async createChatSession(userId: string): Promise<ChatSession> { throw new Error('Not implemented in mock'); }
  async updateChatSession(id: string, messages: any[]): Promise<ChatSession> { throw new Error('Not implemented in mock'); }
  async getChatSession(id: string): Promise<ChatSession | undefined> { return undefined; }
  async createCustomPersonality(personality: InsertCustomPersonality): Promise<CustomPersonality> { throw new Error('Not implemented in mock'); }
  async getUserCustomPersonalities(userId: string): Promise<CustomPersonality[]> { return []; }
  async updateCustomPersonality(id: string, updates: Partial<CustomPersonality>): Promise<CustomPersonality> { throw new Error('Not implemented in mock'); }
  async deleteCustomPersonality(id: string, userId: string): Promise<void> { }
  async getAnalytics(): Promise<any> { return {}; }
}

// Try to use DatabaseStorage, fall back to MockStorage if database is not available
let storage: IStorage;
try {
  storage = new DatabaseStorage();
  // Test database connection
  storage.getAnalytics().catch(() => {
    console.log('Database not available, using mock storage for development');
    storage = new MockStorage();
  });
} catch (error) {
  console.log('Database not available, using mock storage for development');
  storage = new MockStorage();
}

export { storage };
