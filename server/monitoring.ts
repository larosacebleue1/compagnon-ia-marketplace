/**
 * Système de monitoring et d'alertes
 * 
 * Fonctionnalités :
 * - Monitoring uptime (disponibilité du service)
 * - Monitoring performance (temps de réponse)
 * - Monitoring erreurs (taux d'erreur)
 * - Alertes automatiques (email/notification si problème)
 * - Dashboard métriques temps réel
 * - Détection anomalies
 */

import { getDb } from "./db";
import { sql } from "drizzle-orm";
import { notifyOwner } from "./_core/notification";

interface HealthMetrics {
  uptime: number; // Percentage
  avgResponseTime: number; // Milliseconds
  errorRate: number; // Percentage
  activeUsers: number;
  totalRequests: number;
  failedRequests: number;
  timestamp: Date;
}

interface Alert {
  type: "uptime" | "performance" | "error" | "anomaly";
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  timestamp: Date;
  resolved: boolean;
}

// Métriques en mémoire (pour performance)
const metrics = {
  requests: [] as Array<{ timestamp: Date; duration: number; success: boolean }>,
  errors: [] as Array<{ timestamp: Date; error: string; stack?: string }>,
  activeUsers: new Set<number>(),
  startTime: new Date(),
};

// Seuils d'alerte
const THRESHOLDS = {
  uptime: 99.9, // %
  responseTime: 500, // ms
  errorRate: 0.1, // %
  anomalyMultiplier: 3, // 3x la moyenne = anomalie
};

/**
 * Enregistre une requête
 */
export function trackRequest(
  userId: number | null,
  duration: number,
  success: boolean
): void {
  metrics.requests.push({
    timestamp: new Date(),
    duration,
    success,
  });

  if (userId) {
    metrics.activeUsers.add(userId);
  }

  // Nettoyer les anciennes métriques (> 1 heure)
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  metrics.requests = metrics.requests.filter((r) => r.timestamp > oneHourAgo);
}

/**
 * Enregistre une erreur
 */
export function trackError(error: Error | string, stack?: string): void {
  const errorMessage = error instanceof Error ? error.message : error;
  const errorStack = error instanceof Error ? error.stack : stack;

  metrics.errors.push({
    timestamp: new Date(),
    error: errorMessage,
    stack: errorStack,
  });

  // Nettoyer les anciennes erreurs (> 1 heure)
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  metrics.errors = metrics.errors.filter((e) => e.timestamp > oneHourAgo);

  // Sauvegarder dans la base de données
  saveErrorToDatabase(errorMessage, errorStack);

  // Vérifier si on doit alerter
  checkErrorRateAlert();
}

/**
 * Calcule les métriques de santé
 */
export function getHealthMetrics(): HealthMetrics {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

  // Filtrer les requêtes de la dernière heure
  const recentRequests = metrics.requests.filter((r) => r.timestamp > oneHourAgo);

  const totalRequests = recentRequests.length;
  const failedRequests = recentRequests.filter((r) => !r.success).length;
  const successfulRequests = totalRequests - failedRequests;

  // Uptime
  const uptime = totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 100;

  // Temps de réponse moyen
  const avgResponseTime =
    totalRequests > 0
      ? recentRequests.reduce((sum, r) => sum + r.duration, 0) / totalRequests
      : 0;

  // Taux d'erreur
  const errorRate = totalRequests > 0 ? (failedRequests / totalRequests) * 100 : 0;

  return {
    uptime,
    avgResponseTime,
    errorRate,
    activeUsers: metrics.activeUsers.size,
    totalRequests,
    failedRequests,
    timestamp: now,
  };
}

/**
 * Sauvegarde les métriques dans la base de données
 */
async function saveMetricsToDatabase(metrics: HealthMetrics): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Monitoring] Cannot save metrics: database not available");
    return;
  }

  try {
    await db.execute(
      sql.raw(`
        INSERT INTO health_metrics (
          uptime,
          avg_response_time,
          error_rate,
          active_users,
          total_requests,
          failed_requests,
          timestamp,
          created_at
        ) VALUES (
          ${metrics.uptime},
          ${metrics.avgResponseTime},
          ${metrics.errorRate},
          ${metrics.activeUsers},
          ${metrics.totalRequests},
          ${metrics.failedRequests},
          '${metrics.timestamp.toISOString()}',
          NOW()
        )
      `)
    );
  } catch (error) {
    console.error("[Monitoring] Error saving metrics:", error);
  }
}

