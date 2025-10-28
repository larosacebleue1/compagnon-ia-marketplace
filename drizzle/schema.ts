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

