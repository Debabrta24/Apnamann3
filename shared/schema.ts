import { sql } from "drizzle-orm";
import { 
  pgTable, 
  text, 
  varchar, 
  integer, 
  boolean, 
  timestamp, 
  jsonb,
  serial,
  uuid
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  institution: text("institution").notNull(),
  course: text("course"),
  year: integer("year"),
  language: text("language").default("en"),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Screening assessments
export const screeningAssessments = pgTable("screening_assessments", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // 'PHQ9' or 'GAD7'
  responses: jsonb("responses").notNull(), // Array of numeric responses
  totalScore: integer("total_score").notNull(),
  riskLevel: text("risk_level").notNull(), // 'minimal', 'mild', 'moderate', 'severe'
  isHighRisk: boolean("is_high_risk").default(false),
  completedAt: timestamp("completed_at").defaultNow(),
});

// Chat sessions
export const chatSessions = pgTable("chat_sessions", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  messages: jsonb("messages").default([]), // Array of message objects
  startedAt: timestamp("started_at").defaultNow(),
  endedAt: timestamp("ended_at"),
  isActive: boolean("is_active").default(true),
});

// Counselors
export const counselors = pgTable("counselors", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  specialization: text("specialization").notNull(),
  languages: jsonb("languages").notNull(), // Array of language codes
  experience: integer("experience_years").notNull(),
  rating: integer("rating").default(0), // 1-5 stars * 10 for precision
  isAvailable: boolean("is_available").default(true),
  availableSlots: jsonb("available_slots").default([]), // Array of time slots
});

// Counseling appointments
export const appointments = pgTable("appointments", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  counselorId: uuid("counselor_id").notNull().references(() => counselors.id),
  sessionType: text("session_type").notNull(), // 'individual', 'group', 'crisis'
  scheduledFor: timestamp("scheduled_for").notNull(),
  duration: integer("duration_minutes").default(60),
  status: text("status").default("scheduled"), // 'scheduled', 'completed', 'cancelled', 'no-show'
  notes: text("notes"),
  isConfidential: boolean("is_confidential").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Forum posts
export const forumPosts = pgTable("forum_posts", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  isAnonymous: boolean("is_anonymous").default(true),
  likes: integer("likes").default(0),
  isModerated: boolean("is_moderated").default(false),
  isFlagged: boolean("is_flagged").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Forum replies
export const forumReplies = pgTable("forum_replies", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  postId: uuid("post_id").notNull().references(() => forumPosts.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  isAnonymous: boolean("is_anonymous").default(true),
  likes: integer("likes").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Resources
export const resources = pgTable("resources", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // 'video', 'article', 'audio', 'guide'
  category: text("category").notNull(),
  url: text("url"),
  content: text("content"),
  duration: integer("duration_minutes"),
  language: text("language").default("en"),
  likes: integer("likes").default(0),
  isOfflineAvailable: boolean("is_offline_available").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Mood entries
export const moodEntries = pgTable("mood_entries", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  moodLevel: integer("mood_level").notNull(), // 1-5 scale
  moodType: text("mood_type").notNull(), // 'happy', 'sad', 'anxious', 'stressed', 'calm'
  notes: text("notes"),
  date: timestamp("date").defaultNow(),
});

// Crisis alerts
export const crisisAlerts = pgTable("crisis_alerts", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  triggerType: text("trigger_type").notNull(), // 'screening', 'chat', 'manual'
  severity: text("severity").notNull(), // 'high', 'critical'
  isResolved: boolean("is_resolved").default(false),
  resolvedBy: uuid("resolved_by").references(() => users.id),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
});

// Custom AI personalities
export const customPersonalities = pgTable("custom_personalities", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  customPrompt: text("custom_prompt").notNull(),
  sourceType: text("source_type").notNull().default("text"), // 'text', 'file'
  originalFileName: text("original_file_name"),
  trainingData: text("training_data"), // Processed text content
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  screeningAssessments: many(screeningAssessments),
  chatSessions: many(chatSessions),
  appointments: many(appointments),
  forumPosts: many(forumPosts),
  forumReplies: many(forumReplies),
  moodEntries: many(moodEntries),
  crisisAlerts: many(crisisAlerts),
  customPersonalities: many(customPersonalities),
}));

export const customPersonalitiesRelations = relations(customPersonalities, ({ one }) => ({
  user: one(users, {
    fields: [customPersonalities.userId],
    references: [users.id],
  }),
}));

export const screeningAssessmentsRelations = relations(screeningAssessments, ({ one }) => ({
  user: one(users, {
    fields: [screeningAssessments.userId],
    references: [users.id],
  }),
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  user: one(users, {
    fields: [appointments.userId],
    references: [users.id],
  }),
  counselor: one(counselors, {
    fields: [appointments.counselorId],
    references: [counselors.id],
  }),
}));

export const forumPostsRelations = relations(forumPosts, ({ one, many }) => ({
  user: one(users, {
    fields: [forumPosts.userId],
    references: [users.id],
  }),
  replies: many(forumReplies),
}));

export const forumRepliesRelations = relations(forumReplies, ({ one }) => ({
  post: one(forumPosts, {
    fields: [forumReplies.postId],
    references: [forumPosts.id],
  }),
  user: one(users, {
    fields: [forumReplies.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertScreeningAssessmentSchema = createInsertSchema(screeningAssessments).omit({
  id: true,
  completedAt: true,
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  createdAt: true,
});

export const insertForumPostSchema = createInsertSchema(forumPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  likes: true,
  isModerated: true,
  isFlagged: true,
});

export const insertForumReplySchema = createInsertSchema(forumReplies).omit({
  id: true,
  createdAt: true,
  likes: true,
});

export const insertMoodEntrySchema = createInsertSchema(moodEntries).omit({
  id: true,
  date: true,
});

export const insertCrisisAlertSchema = createInsertSchema(crisisAlerts).omit({
  id: true,
  createdAt: true,
  resolvedAt: true,
});

export const insertCustomPersonalitySchema = createInsertSchema(customPersonalities).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type ScreeningAssessment = typeof screeningAssessments.$inferSelect;
export type InsertScreeningAssessment = z.infer<typeof insertScreeningAssessmentSchema>;
export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type ForumPost = typeof forumPosts.$inferSelect;
export type InsertForumPost = z.infer<typeof insertForumPostSchema>;
export type ForumReply = typeof forumReplies.$inferSelect;
export type InsertForumReply = z.infer<typeof insertForumReplySchema>;
export type Resource = typeof resources.$inferSelect;
export type MoodEntry = typeof moodEntries.$inferSelect;
export type InsertMoodEntry = z.infer<typeof insertMoodEntrySchema>;
export type CrisisAlert = typeof crisisAlerts.$inferSelect;
export type InsertCrisisAlert = z.infer<typeof insertCrisisAlertSchema>;
export type Counselor = typeof counselors.$inferSelect;
export type ChatSession = typeof chatSessions.$inferSelect;
export type CustomPersonality = typeof customPersonalities.$inferSelect;
export type InsertCustomPersonality = z.infer<typeof insertCustomPersonalitySchema>;