/**
 * Sauvegarde une erreur dans la base de données
 */
async function saveErrorToDatabase(error: string, stack?: string): Promise<void> {
  const db = await getDb();
  if (!db) {
    return;
  }

  try {
    await db.execute(
      sql.raw(`
        INSERT INTO error_logs (
          error,
          stack,
          timestamp,
          created_at
        ) VALUES (
          '${error.replace(/'/g, "''")}',
          ${stack ? `'${stack.replace(/'/g, "''")}'` : "NULL"},
          NOW(),
          NOW()
        )
      `)
    );
  } catch (err) {
    console.error("[Monitoring] Error saving error log:", err);
  }
}

/**
 * Sauvegarde une alerte dans la base de données
 */
async function saveAlert(alert: Alert): Promise<void> {
  const db = await getDb();
  if (!db) {
    return;
  }

  try {
    await db.execute(
      sql.raw(`
        INSERT INTO alerts (
          type,
          severity,
          message,
          timestamp,
          resolved,
          created_at
        ) VALUES (
          '${alert.type}',
          '${alert.severity}',
          '${alert.message.replace(/'/g, "''")}',
          '${alert.timestamp.toISOString()}',
          ${alert.resolved ? 1 : 0},
          NOW()
        )
      `)
    );
  } catch (error) {
    console.error("[Monitoring] Error saving alert:", error);
  }
}

/**
 * Envoie une alerte au propriétaire
 */
async function sendAlert(alert: Alert): Promise<void> {
  console.error(`[Monitoring] 🚨 ALERT [${alert.severity.toUpperCase()}]: ${alert.message}`);

  // Sauvegarder l'alerte
  await saveAlert(alert);

  // Envoyer notification au propriétaire (seulement pour les alertes critiques et high)
  if (alert.severity === "critical" || alert.severity === "high") {
    try {
      await notifyOwner({
        title: `🚨 Alerte ${alert.severity.toUpperCase()}: ${alert.type}`,
        content: alert.message,
      });
    } catch (error) {
      console.error("[Monitoring] Failed to send alert notification:", error);
    }
  }
}

/**
 * Vérifie le taux d'erreur et alerte si nécessaire
 */
function checkErrorRateAlert(): void {
  const health = getHealthMetrics();

  if (health.errorRate > THRESHOLDS.errorRate) {
    sendAlert({
      type: "error",
      severity: health.errorRate > 1 ? "critical" : "high",
      message: `Taux d'erreur élevé: ${health.errorRate.toFixed(2)}% (seuil: ${THRESHOLDS.errorRate}%)`,
      timestamp: new Date(),
      resolved: false,
    });
  }
}

/**
 * Vérifie l'uptime et alerte si nécessaire
 */
function checkUptimeAlert(): void {
  const health = getHealthMetrics();

  if (health.uptime < THRESHOLDS.uptime) {
    sendAlert({
      type: "uptime",
      severity: health.uptime < 95 ? "critical" : "high",
      message: `Uptime faible: ${health.uptime.toFixed(2)}% (seuil: ${THRESHOLDS.uptime}%)`,
      timestamp: new Date(),
      resolved: false,
    });
  }
}

/**
 * Vérifie les performances et alerte si nécessaire
 */
function checkPerformanceAlert(): void {
  const health = getHealthMetrics();

  if (health.avgResponseTime > THRESHOLDS.responseTime) {
    sendAlert({
      type: "performance",
      severity: health.avgResponseTime > THRESHOLDS.responseTime * 2 ? "high" : "medium",
      message: `Temps de réponse élevé: ${health.avgResponseTime.toFixed(0)}ms (seuil: ${THRESHOLDS.responseTime}ms)`,
      timestamp: new Date(),
      resolved: false,
    });
  }
}

/**
 * Détecte les anomalies (pics soudains)
 */
function detectAnomalies(): void {
  const now = new Date();
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

  // Requêtes des 5 dernières minutes
  const recentRequests = metrics.requests.filter((r) => r.timestamp > fiveMinutesAgo);

  // Requêtes de l'heure précédente (pour comparaison)
  const hourlyRequests = metrics.requests.filter((r) => r.timestamp > oneHourAgo);

  if (recentRequests.length === 0 || hourlyRequests.length === 0) {
    return;
  }

  // Taux de requêtes par minute
  const recentRate = recentRequests.length / 5;
  const hourlyRate = hourlyRequests.length / 60;

  // Anomalie si le taux récent est 3x supérieur à la moyenne
  if (recentRate > hourlyRate * THRESHOLDS.anomalyMultiplier) {
    sendAlert({
      type: "anomaly",
      severity: "medium",
      message: `Pic de trafic détecté: ${recentRate.toFixed(1)} req/min (moyenne: ${hourlyRate.toFixed(1)} req/min)`,
      timestamp: new Date(),
      resolved: false,
    });
  }
}

