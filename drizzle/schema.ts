import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  
  // Profil utilisateur
  profession: varchar("profession", { length: 100 }),
  professionDetected: boolean("professionDetected").default(false),
  subscriptionTier: mysqlEnum("subscriptionTier", ["basic", "premium", "enterprise"]).default("basic").notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Conversations table - stores all conversations
 */
export const conversations = mysqlTable("conversations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }),
  
  // Contexte de la conversation
  profession: varchar("profession", { length: 100 }),
  currentTask: text("currentTask"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = typeof conversations.$inferInsert;

/**
 * Messages table - stores individual messages in conversations
 */
export const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  conversationId: int("conversationId").notNull(),
  role: mysqlEnum("role", ["user", "assistant", "system"]).notNull(),
  content: text("content").notNull(),
  
  // Métadonnées optionnelles
  metadata: text("metadata"), // JSON string
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

/**
 * Permissions table - stores user permissions for different actions
 */
export const permissions = mysqlTable("permissions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  
  // Type de permission
  permissionType: mysqlEnum("permissionType", [
    "email",
    "documents",
    "pc_control",
    "devices",
    "purchases"
  ]).notNull(),
  
  // État de la permission
  enabled: boolean("enabled").default(false).notNull(),
  
  // Portée de la permission (JSON)
  scope: text("scope"), // { read: boolean, write: boolean, execute: boolean }
  
  grantedAt: timestamp("grantedAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt"),
});

export type Permission = typeof permissions.$inferSelect;
export type InsertPermission = typeof permissions.$inferInsert;

/**
 * Actions table - stores actions executed by the AI
 */
export const actions = mysqlTable("actions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  conversationId: int("conversationId"),
  
  // Type d'action
  actionType: mysqlEnum("actionType", [
    "invoice",
    "order",
    "email",
    "search",
    "document",
    "other"
  ]).notNull(),
  
  // Statut de l'action
  status: mysqlEnum("status", ["pending", "approved", "completed", "failed", "cancelled"]).default("pending").notNull(),
  
  // Données de l'action (JSON)
  inputData: text("inputData"),
  outputData: text("outputData"),
  
  // Autorisation
  requiresApproval: boolean("requiresApproval").default(true).notNull(),
  approvedAt: timestamp("approvedAt"),
  
  // Exécution
  executedAt: timestamp("executedAt"),
  error: text("error"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Action = typeof actions.$inferSelect;
export type InsertAction = typeof actions.$inferInsert;

/**
 * Profession profiles table - stores knowledge base for different professions
 */
export const professionProfiles = mysqlTable("professionProfiles", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  category: varchar("category", { length: 100 }),
  
  // Base de connaissances (JSON)
  knowledgeBase: text("knowledgeBase"), // { documents: [], videos: [], tools: [] }
  
  // Vocabulaire spécialisé (JSON array)
  vocabulary: text("vocabulary"),
  
  // Tâches communes (JSON array)
  commonTasks: text("commonTasks"),
  
  // Intégrations disponibles (JSON array)
  integrations: text("integrations"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ProfessionProfile = typeof professionProfiles.$inferSelect;
export type InsertProfessionProfile = typeof professionProfiles.$inferInsert;

/**
 * Backup logs table - stores metadata about database backups
 */
export const backupLogs = mysqlTable("backup_logs", {
  id: int("id").autoincrement().primaryKey(),
  timestamp: timestamp("timestamp").notNull(),
  type: mysqlEnum("type", ["hourly", "daily", "monthly"]).notNull(),
  size: int("size").notNull(), // Size in bytes
  tables: text("tables").notNull(), // JSON array of table names
  status: mysqlEnum("status", ["success", "failed"]).notNull(),
  error: text("error"),
  url: text("url").notNull(), // S3 URL of the backup file
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BackupLog = typeof backupLogs.$inferSelect;
export type InsertBackupLog = typeof backupLogs.$inferInsert;

/**
 * Health metrics table - stores system health metrics over time
 */
export const healthMetrics = mysqlTable("health_metrics", {
  id: int("id").autoincrement().primaryKey(),
  uptime: int("uptime").notNull(), // Percentage * 100 (e.g., 9990 = 99.90%)
  avgResponseTime: int("avg_response_time").notNull(), // Milliseconds
  errorRate: int("error_rate").notNull(), // Percentage * 100
  activeUsers: int("active_users").notNull(),
  totalRequests: int("total_requests").notNull(),
  failedRequests: int("failed_requests").notNull(),
  timestamp: timestamp("timestamp").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type HealthMetric = typeof healthMetrics.$inferSelect;
export type InsertHealthMetric = typeof healthMetrics.$inferInsert;

/**
 * Error logs table - stores application errors
 */
export const errorLogs = mysqlTable("error_logs", {
  id: int("id").autoincrement().primaryKey(),
  error: text("error").notNull(),
  stack: text("stack"),
  timestamp: timestamp("timestamp").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ErrorLog = typeof errorLogs.$inferSelect;
export type InsertErrorLog = typeof errorLogs.$inferInsert;

/**
 * Alerts table - stores system alerts
 */
export const alerts = mysqlTable("alerts", {
  id: int("id").autoincrement().primaryKey(),
  type: mysqlEnum("type", ["uptime", "performance", "error", "anomaly"]).notNull(),
  severity: mysqlEnum("severity", ["low", "medium", "high", "critical"]).notNull(),
  message: text("message").notNull(),
  timestamp: timestamp("timestamp").notNull(),
  resolved: boolean("resolved").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = typeof alerts.$inferInsert;

/**
 * Audit logs table - stores all user actions for security and compliance
 */
export const auditLogs = mysqlTable("audit_logs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  action: varchar("action", { length: 100 }).notNull(),
  details: text("details").notNull(),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  timestamp: timestamp("timestamp").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;


/**
 * Beta invitations table - stores beta tester invitations
 */
export const betaInvitations = mysqlTable("beta_invitations", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  inviteCode: varchar("invite_code", { length: 32 }).notNull().unique(),
  invitedBy: varchar("invited_by", { length: 255 }),
  
  // Status and tier
  status: mysqlEnum("status", ["pending", "accepted", "revoked"]).default("pending").notNull(),
  tier: mysqlEnum("tier", ["alpha", "beta", "early_access"]).default("beta").notNull(),
  
  // Metadata
  source: varchar("source", { length: 50 }), // 'manual', 'waitlist', 'referral'
  notes: text("notes"),
  
  // Special permissions
  canInviteOthers: boolean("can_invite_others").default(false).notNull(),
  maxInvites: int("max_invites").default(0).notNull(),
  invitesUsed: int("invites_used").default(0).notNull(),
  
  // Engagement tracking
  firstLoginAt: timestamp("first_login_at"),
  lastActiveAt: timestamp("last_active_at"),
  sessionsCount: int("sessions_count").default(0).notNull(),
  feedbackSubmitted: boolean("feedback_submitted").default(false).notNull(),
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  acceptedAt: timestamp("accepted_at"),
  expiresAt: timestamp("expires_at"),
});

export type BetaInvitation = typeof betaInvitations.$inferSelect;
export type InsertBetaInvitation = typeof betaInvitations.$inferInsert;

/**
 * User permissions table - stores granular permissions for users (including beta testers)
 */
export const userPermissions = mysqlTable("user_permissions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  permissionKey: varchar("permission_key", { length: 100 }).notNull(), // 'beta_tester', 'alpha_tester', 'feature_invoices', etc.
  grantedAt: timestamp("granted_at").defaultNow().notNull(),
  grantedBy: varchar("granted_by", { length: 255 }),
  expiresAt: timestamp("expires_at"),
});

export type UserPermission = typeof userPermissions.$inferSelect;
export type InsertUserPermission = typeof userPermissions.$inferInsert;

/**
 * Beta feedback table - stores feedback from beta testers
 */
export const betaFeedback = mysqlTable("beta_feedback", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  type: mysqlEnum("type", ["bug", "suggestion", "praise", "question"]).notNull(),
  message: text("message").notNull(),
  screenshot: text("screenshot"), // URL to screenshot if provided
  
  // Context capture
  url: varchar("url", { length: 500 }),
  userAgent: text("user_agent"),
  viewport: varchar("viewport", { length: 50 }), // e.g., "1920x1080"
  sessionId: varchar("session_id", { length: 100 }),
  
  // Status
  status: mysqlEnum("status", ["new", "in_progress", "resolved", "closed"]).default("new").notNull(),
  resolvedAt: timestamp("resolved_at"),
  resolvedBy: varchar("resolved_by", { length: 255 }),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type BetaFeedback = typeof betaFeedback.$inferSelect;
export type InsertBetaFeedback = typeof betaFeedback.$inferInsert;

/**
 * Beta activity table - tracks beta tester activity for analytics
 */
export const betaActivity = mysqlTable("beta_activity", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  activityType: varchar("activity_type", { length: 100 }).notNull(), // 'login', 'feature_use', 'bug_report', etc.
  details: text("details"), // JSON with additional context
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export type BetaActivity = typeof betaActivity.$inferSelect;
export type InsertBetaActivity = typeof betaActivity.$inferInsert;

/**
 * Beta rewards table - stores points and rewards for beta testers
 */
export const betaRewards = mysqlTable("beta_rewards", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  
  // Points system
  totalPoints: int("total_points").default(0).notNull(),
  
  // Badges earned (JSON array)
  badges: text("badges"), // ['bronze', 'silver', 'gold', 'platinum']
  
  // Rewards claimed (JSON array)
  rewardsClaimed: text("rewards_claimed"),
  
  // Referrals
  referralCount: int("referral_count").default(0).notNull(),
  activeReferrals: int("active_referrals").default(0).notNull(),
  
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type BetaReward = typeof betaRewards.$inferSelect;
export type InsertBetaReward = typeof betaRewards.$inferInsert;

