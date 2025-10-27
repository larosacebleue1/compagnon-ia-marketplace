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

