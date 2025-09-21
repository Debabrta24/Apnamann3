import { randomUUID } from "crypto";
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
  medicineAlarms,
  userSkills,
  skillShowcases,
  skillEndorsements,
  liveSessions,
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
  type MedicineAlarm,
  type InsertMedicineAlarm,
  type UserSkill,
  type InsertUserSkill,
  type SkillShowcase,
  type InsertSkillShowcase,
  type SkillEndorsement,
  type InsertSkillEndorsement,
  type LiveSession,
  type InsertLiveSession,
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

  // Medicine alarms
  createMedicineAlarm(alarm: InsertMedicineAlarm): Promise<MedicineAlarm>;
  getUserMedicineAlarms(userId: string): Promise<MedicineAlarm[]>;
  updateMedicineAlarm(id: string, updates: Partial<MedicineAlarm>): Promise<MedicineAlarm>;
  deleteMedicineAlarm(id: string): Promise<void>;

  // User skills
  createUserSkill(skill: InsertUserSkill): Promise<UserSkill>;
  getUserSkills(userId: string): Promise<UserSkill[]>;
  updateUserSkill(id: string, updates: Partial<UserSkill>): Promise<UserSkill>;
  deleteUserSkill(id: string): Promise<void>;

  // Skill showcases
  createSkillShowcase(showcase: InsertSkillShowcase): Promise<SkillShowcase>;
  getUserSkillShowcases(userId: string): Promise<SkillShowcase[]>;
  getAllSkillShowcases(): Promise<SkillShowcase[]>;
  updateSkillShowcase(id: string, updates: Partial<SkillShowcase>): Promise<SkillShowcase>;
  deleteSkillShowcase(id: string): Promise<void>;
  likeSkillShowcase(id: string): Promise<void>;

  // Skill endorsements
  createSkillEndorsement(endorsement: InsertSkillEndorsement): Promise<SkillEndorsement>;

  // Live sessions
  createLiveSession(session: InsertLiveSession): Promise<LiveSession>;
  getUserLiveSessions(userId: string): Promise<LiveSession[]>;
  getAllLiveSessions(): Promise<LiveSession[]>;
  getLiveSessionById(id: string): Promise<LiveSession | undefined>;
  updateLiveSession(id: string, updates: Partial<LiveSession>): Promise<LiveSession>;
  deleteLiveSession(id: string): Promise<void>;
  startLiveSession(id: string): Promise<LiveSession>;
  endLiveSession(id: string): Promise<LiveSession>;
  incrementSessionViewers(id: string): Promise<void>;

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
    const cleanUpdates: any = {
      updatedAt: new Date()
    };
    
    // Only include fields that are explicitly provided
    if ('username' in updates) cleanUpdates.username = updates.username;
    if ('password' in updates) cleanUpdates.password = updates.password;
    if ('firstName' in updates) cleanUpdates.firstName = updates.firstName;
    if ('lastName' in updates) cleanUpdates.lastName = updates.lastName;
    if ('email' in updates) cleanUpdates.email = updates.email;
    if ('anonymousName' in updates) cleanUpdates.anonymousName = updates.anonymousName ?? null;
    if ('institution' in updates) cleanUpdates.institution = updates.institution;
    if ('course' in updates) cleanUpdates.course = updates.course ?? null;
    if ('year' in updates) cleanUpdates.year = updates.year ?? null;
    if ('language' in updates) cleanUpdates.language = updates.language;
    if ('isAdmin' in updates) cleanUpdates.isAdmin = updates.isAdmin;
    if ('coins' in updates) cleanUpdates.coins = updates.coins;
    
    const [user] = await db()
      .update(users)
      .set(cleanUpdates)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async createScreeningAssessment(assessment: InsertScreeningAssessment): Promise<ScreeningAssessment> {
    const [result] = await db()
      .insert(screeningAssessments)
      .values({
        ...assessment,
        totalScore: 0, // Will be calculated by caller
        riskLevel: 'minimal', // Will be set by caller
        isHighRisk: false // Will be set by caller
      })
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
    const cleanUpdates: any = {
      updatedAt: new Date()
    };
    
    // Only include fields that are explicitly provided
    if ('name' in updates) cleanUpdates.name = updates.name;
    if ('description' in updates) cleanUpdates.description = updates.description ?? null;
    if ('customPrompt' in updates) cleanUpdates.customPrompt = updates.customPrompt;
    if ('sourceType' in updates) cleanUpdates.sourceType = updates.sourceType;
    if ('originalFileName' in updates) cleanUpdates.originalFileName = updates.originalFileName ?? null;
    if ('trainingData' in updates) cleanUpdates.trainingData = updates.trainingData ?? null;
    if ('isActive' in updates) cleanUpdates.isActive = updates.isActive;
    
    const [personality] = await db()
      .update(customPersonalities)
      .set(cleanUpdates)
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

  // Medicine alarm methods
  async createMedicineAlarm(alarm: InsertMedicineAlarm): Promise<MedicineAlarm> {
    const [result] = await db()
      .insert(medicineAlarms)
      .values(alarm)
      .returning();
    return result;
  }

  async getUserMedicineAlarms(userId: string): Promise<MedicineAlarm[]> {
    return await db()
      .select()
      .from(medicineAlarms)
      .where(eq(medicineAlarms.userId, userId))
      .orderBy(desc(medicineAlarms.createdAt));
  }

  async updateMedicineAlarm(id: string, updates: Partial<MedicineAlarm>): Promise<MedicineAlarm> {
    const cleanUpdates: any = {
      updatedAt: new Date()
    };
    
    // Only include fields that are explicitly provided
    if ('medicineName' in updates) cleanUpdates.medicineName = updates.medicineName;
    if ('dosage' in updates) cleanUpdates.dosage = updates.dosage;
    if ('frequency' in updates) cleanUpdates.frequency = updates.frequency;
    if ('times' in updates) cleanUpdates.times = updates.times;
    if ('startDate' in updates) cleanUpdates.startDate = updates.startDate;
    if ('endDate' in updates) cleanUpdates.endDate = updates.endDate ?? null;
    if ('isActive' in updates) cleanUpdates.isActive = updates.isActive;
    if ('notes' in updates) cleanUpdates.notes = updates.notes ?? null;
    
    const [alarm] = await db()
      .update(medicineAlarms)
      .set(cleanUpdates)
      .where(eq(medicineAlarms.id, id))
      .returning();
    return alarm;
  }

  async deleteMedicineAlarm(id: string): Promise<void> {
    await db()
      .delete(medicineAlarms)
      .where(eq(medicineAlarms.id, id));
  }

  // User skills methods
  async createUserSkill(skill: InsertUserSkill): Promise<UserSkill> {
    const [result] = await db()
      .insert(userSkills)
      .values({
        ...skill,
        description: skill.description ?? null,
        yearsOfExperience: skill.yearsOfExperience ?? null,
        endorsements: 0,
        isVerified: false
      })
      .returning();
    return result;
  }

  async getUserSkills(userId: string): Promise<UserSkill[]> {
    return await db()
      .select()
      .from(userSkills)
      .where(eq(userSkills.userId, userId))
      .orderBy(desc(userSkills.createdAt));
  }

  async updateUserSkill(id: string, updates: Partial<UserSkill>): Promise<UserSkill> {
    const cleanUpdates: any = {
      updatedAt: new Date()
    };
    
    // Only include fields that are explicitly provided
    if ('description' in updates) cleanUpdates.description = updates.description ?? null;
    if ('yearsOfExperience' in updates) cleanUpdates.yearsOfExperience = updates.yearsOfExperience ?? null;
    if ('proficiencyLevel' in updates) cleanUpdates.proficiencyLevel = updates.proficiencyLevel;
    if ('isVerified' in updates) cleanUpdates.isVerified = updates.isVerified;
    const [skill] = await db()
      .update(userSkills)
      .set(cleanUpdates)
      .where(eq(userSkills.id, id))
      .returning();
    return skill;
  }

  async deleteUserSkill(id: string): Promise<void> {
    await db()
      .delete(userSkills)
      .where(eq(userSkills.id, id));
  }

  // Skill showcases methods
  async createSkillShowcase(showcase: InsertSkillShowcase): Promise<SkillShowcase> {
    const [result] = await db()
      .insert(skillShowcases)
      .values({
        ...showcase,
        mediaUrl: showcase.mediaUrl ?? null,
        externalUrl: showcase.externalUrl ?? null,
        tags: showcase.tags ?? [],
        likes: 0,
        views: 0,
        isFeatured: false
      })
      .returning();
    return result;
  }

  async getUserSkillShowcases(userId: string): Promise<SkillShowcase[]> {
    return await db()
      .select()
      .from(skillShowcases)
      .where(eq(skillShowcases.userId, userId))
      .orderBy(desc(skillShowcases.createdAt));
  }

  async getAllSkillShowcases(): Promise<SkillShowcase[]> {
    return await db()
      .select()
      .from(skillShowcases)
      .orderBy(desc(skillShowcases.createdAt));
  }

  async updateSkillShowcase(id: string, updates: Partial<SkillShowcase>): Promise<SkillShowcase> {
    const cleanUpdates: any = {
      updatedAt: new Date()
    };
    
    // Only include fields that are explicitly provided
    if ('title' in updates) cleanUpdates.title = updates.title;
    if ('description' in updates) cleanUpdates.description = updates.description ?? null;
    if ('mediaUrl' in updates) cleanUpdates.mediaUrl = updates.mediaUrl ?? null;
    if ('externalUrl' in updates) cleanUpdates.externalUrl = updates.externalUrl ?? null;
    if ('tags' in updates) cleanUpdates.tags = updates.tags ?? [];
    if ('isFeatured' in updates) cleanUpdates.isFeatured = updates.isFeatured;
    const [showcase] = await db()
      .update(skillShowcases)
      .set(cleanUpdates)
      .where(eq(skillShowcases.id, id))
      .returning();
    return showcase;
  }

  async deleteSkillShowcase(id: string): Promise<void> {
    await db()
      .delete(skillShowcases)
      .where(eq(skillShowcases.id, id));
  }

  async likeSkillShowcase(id: string): Promise<void> {
    await db()
      .update(skillShowcases)
      .set({ 
        likes: sql`${skillShowcases.likes} + 1`,
        updatedAt: new Date()
      })
      .where(eq(skillShowcases.id, id));
  }

  // Skill endorsements methods
  async createSkillEndorsement(endorsement: InsertSkillEndorsement): Promise<SkillEndorsement> {
    // First create the endorsement
    const [result] = await db()
      .insert(skillEndorsements)
      .values({
        ...endorsement,
        comment: endorsement.comment ?? null
      })
      .returning();

    // Then increment the endorsement count on the skill
    await db()
      .update(userSkills)
      .set({ 
        endorsements: sql`${userSkills.endorsements} + 1`,
        updatedAt: new Date()
      })
      .where(eq(userSkills.id, endorsement.skillId));

    return {
      ...result,
      comment: result.comment ?? null
    } as SkillEndorsement;
  }

  // Live sessions methods
  async createLiveSession(session: InsertLiveSession): Promise<LiveSession> {
    const [result] = await db()
      .insert(liveSessions)
      .values({
        ...session,
        status: session.status ?? 'scheduled',
        scheduledStart: session.scheduledStart ?? null,
        actualStart: session.actualStart ?? null,
        actualEnd: session.actualEnd ?? null,
        isAudio: session.isAudio ?? false,
        maxParticipants: session.maxParticipants ?? 100,
        streamUrl: session.streamUrl ?? null,
        thumbnailUrl: session.thumbnailUrl ?? null,
        tags: session.tags ?? [],
        currentViewers: 0,
        totalViews: 0
      })
      .returning();
    return result;
  }

  async getUserLiveSessions(userId: string): Promise<LiveSession[]> {
    return await db()
      .select()
      .from(liveSessions)
      .where(eq(liveSessions.userId, userId))
      .orderBy(desc(liveSessions.createdAt));
  }

  async getAllLiveSessions(): Promise<LiveSession[]> {
    return await db()
      .select()
      .from(liveSessions)
      .orderBy(desc(liveSessions.createdAt));
  }

  async getLiveSessionById(id: string): Promise<LiveSession | undefined> {
    const [session] = await db()
      .select()
      .from(liveSessions)
      .where(eq(liveSessions.id, id));
    return session || undefined;
  }

  async updateLiveSession(id: string, updates: Partial<LiveSession>): Promise<LiveSession> {
    const cleanUpdates: any = {
      updatedAt: new Date()
    };
    
    // Only include fields that are explicitly provided
    if ('title' in updates) cleanUpdates.title = updates.title;
    if ('description' in updates) cleanUpdates.description = updates.description ?? null;
    if ('category' in updates) cleanUpdates.category = updates.category;
    if ('status' in updates) cleanUpdates.status = updates.status ?? null;
    if ('scheduledStart' in updates) cleanUpdates.scheduledStart = updates.scheduledStart ?? null;
    if ('actualStart' in updates) cleanUpdates.actualStart = updates.actualStart ?? null;
    if ('actualEnd' in updates) cleanUpdates.actualEnd = updates.actualEnd ?? null;
    if ('streamUrl' in updates) cleanUpdates.streamUrl = updates.streamUrl ?? null;
    if ('thumbnailUrl' in updates) cleanUpdates.thumbnailUrl = updates.thumbnailUrl ?? null;
    if ('tags' in updates) cleanUpdates.tags = updates.tags ?? [];
    if ('isAudio' in updates) cleanUpdates.isAudio = updates.isAudio as boolean;
    if ('maxParticipants' in updates) cleanUpdates.maxParticipants = updates.maxParticipants as number;
    const [session] = await db()
      .update(liveSessions)
      .set(cleanUpdates)
      .where(eq(liveSessions.id, id))
      .returning();
    return session;
  }

  async deleteLiveSession(id: string): Promise<void> {
    await db()
      .delete(liveSessions)
      .where(eq(liveSessions.id, id));
  }

  async startLiveSession(id: string): Promise<LiveSession> {
    const [session] = await db()
      .update(liveSessions)
      .set({ 
        status: 'live', 
        actualStart: new Date(),
        updatedAt: new Date()
      })
      .where(eq(liveSessions.id, id))
      .returning();
    return session;
  }

  async endLiveSession(id: string): Promise<LiveSession> {
    const [session] = await db()
      .update(liveSessions)
      .set({ 
        status: 'ended', 
        actualEnd: new Date(),
        updatedAt: new Date()
      })
      .where(eq(liveSessions.id, id))
      .returning();
    return session;
  }

  async incrementSessionViewers(id: string): Promise<void> {
    await db()
      .update(liveSessions)
      .set({ 
        currentViewers: sql`${liveSessions.currentViewers} + 1`,
        totalViews: sql`${liveSessions.totalViews} + 1`,
        updatedAt: new Date()
      })
      .where(eq(liveSessions.id, id));
  }
}

