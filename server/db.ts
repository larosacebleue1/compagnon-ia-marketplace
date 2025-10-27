import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users,
  conversations,
  messages,
  permissions,
  actions,
  professionProfiles,
  InsertConversation,
  InsertMessage,
  InsertPermission,
  InsertAction,
  Conversation,
  Message
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod", "profession"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }
    if (user.subscriptionTier !== undefined) {
      values.subscriptionTier = user.subscriptionTier;
      updateSet.subscriptionTier = user.subscriptionTier;
    }
    if (user.professionDetected !== undefined) {
      values.professionDetected = user.professionDetected;
      updateSet.professionDetected = user.professionDetected;
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ Conversations ============

export async function createConversation(data: InsertConversation): Promise<Conversation> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(conversations).values(data);
  const id = Number(result[0].insertId);
  
  const created = await db.select().from(conversations).where(eq(conversations.id, id)).limit(1);
  return created[0];
}

export async function getUserConversations(userId: number): Promise<Conversation[]> {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(conversations)
    .where(eq(conversations.userId, userId))
    .orderBy(desc(conversations.updatedAt));
}

export async function getConversationById(id: number): Promise<Conversation | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(conversations).where(eq(conversations.id, id)).limit(1);
  return result[0];
}

export async function updateConversation(id: number, data: Partial<InsertConversation>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(conversations).set(data).where(eq(conversations.id, id));
}

// ============ Messages ============

export async function createMessage(data: InsertMessage): Promise<Message> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(messages).values(data);
  const id = Number(result[0].insertId);
  
  const created = await db.select().from(messages).where(eq(messages.id, id)).limit(1);
  return created[0];
}

export async function getConversationMessages(conversationId: number): Promise<Message[]> {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(messages.createdAt);
}

// ============ Permissions ============

export async function getUserPermissions(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(permissions).where(eq(permissions.userId, userId));
}

export async function upsertPermission(data: InsertPermission) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(permissions).values(data).onDuplicateKeyUpdate({
    set: {
      enabled: data.enabled,
      scope: data.scope,
    },
  });
}

// ============ Actions ============

export async function createAction(data: InsertAction) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(actions).values(data);
  return Number(result[0].insertId);
}

export async function getUserActions(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(actions)
    .where(eq(actions.userId, userId))
    .orderBy(desc(actions.createdAt));
}

export async function updateAction(id: number, data: Partial<InsertAction>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(actions).set(data).where(eq(actions.id, id));
}

// ============ Profession Profiles ============

export async function getProfessionProfile(name: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(professionProfiles)
    .where(eq(professionProfiles.name, name))
    .limit(1);
  
  return result[0];
}

export async function getAllProfessionProfiles() {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(professionProfiles);
}