/**
 * Initialise le système de monitoring
 */
export function initializeMonitoring(): void {
  console.log("[Monitoring] Initializing monitoring system");

  // Sauvegarder les métriques toutes les 5 minutes
  setInterval(() => {
    const health = getHealthMetrics();
    saveMetricsToDatabase(health);
    console.log(
      `[Monitoring] Uptime: ${health.uptime.toFixed(2)}% | Response: ${health.avgResponseTime.toFixed(0)}ms | Errors: ${health.errorRate.toFixed(2)}% | Users: ${health.activeUsers}`
    );
  }, 5 * 60 * 1000); // 5 minutes

  // Vérifier l'uptime toutes les minutes
  setInterval(checkUptimeAlert, 60 * 1000); // 1 minute

  // Vérifier les performances toutes les 5 minutes
  setInterval(checkPerformanceAlert, 5 * 60 * 1000); // 5 minutes

  // Détecter les anomalies toutes les 5 minutes
  setInterval(detectAnomalies, 5 * 60 * 1000); // 5 minutes

  // Nettoyer les utilisateurs actifs toutes les heures
  setInterval(() => {
    metrics.activeUsers.clear();
  }, 60 * 60 * 1000); // 1 heure

  console.log("[Monitoring] ✅ Monitoring system initialized");
  console.log("[Monitoring] - Metrics saved every 5 minutes");
  console.log("[Monitoring] - Uptime checks every minute");
  console.log("[Monitoring] - Performance checks every 5 minutes");
  console.log("[Monitoring] - Anomaly detection every 5 minutes");
}

/**
 * Middleware Express pour tracker les requêtes
 */
export function monitoringMiddleware(req: any, res: any, next: any): void {
  const startTime = Date.now();

  // Extraire l'ID utilisateur (si authentifié)
  const userId = req.user?.id || null;

  // Intercepter la fin de la réponse
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const success = res.statusCode < 400;

    trackRequest(userId, duration, success);

    // Logger les requêtes lentes
    if (duration > THRESHOLDS.responseTime) {
      console.warn(
        `[Monitoring] Slow request: ${req.method} ${req.path} - ${duration}ms`
      );
    }
  });

  next();
}

/**
 * Récupère les métriques historiques
 */
export async function getHistoricalMetrics(
  hours: number = 24
): Promise<HealthMetrics[]> {
  const db = await getDb();
  if (!db) {
    return [];
  }

  try {
    const result = await db.execute(
      sql.raw(`
        SELECT * FROM health_metrics
        WHERE timestamp > DATE_SUB(NOW(), INTERVAL ${hours} HOUR)
        ORDER BY timestamp DESC
      `)
    );

    return ((result as any).rows || []).map((row: any) => ({
      uptime: row.uptime,
      avgResponseTime: row.avg_response_time,
      errorRate: row.error_rate,
      activeUsers: row.active_users,
      totalRequests: row.total_requests,
      failedRequests: row.failed_requests,
      timestamp: new Date(row.timestamp),
    }));
  } catch (error) {
    console.error("[Monitoring] Error fetching historical metrics:", error);
    return [];
  }
}

/**
 * Récupère les alertes récentes
 */
export async function getRecentAlerts(hours: number = 24): Promise<Alert[]> {
  const db = await getDb();
  if (!db) {
    return [];
  }

  try {
    const result = await db.execute(
      sql.raw(`
        SELECT * FROM alerts
        WHERE timestamp > DATE_SUB(NOW(), INTERVAL ${hours} HOUR)
        ORDER BY timestamp DESC
      `)
    );

    return ((result as any).rows || []).map((row: any) => ({
      type: row.type,
      severity: row.severity,
      message: row.message,
      timestamp: new Date(row.timestamp),
      resolved: Boolean(row.resolved),
    }));
  } catch (error) {
    console.error("[Monitoring] Error fetching alerts:", error);
    return [];
  }
}

