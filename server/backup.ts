/**
 * Système de backups automatiques de la base de données
 * 
 * Fonctionnalités :
 * - Backups automatiques toutes les heures
 * - Rétention : 24 dernières heures (1 par heure)
 * - Backups quotidiens : 30 derniers jours
 * - Backups mensuels : 12 derniers mois
 * - Upload vers S3 pour stockage sécurisé
 * - Logs détaillés de chaque backup
 */

import { getDb } from "./db";
import { storagePut } from "./storage";
import { sql } from "drizzle-orm";

interface BackupMetadata {
  timestamp: Date;
  type: "hourly" | "daily" | "monthly";
  size: number;
  tables: string[];
  status: "success" | "failed";
  error?: string;
}

/**
 * Exporte toutes les tables de la base de données
 */
async function exportDatabase(): Promise<{ data: string; tables: string[] }> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const tables = [
    "users",
    "conversations",
    "messages",
    "permissions",
    "actions",
    "professionProfiles",
  ];

  const backupData: Record<string, any[]> = {};

  // Exporter chaque table
  for (const table of tables) {
    try {
      const result = await db.execute(sql.raw(`SELECT * FROM ${table}`));
      backupData[table] = (result as any).rows || [];
    } catch (error) {
      console.error(`[Backup] Error exporting table ${table}:`, error);
      backupData[table] = [];
    }
  }

  return {
    data: JSON.stringify(backupData, null, 2),
    tables,
  };
}

/**
 * Crée un backup et l'upload vers S3
 */
export async function createBackup(
  type: "hourly" | "daily" | "monthly" = "hourly"
): Promise<BackupMetadata> {
  const startTime = Date.now();
  const timestamp = new Date();

  console.log(`[Backup] Starting ${type} backup at ${timestamp.toISOString()}`);

  try {
    // Exporter la base de données
    const { data, tables } = await exportDatabase();

    // Générer le nom du fichier
    const fileName = `backup-${type}-${timestamp.toISOString().replace(/[:.]/g, "-")}.json`;
    const fileKey = `backups/${type}/${fileName}`;

    // Upload vers S3
    const { url } = await storagePut(
      fileKey,
      Buffer.from(data, "utf-8"),
      "application/json"
    );

    const duration = Date.now() - startTime;
    const size = Buffer.byteLength(data, "utf-8");

    const metadata: BackupMetadata = {
      timestamp,
      type,
      size,
      tables,
      status: "success",
    };

    console.log(
      `[Backup] ✅ ${type} backup completed in ${duration}ms (${(size / 1024).toFixed(2)} KB)`
    );
    console.log(`[Backup] URL: ${url}`);

    // Sauvegarder les métadonnées du backup
    await saveBackupMetadata(metadata, url);

    return metadata;
  } catch (error) {
    const metadata: BackupMetadata = {
      timestamp,
      type,
      size: 0,
      tables: [],
      status: "failed",
      error: error instanceof Error ? error.message : String(error),
    };

    console.error(`[Backup] ❌ ${type} backup failed:`, error);

    // Sauvegarder l'échec
    await saveBackupMetadata(metadata, "");

    return metadata;
  }
}

/**
 * Sauvegarde les métadonnées d'un backup dans la base de données
 */
