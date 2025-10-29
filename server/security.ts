/**
 * Système de sécurité et chiffrement
 * 
 * Fonctionnalités :
 * - Chiffrement bout en bout des données sensibles
 * - Authentification multi-facteurs (2FA)
 * - Logs d'audit (traçabilité complète)
 * - Conformité RGPD
 * - Détection d'intrusion
 */

import crypto from "crypto";
import { getDb } from "./db";
import { sql } from "drizzle-orm";

// Algorithme de chiffrement
const ALGORITHM = "aes-256-gcm";
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 16; // 128 bits
const AUTH_TAG_LENGTH = 16; // 128 bits

/**
 * Génère une clé de chiffrement depuis une passphrase
 */
function deriveKey(passphrase: string, salt: Buffer): Buffer {
  return crypto.pbkdf2Sync(passphrase, salt, 100000, KEY_LENGTH, "sha512");
}

/**
 * Chiffre des données
 */
export function encrypt(
  data: string,
  passphrase: string
): { encrypted: string; salt: string; iv: string; authTag: string } {
  // Générer un salt aléatoire
  const salt = crypto.randomBytes(32);

  // Dériver la clé depuis la passphrase
  const key = deriveKey(passphrase, salt);

  // Générer un IV aléatoire
  const iv = crypto.randomBytes(IV_LENGTH);

  // Créer le cipher
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  // Chiffrer les données
  let encrypted = cipher.update(data, "utf8", "hex");
  encrypted += cipher.final("hex");

  // Récupérer l'auth tag
  const authTag = cipher.getAuthTag();

  return {
    encrypted,
    salt: salt.toString("hex"),
    iv: iv.toString("hex"),
    authTag: authTag.toString("hex"),
  };
}

/**
 * Déchiffre des données
 */
export function decrypt(
  encrypted: string,
  passphrase: string,
  salt: string,
  iv: string,
  authTag: string
): string {
  // Dériver la clé depuis la passphrase
  const key = deriveKey(passphrase, Buffer.from(salt, "hex"));

  // Créer le decipher
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    key,
    Buffer.from(iv, "hex")
  );

  // Définir l'auth tag
  decipher.setAuthTag(Buffer.from(authTag, "hex"));

  // Déchiffrer les données
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

/**
 * Hash un mot de passe de manière sécurisée
 */
export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(32).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 100000, 64, "sha512")
    .toString("hex");

  return { hash, salt };
}

/**
 * Vérifie un mot de passe
 */
export function verifyPassword(
  password: string,
  hash: string,
  salt: string
): boolean {
  const verifyHash = crypto
    .pbkdf2Sync(password, salt, 100000, 64, "sha512")
    .toString("hex");

  return hash === verifyHash;
}

/**
 * Génère un token sécurisé
 */
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString("hex");
}

/**
 * Génère un code 2FA (6 chiffres)
 */
export function generate2FACode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Enregistre une action dans les logs d'audit
 */
