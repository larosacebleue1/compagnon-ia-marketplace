import { z } from 'zod';
import { protectedProcedure, router } from '../_core/trpc';
import { getDb } from '../db';
import { users } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

/**
 * Router API User
 */

export const userRouter = router({
  /**
   * Mettre à jour le profil utilisateur
   */
  updateProfile: protectedProcedure
    .input(
      z.object({
        profileType: z.enum(['solitude', 'professionnel', 'artisan']),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.user.id;

      // Mettre à jour le profileType dans la base de données
      const db = await getDb();
      if (!db) {
        throw new Error('Database not available');
      }
      
      await db
        .update(users)
        .set({ profileType: input.profileType })
        .where(eq(users.id, userId));

      return {
        success: true,
        profileType: input.profileType,
      };
    }),
});

