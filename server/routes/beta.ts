/**
 * Beta Testers API Routes
 * 
 * Endpoints:
 * - POST /api/beta/invite - Create beta invitation (admin only)
 * - GET /api/beta/invitations - List all invitations (admin only)
 * - POST /api/beta/accept/:code - Accept invitation
 * - DELETE /api/beta/revoke/:id - Revoke invitation (admin only)
 * - POST /api/beta/feedback - Submit feedback
 * - GET /api/beta/feedback - Get all feedback (admin only)
 * - GET /api/beta/analytics - Get analytics (admin only)
 * - GET /api/beta/rewards - Get user rewards
 */

import { Router } from "express";
import betaService from "../beta";
import { getUserByOpenId } from "../db";

const router = Router();

// ============================================================================
// MIDDLEWARE
// ============================================================================

/**
 * Require admin role
 */
async function requireAdmin(req: any, res: any, next: any) {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const dbUser = await getUserByOpenId(user.openId);
    if (!dbUser || dbUser.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    req.dbUser = dbUser;
    next();
  } catch (error) {
    console.error("[Beta API] Admin check error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Require beta access
 */
async function requireBetaAccess(req: any, res: any, next: any) {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const dbUser = await getUserByOpenId(user.openId);
    if (!dbUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const hasBeta = await betaService.hasBetaAccess(dbUser.id);
    if (!hasBeta) {
      return res.status(403).json({ 
        error: "Beta access required",
        message: "This feature is in private beta. Request an invitation to access it."
      });
    }

    req.dbUser = dbUser;
    next();
  } catch (error) {
    console.error("[Beta API] Beta access check error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// ============================================================================
// INVITATIONS
// ============================================================================

/**
 * POST /api/beta/invite
 * Create a new beta invitation (admin only)
 */
router.post("/invite", requireAdmin, async (req, res) => {
  try {
    const {
      email,
      tier,
      source,
      notes,
      canInviteOthers,
      maxInvites,
      expiresInDays
    } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const invitation = await betaService.createBetaInvitation({
      email,
      invitedBy: (req as any).dbUser.email || undefined,
      tier,
      source,
      notes,
      canInviteOthers,
      maxInvites,
      expiresInDays
    });

    res.json({
      success: true,
      invitation
    });
  } catch (error: any) {
    console.error("[Beta API] Create invitation error:", error);
    res.status(400).json({ error: error.message || "Failed to create invitation" });
  }
});

/**
 * GET /api/beta/invitations
 * List all beta invitations (admin only)
 */
router.get("/invitations", requireAdmin, async (req, res) => {
  try {
    const { status, tier, limit } = req.query;

    const invitations = await betaService.getBetaInvitations({
      status: status as any,
      tier: tier as any,
      limit: limit ? parseInt(limit as string) : undefined
    });

    res.json({
      success: true,
      invitations,
      count: invitations.length
    });
  } catch (error) {
    console.error("[Beta API] Get invitations error:", error);
    res.status(500).json({ error: "Failed to get invitations" });
  }
});

/**
 * POST /api/beta/accept/:code
 * Accept a beta invitation
 */
router.post("/accept/:code", async (req, res) => {
  try {
    const { code } = req.params;
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const dbUser = await getUserByOpenId(user.openId);
    if (!dbUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const result = await betaService.acceptBetaInvitation({
      inviteCode: code,
      userId: dbUser.id
    });

    res.json(result);
  } catch (error: any) {
    console.error("[Beta API] Accept invitation error:", error);
    res.status(400).json({ error: error.message || "Failed to accept invitation" });
  }
});

/**
 * DELETE /api/beta/revoke/:id
 * Revoke a beta invitation (admin only)
 */
router.delete("/revoke/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await betaService.revokeBetaInvitation(parseInt(id));

    res.json({
      success: true,
      message: "Invitation revoked successfully"
    });
  } catch (error) {
    console.error("[Beta API] Revoke invitation error:", error);
    res.status(500).json({ error: "Failed to revoke invitation" });
  }
});

// ============================================================================
// FEEDBACK
// ============================================================================

/**
 * POST /api/beta/feedback
 * Submit beta feedback (requires beta access)
 */
router.post("/feedback", requireBetaAccess, async (req, res) => {
  try {
    const {
      type,
      message,
      screenshot,
      url,
      userAgent,
      viewport,
      sessionId
    } = req.body;

    if (!type || !message) {
      return res.status(400).json({ error: "Type and message are required" });
    }

    const result = await betaService.submitBetaFeedback({
      userId: (req as any).dbUser.id,
      type,
      message,
      screenshot,
      url,
      userAgent,
      viewport,
      sessionId
    });

    res.json(result);
  } catch (error) {
    console.error("[Beta API] Submit feedback error:", error);
    res.status(500).json({ error: "Failed to submit feedback" });
  }
});

/**
 * GET /api/beta/feedback
 * Get all beta feedback (admin only)
 */
router.get("/feedback", requireAdmin, async (req, res) => {
  try {
    const { type, status, limit } = req.query;

    const feedback = await betaService.getAllFeedback({
      type: type as any,
      status: status as any,
      limit: limit ? parseInt(limit as string) : undefined
    });

    res.json({
      success: true,
      feedback,
      count: feedback.length
    });
  } catch (error) {
    console.error("[Beta API] Get feedback error:", error);
    res.status(500).json({ error: "Failed to get feedback" });
  }
});

// ============================================================================
// REWARDS
// ============================================================================

/**
 * GET /api/beta/rewards
 * Get user rewards (requires beta access)
 */
router.get("/rewards", requireBetaAccess, async (req, res) => {
  try {
    const rewards = await betaService.getUserRewards((req as any).dbUser.id);

    res.json({
      success: true,
      rewards
    });
  } catch (error) {
    console.error("[Beta API] Get rewards error:", error);
    res.status(500).json({ error: "Failed to get rewards" });
  }
});

// ============================================================================
// ANALYTICS
// ============================================================================

/**
 * GET /api/beta/analytics
 * Get beta program analytics (admin only)
 */
router.get("/analytics", requireAdmin, async (req, res) => {
  try {
    const analytics = await betaService.getBetaAnalytics();

    res.json({
      success: true,
      analytics
    });
  } catch (error) {
    console.error("[Beta API] Get analytics error:", error);
    res.status(500).json({ error: "Failed to get analytics" });
  }
});

// ============================================================================
// ACTIVITY
// ============================================================================

/**
 * GET /api/beta/activity
 * Get user activity history (requires beta access)
 */
router.get("/activity", requireBetaAccess, async (req, res) => {
  try {
    const { limit } = req.query;

    const activity = await betaService.getUserActivity(
      (req as any).dbUser.id,
      limit ? parseInt(limit as string) : 50
    );

    res.json({
      success: true,
      activity,
      count: activity.length
    });
  } catch (error) {
    console.error("[Beta API] Get activity error:", error);
    res.status(500).json({ error: "Failed to get activity" });
  }
});

export default router;

