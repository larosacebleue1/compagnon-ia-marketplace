/**
 * Beta Testers Management System
 * 
 * Handles:
 * - Beta invitations (create, list, accept, revoke)
 * - User permissions (grant, revoke, check)
 * - Feedback collection
 * - Activity tracking
 * - Rewards and gamification
 */

import { getDb } from "./db";
import { 
  betaInvitations, 
  userPermissions, 
  betaFeedback, 
  betaActivity, 
  betaRewards,
  users 
} from "../drizzle/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import crypto from "crypto";

// ============================================================================
// TYPES
// ============================================================================

export interface CreateInvitationParams {
  email: string;
  invitedBy?: string;
  tier?: "alpha" | "beta" | "early_access";
  source?: string;
  notes?: string;
  canInviteOthers?: boolean;
  maxInvites?: number;
  expiresInDays?: number;
}

export interface AcceptInvitationParams {
  inviteCode: string;
  userId: number;
}

export interface SubmitFeedbackParams {
  userId: number;
  type: "bug" | "suggestion" | "praise" | "question";
  message: string;
  screenshot?: string;
  url?: string;
  userAgent?: string;
  viewport?: string;
  sessionId?: string;
}

export interface TrackActivityParams {
  userId: number;
  activityType: string;
  details?: any;
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Generate a unique beta invitation code
 * Format: BETA-XXXX-XXXX-XXXX
 */
function generateInviteCode(): string {
  const segments = [];
  for (let i = 0; i < 3; i++) {
    const segment = crypto.randomBytes(2).toString('hex').toUpperCase();
    segments.push(segment);
  }
  return `BETA-${segments.join('-')}`;
}

/**
 * Calculate expiration date from days
 */
function calculateExpirationDate(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

// ============================================================================
// INVITATIONS
// ============================================================================

/**
 * Create a new beta invitation
 */
export async function createBetaInvitation(params: CreateInvitationParams) {
  const {
    email,
    invitedBy,
    tier = "beta",
    source = "manual",
    notes,
    canInviteOthers = false,
    maxInvites = 0,
    expiresInDays = 7
  } = params;

  // Check if email already has an invitation
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await db
    .select()
    .from(betaInvitations)
    .where(eq(betaInvitations.email, email))
    .limit(1);

  if (existing.length > 0) {
    throw new Error(`Invitation already exists for ${email}`);
  }

  // Generate unique invite code
  let inviteCode = generateInviteCode();
  let codeExists = true;
  
  // Ensure code is unique
  while (codeExists) {
    const check = await db
      .select()
      .from(betaInvitations)
      .where(eq(betaInvitations.inviteCode, inviteCode))
      .limit(1);
    
    if (check.length === 0) {
      codeExists = false;
    } else {
      inviteCode = generateInviteCode();
    }
  }

  // Calculate expiration
  const expiresAt = calculateExpirationDate(expiresInDays);

  // Create invitation
  const [invitation] = await db.insert(betaInvitations).values({
    email,
    inviteCode,
    invitedBy,
    tier,
    source,
    notes,
    canInviteOthers,
    maxInvites,
    expiresAt
  });

  return {
    id: invitation.insertId,
    email,
    inviteCode,
    tier,
    expiresAt
  };
}

/**
 * Get all beta invitations (with filters)
 */
export async function getBetaInvitations(filters?: {
  status?: "pending" | "accepted" | "revoked";
  tier?: "alpha" | "beta" | "early_access";
  limit?: number;
}) {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(betaInvitations);

  if (filters?.status) {
    query = query.where(eq(betaInvitations.status, filters.status)) as any;
  }

  if (filters?.tier) {
    query = query.where(eq(betaInvitations.tier, filters.tier)) as any;
  }

  query = query.orderBy(desc(betaInvitations.createdAt)) as any;

  if (filters?.limit) {
    query = query.limit(filters.limit) as any;
  }

  return await query;
}

/**
 * Accept a beta invitation
 */
export async function acceptBetaInvitation(params: AcceptInvitationParams) {
  const { inviteCode, userId } = params;

  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Find invitation
  const [invitation] = await db
    .select()
    .from(betaInvitations)
    .where(eq(betaInvitations.inviteCode, inviteCode))
    .limit(1);

  if (!invitation) {
    throw new Error("Invalid invitation code");
  }

  if (invitation.status !== "pending") {
    throw new Error(`Invitation already ${invitation.status}`);
  }

  if (invitation.expiresAt && new Date(invitation.expiresAt) < new Date()) {
    throw new Error("Invitation has expired");
  }

  // Update invitation status
  await db
    .update(betaInvitations)
    .set({
      status: "accepted",
      acceptedAt: new Date(),
      firstLoginAt: new Date(),
      lastActiveAt: new Date(),
      sessionsCount: 1
    })
    .where(eq(betaInvitations.inviteCode, inviteCode));

  // Grant beta permissions to user
  const permissionKey = invitation.tier === "alpha" ? "alpha_tester" : "beta_tester";
  
  await db.insert(userPermissions).values({
    userId,
    permissionKey,
    grantedBy: invitation.invitedBy || "system"
  });

  // Initialize rewards for user
  await db.insert(betaRewards).values({
    userId,
    totalPoints: 100, // Signup bonus
    badges: JSON.stringify([]),
    rewardsClaimed: JSON.stringify([])
  });

  // Track activity
  await trackBetaActivity({
    userId,
    activityType: "signup",
    details: { tier: invitation.tier, inviteCode }
  });

  return {
    success: true,
    tier: invitation.tier,
    permissions: [permissionKey]
  };
}

/**
 * Revoke a beta invitation
 */
export async function revokeBetaInvitation(invitationId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db
    .update(betaInvitations)
    .set({ status: "revoked" })
    .where(eq(betaInvitations.id, invitationId));

  return { success: true };
}

// ============================================================================
// PERMISSIONS
// ============================================================================

/**
 * Check if user has beta access
 */
export async function hasBetaAccess(userId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  
  const permissions = await db
    .select()
    .from(userPermissions)
    .where(
      and(
        eq(userPermissions.userId, userId),
        sql`${userPermissions.permissionKey} IN ('alpha_tester', 'beta_tester', 'early_access')`
      )
    )
    .limit(1);

  if (permissions.length === 0) return false;

  const permission = permissions[0];
  
  // Check expiration
  if (permission.expiresAt && new Date(permission.expiresAt) < new Date()) {
    return false;
  }

  return true;
}

/**
 * Check if user has specific permission
 */
export async function hasPermission(userId: number, permissionKey: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  
  const permissions = await db
    .select()
    .from(userPermissions)
    .where(
      and(
        eq(userPermissions.userId, userId),
        eq(userPermissions.permissionKey, permissionKey)
      )
    )
    .limit(1);

  if (permissions.length === 0) return false;

  const permission = permissions[0];
  
  // Check expiration
  if (permission.expiresAt && new Date(permission.expiresAt) < new Date()) {
    return false;
  }

  return true;
}

/**
 * Grant permission to user
 */
export async function grantPermission(
  userId: number, 
  permissionKey: string, 
  grantedBy?: string,
  expiresInDays?: number
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const expiresAt = expiresInDays ? calculateExpirationDate(expiresInDays) : undefined;

  await db.insert(userPermissions).values({
    userId,
    permissionKey,
    grantedBy,
    expiresAt
  });

  return { success: true };
}

/**
 * Revoke permission from user
 */
export async function revokePermission(userId: number, permissionKey: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db
    .delete(userPermissions)
    .where(
      and(
        eq(userPermissions.userId, userId),
        eq(userPermissions.permissionKey, permissionKey)
      )
    );

  return { success: true };
}

// ============================================================================
// FEEDBACK
// ============================================================================

/**
 * Submit beta feedback
 */
export async function submitBetaFeedback(params: SubmitFeedbackParams) {
  const {
    userId,
    type,
    message,
    screenshot,
    url,
    userAgent,
    viewport,
    sessionId
  } = params;

  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(betaFeedback).values({
    userId,
    type,
    message,
    screenshot,
    url,
    userAgent,
    viewport,
    sessionId
  });

  // Award points for feedback
  await awardPoints(userId, type === "bug" ? 150 : 75);

  // Track activity
  await trackBetaActivity({
    userId,
    activityType: "feedback_submitted",
    details: { type, hasScreenshot: !!screenshot }
  });

  // Update invitation feedback flag
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (user) {
    await db
      .update(betaInvitations)
      .set({ feedbackSubmitted: true })
      .where(eq(betaInvitations.email, user.email || ""));
  }

  return { success: true, pointsAwarded: type === "bug" ? 150 : 75 };
}

/**
 * Get all feedback (for admin)
 */
export async function getAllFeedback(filters?: {
  type?: "bug" | "suggestion" | "praise" | "question";
  status?: "new" | "in_progress" | "resolved" | "closed";
  limit?: number;
}) {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(betaFeedback);

  if (filters?.type) {
    query = query.where(eq(betaFeedback.type, filters.type)) as any;
  }

  if (filters?.status) {
    query = query.where(eq(betaFeedback.status, filters.status)) as any;
  }

  query = query.orderBy(desc(betaFeedback.createdAt)) as any;

  if (filters?.limit) {
    query = query.limit(filters.limit) as any;
  }

  return await query;
}

// ============================================================================
// ACTIVITY TRACKING
// ============================================================================

/**
 * Track beta tester activity
 */
export async function trackBetaActivity(params: TrackActivityParams) {
  const { userId, activityType, details } = params;

  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(betaActivity).values({
    userId,
    activityType,
    details: details ? JSON.stringify(details) : undefined
  });

  // Update last active timestamp in invitation
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (user && user.email) {
    await db
      .update(betaInvitations)
      .set({ 
        lastActiveAt: new Date(),
        sessionsCount: sql`${betaInvitations.sessionsCount} + 1`
      })
      .where(eq(betaInvitations.email, user.email));
  }

  return { success: true };
}

/**
 * Get user activity history
 */
export async function getUserActivity(userId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(betaActivity)
    .where(eq(betaActivity.userId, userId))
    .orderBy(desc(betaActivity.timestamp))
    .limit(limit);
}

// ============================================================================
// REWARDS & GAMIFICATION
// ============================================================================

/**
 * Award points to a beta tester
 */
export async function awardPoints(userId: number, points: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Get current rewards
  const [currentRewards] = await db
    .select()
    .from(betaRewards)
    .where(eq(betaRewards.userId, userId))
    .limit(1);

  if (!currentRewards) {
    // Initialize if doesn't exist
    await db.insert(betaRewards).values({
      userId,
      totalPoints: points,
      badges: JSON.stringify([]),
      rewardsClaimed: JSON.stringify([])
    });
    return { success: true, totalPoints: points, newBadges: [] };
  }

  const newTotal = currentRewards.totalPoints + points;
  const currentBadges = JSON.parse(currentRewards.badges || "[]");
  const newBadges: string[] = [];

  // Check for badge unlocks
  if (newTotal >= 500 && !currentBadges.includes("bronze")) {
    currentBadges.push("bronze");
    newBadges.push("bronze");
  }
  if (newTotal >= 1500 && !currentBadges.includes("silver")) {
    currentBadges.push("silver");
    newBadges.push("silver");
  }
  if (newTotal >= 3000 && !currentBadges.includes("gold")) {
    currentBadges.push("gold");
    newBadges.push("gold");
  }
  if (newTotal >= 5000 && !currentBadges.includes("platinum")) {
    currentBadges.push("platinum");
    newBadges.push("platinum");
  }

  // Update rewards
  await db
    .update(betaRewards)
    .set({
      totalPoints: newTotal,
      badges: JSON.stringify(currentBadges)
    })
    .where(eq(betaRewards.userId, userId));

  return { success: true, totalPoints: newTotal, newBadges };
}

/**
 * Get user rewards
 */
export async function getUserRewards(userId: number) {
  const db = await getDb();
  if (!db) return {
    totalPoints: 0,
    badges: [],
    rewardsClaimed: [],
    referralCount: 0,
    activeReferrals: 0
  };
  
  const [rewards] = await db
    .select()
    .from(betaRewards)
    .where(eq(betaRewards.userId, userId))
    .limit(1);

  if (!rewards) {
    return {
      totalPoints: 0,
      badges: [],
      rewardsClaimed: [],
      referralCount: 0,
      activeReferrals: 0
    };
  }

  return {
    totalPoints: rewards.totalPoints,
    badges: JSON.parse(rewards.badges || "[]"),
    rewardsClaimed: JSON.parse(rewards.rewardsClaimed || "[]"),
    referralCount: rewards.referralCount,
    activeReferrals: rewards.activeReferrals
  };
}

// ============================================================================
// ANALYTICS
// ============================================================================

/**
 * Get beta program analytics
 */
export async function getBetaAnalytics() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Total invitations by status
  const invitationStats = await db
    .select({
      status: betaInvitations.status,
      count: sql<number>`count(*)`
    })
    .from(betaInvitations)
    .groupBy(betaInvitations.status);

  // Total invitations by tier
  const tierStats = await db
    .select({
      tier: betaInvitations.tier,
      count: sql<number>`count(*)`
    })
    .from(betaInvitations)
    .groupBy(betaInvitations.tier);

  // Feedback stats
  const feedbackStats = await db
    .select({
      type: betaFeedback.type,
      count: sql<number>`count(*)`
    })
    .from(betaFeedback)
    .groupBy(betaFeedback.type);

  // Active testers (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const [activeTesters] = await db
    .select({
      count: sql<number>`count(*)`
    })
    .from(betaInvitations)
    .where(
      and(
        eq(betaInvitations.status, "accepted"),
        sql`${betaInvitations.lastActiveAt} >= ${sevenDaysAgo}`
      )
    );

  // Average sessions per tester
  const [avgSessions] = await db
    .select({
      avg: sql<number>`avg(${betaInvitations.sessionsCount})`
    })
    .from(betaInvitations)
    .where(eq(betaInvitations.status, "accepted"));

  return {
    invitations: {
      byStatus: invitationStats,
      byTier: tierStats
    },
    feedback: {
      byType: feedbackStats
    },
    engagement: {
      activeTesters: activeTesters.count || 0,
      avgSessionsPerTester: Math.round(avgSessions.avg || 0)
    }
  };
}

export default {
  // Invitations
  createBetaInvitation,
  getBetaInvitations,
  acceptBetaInvitation,
  revokeBetaInvitation,
  
  // Permissions
  hasBetaAccess,
  hasPermission,
  grantPermission,
  revokePermission,
  
  // Feedback
  submitBetaFeedback,
  getAllFeedback,
  
  // Activity
  trackBetaActivity,
  getUserActivity,
  
  // Rewards
  awardPoints,
  getUserRewards,
  
  // Analytics
  getBetaAnalytics
};