async function saveBackupMetadata(
  metadata: BackupMetadata,
  url: string
): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Backup] Cannot save metadata: database not available");
    return;
  }

  try {
    await db.execute(
      sql.raw(`
        INSERT INTO backup_logs (
          timestamp,
          type,
          size,
          tables,
          status,
          error,
          url,
          createdAt
        ) VALUES (
          '${metadata.timestamp.toISOString()}',
          '${metadata.type}',
          ${metadata.size},
          '${JSON.stringify(metadata.tables)}',
          '${metadata.status}',
          ${metadata.error ? `'${metadata.error.replace(/'/g, "''")}'` : "NULL"},
          '${url}',
          NOW()
        )
      `)
    );
  } catch (error) {
    console.error("[Backup] Error saving metadata:", error);
  }
}

/**
 * Nettoie les anciens backups selon la politique de rétention
 * - Hourly: garde les 24 derniers
 * - Daily: garde les 30 derniers
 * - Monthly: garde les 12 derniers
 */
export async function cleanupOldBackups(): Promise<void> {
  console.log("[Backup] Starting cleanup of old backups");

  const db = await getDb();
  if (!db) {
    console.warn("[Backup] Cannot cleanup: database not available");
    return;
  }

  try {
    // Nettoyer les backups horaires (> 24h)
    await db.execute(
      sql.raw(`
        DELETE FROM backup_logs
        WHERE type = 'hourly'
        AND timestamp < DATE_SUB(NOW(), INTERVAL 24 HOUR)
      `)
    );

    // Nettoyer les backups quotidiens (> 30 jours)
    await db.execute(
      sql.raw(`
        DELETE FROM backup_logs
        WHERE type = 'daily'
        AND timestamp < DATE_SUB(NOW(), INTERVAL 30 DAY)
      `)
    );

    // Nettoyer les backups mensuels (> 12 mois)
    await db.execute(
      sql.raw(`
        DELETE FROM backup_logs
        WHERE type = 'monthly'
        AND timestamp < DATE_SUB(NOW(), INTERVAL 12 MONTH)
      `)
    );

    console.log("[Backup] ✅ Cleanup completed");
  } catch (error) {
    console.error("[Backup] ❌ Cleanup failed:", error);
  }
}

/**
 * Restaure la base de données depuis un backup
 */
export async function restoreBackup(backupUrl: string): Promise<void> {
  console.log(`[Backup] Starting restore from ${backupUrl}`);

  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    // Télécharger le backup depuis S3
    const response = await fetch(backupUrl);
    if (!response.ok) {
      throw new Error(`Failed to download backup: ${response.statusText}`);
    }

    const backupData = await response.json();

    // Désactiver les contraintes de clés étrangères temporairement
    await db.execute(sql.raw("SET FOREIGN_KEY_CHECKS = 0"));

    // Restaurer chaque table
    for (const [tableName, rows] of Object.entries(backupData)) {
      if (!Array.isArray(rows) || rows.length === 0) {
        console.log(`[Backup] Skipping empty table: ${tableName}`);
        continue;
      }

      console.log(`[Backup] Restoring table: ${tableName} (${rows.length} rows)`);

      // Vider la table
      await db.execute(sql.raw(`TRUNCATE TABLE ${tableName}`));

      // Insérer les données
      for (const row of rows) {
        const columns = Object.keys(row).join(", ");
        const values = Object.values(row)
          .map((v) => {
            if (v === null) return "NULL";
            if (typeof v === "string") return `'${v.replace(/'/g, "''")}'`;
            if (v instanceof Date) return `'${v.toISOString()}'`;
            return String(v);
          })
          .join(", ");

        await db.execute(
          sql.raw(`INSERT INTO ${tableName} (${columns}) VALUES (${values})`)
        );
      }
    }

    // Réactiver les contraintes
    await db.execute(sql.raw("SET FOREIGN_KEY_CHECKS = 1"));

    console.log("[Backup] ✅ Restore completed successfully");
  } catch (error) {
    console.error("[Backup] ❌ Restore failed:", error);
    throw error;
  }
}

/**
 * Récupère la liste des backups disponibles
 */
export async function listBackups(
  type?: "hourly" | "daily" | "monthly"
): Promise<BackupMetadata[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Backup] Cannot list backups: database not available");
    return [];
  }

  try {
    const query = type
      ? `SELECT * FROM backup_logs WHERE type = '${type}' ORDER BY timestamp DESC`
      : `SELECT * FROM backup_logs ORDER BY timestamp DESC`;

    const result = await db.execute(sql.raw(query));

    return ((result as any).rows || []).map((row: any) => ({
      timestamp: new Date(row.timestamp),
      type: row.type,
      size: row.size,
      tables: JSON.parse(row.tables || "[]"),
      status: row.status,
      error: row.error,
    }));
  } catch (error) {
    console.error("[Backup] Error listing backups:", error);
    return [];
  }
}

/**
 * Initialise le système de backups automatiques
 */
export function initializeBackupSystem(): void {
  console.log("[Backup] Initializing automatic backup system");

  // Backup horaire (toutes les heures)
  setInterval(
    async () => {
      await createBackup("hourly");
    },
    60 * 60 * 1000
  ); // 1 heure

  // Backup quotidien (tous les jours à 2h du matin)
  const scheduleDaily = () => {
    const now = new Date();
    const next = new Date(now);
    next.setHours(2, 0, 0, 0);

    if (next <= now) {
      next.setDate(next.getDate() + 1);
    }

    const delay = next.getTime() - now.getTime();

    setTimeout(() => {
      createBackup("daily");
      setInterval(
        () => {
          createBackup("daily");
        },
        24 * 60 * 60 * 1000
      ); // 24 heures
    }, delay);
  };

  scheduleDaily();

  // Backup mensuel (le 1er de chaque mois à 3h du matin)
  const scheduleMonthly = () => {
    const now = new Date();
    const next = new Date(now);
    next.setDate(1);
    next.setHours(3, 0, 0, 0);

    if (next <= now) {
      next.setMonth(next.getMonth() + 1);
    }

    const delay = next.getTime() - now.getTime();

    setTimeout(() => {
      createBackup("monthly");
      // Reprogrammer pour le mois suivant
      scheduleMonthly();
    }, delay);
  };

  scheduleMonthly();

  // Nettoyage quotidien des anciens backups (tous les jours à 4h du matin)
  const scheduleCleanup = () => {
    const now = new Date();
    const next = new Date(now);
    next.setHours(4, 0, 0, 0);

    if (next <= now) {
      next.setDate(next.getDate() + 1);
    }

    const delay = next.getTime() - now.getTime();

    setTimeout(() => {
      cleanupOldBackups();
      setInterval(cleanupOldBackups, 24 * 60 * 60 * 1000); // 24 heures
    }, delay);
  };

  scheduleCleanup();

  console.log("[Backup] ✅ Automatic backup system initialized");
  console.log("[Backup] - Hourly backups: every hour");
  console.log("[Backup] - Daily backups: every day at 2:00 AM");
  console.log("[Backup] - Monthly backups: 1st of each month at 3:00 AM");
  console.log("[Backup] - Cleanup: every day at 4:00 AM");
}

