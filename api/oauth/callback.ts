import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleOAuthCallback } from '../../server/_core/oauth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await handleOAuthCallback(req as any, res as any);
  } catch (error) {
    console.error('[OAuth] Callback error:', error);
    res.status(500).json({ error: 'OAuth callback failed' });
  }
}