// Mock storage for development when database is not available
class MockStorage implements IStorage {
  private mockUsers = new Map<string, User>();
  private mockTransactions = new Map<string, CoinTransaction[]>();
  private mockLiveSessions = new Map<string, LiveSession[]>();
  private mockCounselors = new Map<string, Counselor>();
  private mockCrisisAlerts: CrisisAlert[] = [];

  constructor() {
    // Initialize with some sample users and coins for testing
    this.mockUsers.set('773f9dcc-d68d-45a2-ac3f-1969d5846d7c', {
      id: '773f9dcc-d68d-45a2-ac3f-1969d5846d7c',
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      anonymousName: 'GentleButterfly42',
      institution: 'Test University',
      course: 'Computer Science',
      year: 3,
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

    // Add sample counselors with proper UUIDs for phone consultation testing
    const counselorsData = [
      {
        id: 'c1a1b2c3-d4e5-f6a7-b8c9-d0e1f2a3b4c5',
        name: 'Dr. Priya Sharma',
        specialization: 'Psychiatrist',
        languages: ['English', 'Hindi', 'Bengali'],
        experience: 8,
        rating: 48, // 4.8 * 10
        isAvailable: true,
        availableSlots: ['10:00 AM', '2:00 PM', '4:30 PM']
      },
      {
        id: 'c2b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6',
        name: 'Dr. Rajesh Kumar',
        specialization: 'Clinical Psychologist',
        languages: ['English', 'Hindi', 'Tamil'],
        experience: 12,
        rating: 49, // 4.9 * 10
        isAvailable: true,
        availableSlots: ['9:00 AM', '11:30 AM', '3:00 PM']
      },
      {
        id: 'c3c3d4e5-f6a7-b8c9-d0e1-f2a3b4c5d6e7',
        name: 'Dr. Anita Desai',
        specialization: 'Psychiatrist',
        languages: ['English', 'Hindi', 'Gujarati'],
        experience: 15,
        rating: 47, // 4.7 * 10
        isAvailable: true,
        availableSlots: ['1:00 PM', '3:30 PM', '5:00 PM']
      }
    ];

    counselorsData.forEach(counselor => {
      this.mockCounselors.set(counselor.id, counselor as Counselor);
    });
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
  async getCounselors(): Promise<Counselor[]> { 
    return Array.from(this.mockCounselors.values()).filter(counselor => counselor.isAvailable);
  }
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
  async createCrisisAlert(alert: InsertCrisisAlert): Promise<CrisisAlert> {
    const mockAlert: CrisisAlert = {
      id: randomUUID(),
      userId: alert.userId,
      triggerType: alert.triggerType,
      severity: alert.severity,
      isResolved: false,
      resolvedBy: null,
      notes: alert.notes || null,
      createdAt: new Date(),
      resolvedAt: null,
    };
    this.mockCrisisAlerts.push(mockAlert);
    return mockAlert;
  }
  async getActiveCrisisAlerts(): Promise<CrisisAlert[]> { 
    return this.mockCrisisAlerts.filter(alert => !alert.isResolved); 
  }
  async resolveCrisisAlert(id: string, resolvedBy: string, notes?: string): Promise<CrisisAlert> {
    const alertIndex = this.mockCrisisAlerts.findIndex(alert => alert.id === id);
    if (alertIndex === -1) {
      throw new Error('Crisis alert not found');
    }
    
    const updatedAlert = {
      ...this.mockCrisisAlerts[alertIndex],
      isResolved: true,
      resolvedBy,
      notes: notes || this.mockCrisisAlerts[alertIndex].notes,
      resolvedAt: new Date(),
    };
    
    this.mockCrisisAlerts[alertIndex] = updatedAlert;
    return updatedAlert;
  }
  async createChatSession(userId: string): Promise<ChatSession> { throw new Error('Not implemented in mock'); }
  async updateChatSession(id: string, messages: any[]): Promise<ChatSession> { throw new Error('Not implemented in mock'); }
  async getChatSession(id: string): Promise<ChatSession | undefined> { return undefined; }
  async createCustomPersonality(personality: InsertCustomPersonality): Promise<CustomPersonality> { throw new Error('Not implemented in mock'); }
  async getUserCustomPersonalities(userId: string): Promise<CustomPersonality[]> { return []; }
  async updateCustomPersonality(id: string, updates: Partial<CustomPersonality>): Promise<CustomPersonality> { throw new Error('Not implemented in mock'); }
  async deleteCustomPersonality(id: string, userId: string): Promise<void> { }
  async getAnalytics(): Promise<any> { return {}; }

  // Medicine alarm implementations
  private mockMedicineAlarms = new Map<string, MedicineAlarm[]>();

  async createMedicineAlarm(alarm: InsertMedicineAlarm): Promise<MedicineAlarm> {
    const mockAlarm: MedicineAlarm = {
      id: `alarm_${Date.now()}`,
      ...alarm,
      isActive: alarm.isActive ?? true,
      notes: alarm.notes ?? null,
      endDate: alarm.endDate ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (!this.mockMedicineAlarms.has(alarm.userId)) {
      this.mockMedicineAlarms.set(alarm.userId, []);
    }
    
    this.mockMedicineAlarms.get(alarm.userId)!.push(mockAlarm);
    return mockAlarm;
  }

  async getUserMedicineAlarms(userId: string): Promise<MedicineAlarm[]> {
    return this.mockMedicineAlarms.get(userId) || [];
  }

  async updateMedicineAlarm(id: string, updates: Partial<MedicineAlarm>): Promise<MedicineAlarm> {
    for (const alarms of Array.from(this.mockMedicineAlarms.values())) {
      const alarm = alarms.find(a => a.id === id);
      if (alarm) {
        Object.assign(alarm, updates, { updatedAt: new Date() });
        return alarm;
      }
    }
    throw new Error('Medicine alarm not found');
  }

  async deleteMedicineAlarm(id: string): Promise<void> {
    for (const [userId, alarms] of Array.from(this.mockMedicineAlarms.entries())) {
      const index = alarms.findIndex(a => a.id === id);
      if (index !== -1) {
        alarms.splice(index, 1);
        return;
      }
    }
    throw new Error('Medicine alarm not found');
  }

  // Skills mock implementations
  private mockUserSkills = new Map<string, UserSkill[]>();
  private mockSkillShowcases = new Map<string, SkillShowcase[]>();
  private mockSkillEndorsements = new Map<string, SkillEndorsement[]>();

  async createUserSkill(skill: InsertUserSkill): Promise<UserSkill> {
    const mockSkill: UserSkill = {
      id: `skill_${Date.now()}`,
      ...skill,
      description: skill.description ?? null,
      yearsOfExperience: skill.yearsOfExperience ?? null,
      endorsements: 0,
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (!this.mockUserSkills.has(skill.userId)) {
      this.mockUserSkills.set(skill.userId, []);
    }
    
    this.mockUserSkills.get(skill.userId)!.push(mockSkill);
    return mockSkill;
  }

  async getUserSkills(userId: string): Promise<UserSkill[]> {
    return this.mockUserSkills.get(userId) || [];
  }

  async updateUserSkill(id: string, updates: Partial<UserSkill>): Promise<UserSkill> {
    for (const skills of Array.from(this.mockUserSkills.values())) {
      const skill = skills.find(s => s.id === id);
      if (skill) {
        Object.assign(skill, updates, { updatedAt: new Date() });
        return skill;
      }
    }
    throw new Error('Skill not found');
  }

  async deleteUserSkill(id: string): Promise<void> {
    for (const [userId, skills] of Array.from(this.mockUserSkills.entries())) {
      const index = skills.findIndex(s => s.id === id);
      if (index !== -1) {
        skills.splice(index, 1);
        return;
      }
    }
    throw new Error('Skill not found');
  }

  async createSkillShowcase(showcase: InsertSkillShowcase): Promise<SkillShowcase> {
    const mockShowcase: SkillShowcase = {
      id: `showcase_${Date.now()}`,
      ...showcase,
      mediaUrl: showcase.mediaUrl ?? null,
      externalUrl: showcase.externalUrl ?? null,
      tags: showcase.tags ?? [],
      likes: 0,
      views: 0,
      isFeatured: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (!this.mockSkillShowcases.has(showcase.userId)) {
      this.mockSkillShowcases.set(showcase.userId, []);
    }
    
    this.mockSkillShowcases.get(showcase.userId)!.push(mockShowcase);
    return mockShowcase;
  }

  async getUserSkillShowcases(userId: string): Promise<SkillShowcase[]> {
    return this.mockSkillShowcases.get(userId) || [];
  }

  async getAllSkillShowcases(): Promise<SkillShowcase[]> {
    const allShowcases = [];
    for (const showcases of Array.from(this.mockSkillShowcases.values())) {
      allShowcases.push(...showcases);
    }
    return allShowcases.sort((a, b) => (b.createdAt ? new Date(b.createdAt).getTime() : 0) - (a.createdAt ? new Date(a.createdAt).getTime() : 0));
  }

  async updateSkillShowcase(id: string, updates: Partial<SkillShowcase>): Promise<SkillShowcase> {
    for (const showcases of Array.from(this.mockSkillShowcases.values())) {
      const showcase = showcases.find(s => s.id === id);
      if (showcase) {
        Object.assign(showcase, updates, { updatedAt: new Date() });
        return showcase;
      }
    }
    throw new Error('Showcase not found');
  }

  async deleteSkillShowcase(id: string): Promise<void> {
    for (const [userId, showcases] of Array.from(this.mockSkillShowcases.entries())) {
      const index = showcases.findIndex(s => s.id === id);
      if (index !== -1) {
        showcases.splice(index, 1);
        return;
      }
    }
    throw new Error('Showcase not found');
  }

  async likeSkillShowcase(id: string): Promise<void> {
    for (const showcases of Array.from(this.mockSkillShowcases.values())) {
      const showcase = showcases.find(s => s.id === id);
      if (showcase) {
        showcase.likes = (showcase.likes || 0) + 1;
        showcase.updatedAt = new Date();
        return;
      }
    }
    throw new Error('Showcase not found');
  }

  async createSkillEndorsement(endorsement: InsertSkillEndorsement): Promise<SkillEndorsement> {
    const mockEndorsement: SkillEndorsement = {
      id: `endorsement_${Date.now()}`,
      ...endorsement,
      comment: endorsement.comment ?? null,
      createdAt: new Date(),
    };

    if (!this.mockSkillEndorsements.has(endorsement.skillId)) {
      this.mockSkillEndorsements.set(endorsement.skillId, []);
    }
    
    this.mockSkillEndorsements.get(endorsement.skillId)!.push(mockEndorsement);

    // Update the skill's endorsement count
    for (const skills of Array.from(this.mockUserSkills.values())) {
      const skill = skills.find(s => s.id === endorsement.skillId);
      if (skill) {
        skill.endorsements = (skill.endorsements || 0) + 1;
        skill.updatedAt = new Date();
        break;
      }
    }

    return mockEndorsement;
  }

  // Live sessions methods
  async createLiveSession(session: InsertLiveSession): Promise<LiveSession> {
    const mockSession: LiveSession = {
      id: `session_${Date.now()}`,
      ...session,
      status: session.status ?? 'scheduled',
      scheduledStart: session.scheduledStart ?? null,
      actualStart: session.actualStart ?? null,
      actualEnd: session.actualEnd ?? null,
      streamUrl: session.streamUrl ?? null,
      thumbnailUrl: session.thumbnailUrl ?? null,
      tags: session.tags ?? [],
      isAudio: session.isAudio ?? false,
      maxParticipants: session.maxParticipants ?? 100,
      currentViewers: 0,
      totalViews: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (!this.mockLiveSessions.has(session.userId)) {
      this.mockLiveSessions.set(session.userId, []);
    }
    
    this.mockLiveSessions.get(session.userId)!.push(mockSession);
    return mockSession;
  }

  async getUserLiveSessions(userId: string): Promise<LiveSession[]> {
    return this.mockLiveSessions.get(userId) || [];
  }

  async getAllLiveSessions(): Promise<LiveSession[]> {
    const allSessions = [];
    for (const sessions of Array.from(this.mockLiveSessions.values())) {
      allSessions.push(...sessions);
    }
    return allSessions.sort((a, b) => (b.createdAt ? new Date(b.createdAt).getTime() : 0) - (a.createdAt ? new Date(a.createdAt).getTime() : 0));
  }

  async getLiveSessionById(id: string): Promise<LiveSession | undefined> {
    for (const sessions of Array.from(this.mockLiveSessions.values())) {
      const session = sessions.find(s => s.id === id);
      if (session) return session;
    }
    return undefined;
  }

  async updateLiveSession(id: string, updates: Partial<LiveSession>): Promise<LiveSession> {
    for (const sessions of Array.from(this.mockLiveSessions.values())) {
      const session = sessions.find(s => s.id === id);
      if (session) {
        Object.assign(session, updates, { updatedAt: new Date() });
        return session;
      }
    }
    throw new Error('Session not found');
  }

  async deleteLiveSession(id: string): Promise<void> {
    for (const [userId, sessions] of Array.from(this.mockLiveSessions.entries())) {
      const index = sessions.findIndex(s => s.id === id);
      if (index !== -1) {
        sessions.splice(index, 1);
        return;
      }
    }
    throw new Error('Session not found');
  }

  async startLiveSession(id: string): Promise<LiveSession> {
    for (const sessions of Array.from(this.mockLiveSessions.values())) {
      const session = sessions.find(s => s.id === id);
      if (session) {
        session.status = 'live';
        session.actualStart = new Date();
        session.updatedAt = new Date();
        return session;
      }
    }
    throw new Error('Session not found');
  }

  async endLiveSession(id: string): Promise<LiveSession> {
    for (const sessions of Array.from(this.mockLiveSessions.values())) {
      const session = sessions.find(s => s.id === id);
      if (session) {
        session.status = 'ended';
        session.actualEnd = new Date();
        session.updatedAt = new Date();
        return session;
      }
    }
    throw new Error('Session not found');
  }

  async incrementSessionViewers(id: string): Promise<void> {
    for (const sessions of Array.from(this.mockLiveSessions.values())) {
      const session = sessions.find(s => s.id === id);
      if (session) {
        session.currentViewers = (session.currentViewers || 0) + 1;
        session.totalViews = (session.totalViews || 0) + 1;
        session.updatedAt = new Date();
        return;
      }
    }
    throw new Error('Session not found');
  }
}

// Initialize storage - prioritize database when available
async function initializeStorage(): Promise<IStorage> {
  if (process.env.DATABASE_URL) {
    try {
      console.log('DATABASE_URL found, attempting to connect to PostgreSQL...');
      
      // Test database connection
      const testStorage = new DatabaseStorage();
      
      // Perform a simple connection test
      try {
        await db().execute(sql`SELECT 1 as test`);
        console.log('✅ PostgreSQL connection successful - Using DatabaseStorage');
        return testStorage;
      } catch (connectionError) {
        console.error('❌ PostgreSQL connection failed:', connectionError);
        console.log('Falling back to MockStorage for development');
        return new MockStorage();
      }
    } catch (initError) {
      console.error('❌ DatabaseStorage initialization failed:', initError);
      console.log('Falling back to MockStorage for development');
      return new MockStorage();
    }
  } else {
    console.log('📝 DATABASE_URL not found in environment variables');
    console.log('Using MockStorage for development');
    return new MockStorage();
  }
}

// Initialize storage asynchronously
let storage: IStorage = new MockStorage(); // Default fallback
initializeStorage().then(initializedStorage => {
  storage = initializedStorage;
}).catch(error => {
  console.error('Storage initialization error:', error);
  storage = new MockStorage();
});

export { storage };