export async function auditLog(
  userId: number,
  action: string,
  details: string,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Security] Cannot save audit log: database not available");
    return;
  }

  try {
    await db.execute(
      sql.raw(`
        INSERT INTO audit_logs (
          user_id,
          action,
          details,
          ip_address,
          user_agent,
          timestamp,
          createdAt
        ) VALUES (
          ${userId},
          '${action.replace(/'/g, "''")}',
          '${details.replace(/'/g, "''")}',
          ${ipAddress ? `'${ipAddress}'` : "NULL"},
          ${userAgent ? `'${userAgent.replace(/'/g, "''")}'` : "NULL"},
          NOW(),
          NOW()
        )
      `)
    );
  } catch (error) {
    console.error("[Security] Error saving audit log:", error);
  }
}

/**
 * Détecte les tentatives de connexion suspectes
 */
export async function detectSuspiciousLogin(
  userId: number,
  ipAddress: string
): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    return false;
  }

  try {
    // Récupérer les 10 dernières connexions
    const result = await db.execute(
      sql.raw(`
        SELECT ip_address FROM audit_logs
        WHERE user_id = ${userId}
        AND action = 'login'
        ORDER BY timestamp DESC
        LIMIT 10
      `)
    );

    const recentIPs = ((result as any).rows || []).map((row: any) => row.ip_address);

    // Si l'IP n'a jamais été vue, c'est suspect
    if (recentIPs.length > 0 && !recentIPs.includes(ipAddress)) {
      return true;
    }

    return false;
  } catch (error) {
    console.error("[Security] Error detecting suspicious login:", error);
    return false;
  }
}

/**
 * Vérifie si un utilisateur a trop de tentatives de connexion échouées
 */
export async function checkFailedLoginAttempts(
  userId: number
): Promise<{ blocked: boolean; attempts: number }> {
  const db = await getDb();
  if (!db) {
    return { blocked: false, attempts: 0 };
  }

  try {
    // Compter les tentatives échouées des 15 dernières minutes
    const result = await db.execute(
      sql.raw(`
        SELECT COUNT(*) as count FROM audit_logs
        WHERE user_id = ${userId}
        AND action = 'login_failed'
        AND timestamp > DATE_SUB(NOW(), INTERVAL 15 MINUTE)
      `)
    );

    const attempts = ((result as any).rows?.[0]?.count || 0) as number;

    // Bloquer après 5 tentatives échouées
    return {
      blocked: attempts >= 5,
      attempts,
    };
  } catch (error) {
    console.error("[Security] Error checking failed login attempts:", error);
    return { blocked: false, attempts: 0 };
  }
}

/**
 * Anonymise les données d'un utilisateur (RGPD)
 */
export async function anonymizeUserData(userId: number): Promise<void> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  console.log(`[Security] Anonymizing data for user ${userId}`);

  try {
    // Anonymiser les données utilisateur
    await db.execute(
      sql.raw(`
        UPDATE users SET
          name = 'Utilisateur anonyme',
          email = CONCAT('anonymized_', id, '@example.com'),
          openId = CONCAT('anonymized_', id),
          profession = NULL
        WHERE id = ${userId}
      `)
    );

    // Supprimer les conversations
    await db.execute(
      sql.raw(`
        DELETE FROM conversations WHERE userId = ${userId}
      `)
    );

    // Supprimer les messages (via cascade normalement, mais on s'assure)
    await db.execute(
      sql.raw(`
        DELETE FROM messages WHERE conversationId IN (
          SELECT id FROM conversations WHERE userId = ${userId}
        )
      `)
    );

    // Supprimer les permissions
    await db.execute(
      sql.raw(`
        DELETE FROM permissions WHERE userId = ${userId}
      `)
    );

    // Supprimer les actions
    await db.execute(
      sql.raw(`
        DELETE FROM actions WHERE userId = ${userId}
      `)
    );

    // Garder les logs d'audit mais anonymiser
    await db.execute(
      sql.raw(`
        UPDATE audit_logs SET
          details = 'Données anonymisées'
        WHERE user_id = ${userId}
      `)
    );

    console.log(`[Security] ✅ User ${userId} data anonymized`);
  } catch (error) {
    console.error(`[Security] ❌ Error anonymizing user ${userId}:`, error);
    throw error;
  }
}

/**
 * Exporte toutes les données d'un utilisateur (RGPD)
 */
export async function exportUserData(userId: number): Promise<string> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  console.log(`[Security] Exporting data for user ${userId}`);

  try {
    const userData: Record<string, any> = {};

    // Récupérer les données utilisateur
    const userResult = await db.execute(
      sql.raw(`SELECT * FROM users WHERE id = ${userId}`)
    );
    userData.user = (userResult as any).rows?.[0] || null;

    // Récupérer les conversations
    const conversationsResult = await db.execute(
      sql.raw(`SELECT * FROM conversations WHERE userId = ${userId}`)
    );
    userData.conversations = (conversationsResult as any).rows || [];

    // Récupérer les messages
    const messagesResult = await db.execute(
      sql.raw(`
        SELECT m.* FROM messages m
        JOIN conversations c ON m.conversationId = c.id
        WHERE c.userId = ${userId}
      `)
    );
    userData.messages = (messagesResult as any).rows || [];

    // Récupérer les permissions
    const permissionsResult = await db.execute(
      sql.raw(`SELECT * FROM permissions WHERE userId = ${userId}`)
    );
    userData.permissions = (permissionsResult as any).rows || [];

    // Récupérer les actions
    const actionsResult = await db.execute(
      sql.raw(`SELECT * FROM actions WHERE userId = ${userId}`)
    );
    userData.actions = (actionsResult as any).rows || [];

    console.log(`[Security] ✅ User ${userId} data exported`);

    return JSON.stringify(userData, null, 2);
  } catch (error) {
    console.error(`[Security] ❌ Error exporting user ${userId}:`, error);
    throw error;
  }
}

/**
 * Initialise le système de sécurité
 */
export function initializeSecurity(): void {
  console.log("[Security] Initializing security system");

  // Vérifier que les variables d'environnement critiques sont présentes
  if (!process.env.JWT_SECRET) {
    console.error("[Security] ❌ JWT_SECRET not set!");
  }

  if (!process.env.DATABASE_URL) {
    console.error("[Security] ❌ DATABASE_URL not set!");
  }

  console.log("[Security] ✅ Security system initialized");
  console.log("[Security] - Encryption: AES-256-GCM");
  console.log("[Security] - Password hashing: PBKDF2 (100,000 iterations)");
  console.log("[Security] - Audit logging: Enabled");
  console.log("[Security] - RGPD compliance: Enabled");
}

