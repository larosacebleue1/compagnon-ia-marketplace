import { streamText } from 'ai';
import { z } from 'zod';
import { protectedProcedure, router } from '../_core/trpc';
import { selectModel, SYSTEM_PROMPTS } from '../ai/config';
import { TRPCError } from '@trpc/server';

/**
 * Router API Chat avec IA
 * 
 * Fonctionnalités :
 * - Streaming des réponses IA (temps réel)
 * - Multi-profils (Solitude, Professionnel, Artisan)
 * - Historique conversations
 * - Rate limiting
 * - Gestion erreurs
 */

export const chatRouter = router({
  /**
   * Envoyer un message et recevoir une réponse IA en streaming
   */
  sendMessage: protectedProcedure
    .input(
      z.object({
        message: z.string().min(1).max(5000),
        profileType: z.enum(['solitude', 'professionnel', 'artisan']),
        conversationId: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { message, profileType } = input;
      const userId = ctx.user.id;

      try {
        // Sélectionner le modèle IA
        const model = selectModel(profileType);
        
        // Récupérer le system prompt selon le profil
        const systemPrompt = SYSTEM_PROMPTS[profileType];

        // TODO: Récupérer l'historique de conversation depuis la DB
        // Pour l'instant, on fait une conversation simple sans historique
        
        // Générer la réponse IA avec streaming
        const result = await streamText({
          model,
          system: systemPrompt,
          messages: [
            {
              role: 'user',
              content: message,
            },
          ],
          temperature: 0.7,
        });

        // TODO: Sauvegarder le message utilisateur et la réponse IA dans la DB
        
        // Retourner le stream
        return result.toTextStreamResponse();
      } catch (error) {
        console.error('[Chat API] Erreur génération réponse:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erreur lors de la génération de la réponse. Veuillez réessayer.',
        });
      }
    }),

  /**
   * Récupérer l'historique d'une conversation
   */
  getConversation: protectedProcedure
    .input(
      z.object({
        conversationId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const userId = ctx.user.id;

      // TODO: Implémenter récupération historique depuis DB
      return {
        id: input.conversationId,
        messages: [],
      };
    }),

  /**
   * Créer une nouvelle conversation
   */
  createConversation: protectedProcedure
    .input(
      z.object({
        profileType: z.enum(['solitude', 'professionnel', 'artisan']),
        title: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.user.id;

      // TODO: Créer conversation dans DB
      const conversationId = `conv_${Date.now()}`;

      return {
        id: conversationId,
        profileType: input.profileType,
        title: input.title || 'Nouvelle conversation',
        createdAt: new Date(),
      };
    }),

  /**
   * Lister les conversations de l'utilisateur
   */
  listConversations: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;

    // TODO: Récupérer conversations depuis DB
    return [];
  }),
});

