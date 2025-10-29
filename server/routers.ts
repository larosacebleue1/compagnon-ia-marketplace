import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { 
  createConversation,
  getUserConversations,
  getConversationMessages,
  createMessage,
  updateConversation
} from "./db";
import { invokeLLM } from "./_core/llm";
import { SYSTEM_PROMPTS } from "./ai/config";
import { userRouter } from "./api/user";
import { pvgisRouter } from "./api/pvgis";

export const appRouter = router({
  system: systemRouter,
  user: userRouter,
  pvgis: pvgisRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Router pour les conversations
  conversation: router({
    // Lister les conversations de l'utilisateur
    list: protectedProcedure.query(async ({ ctx }) => {
      return getUserConversations(ctx.user.id);
    }),

    // Créer une nouvelle conversation
    create: protectedProcedure
      .input(z.object({
        title: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return createConversation({
          userId: ctx.user.id,
          title: input.title || "Nouvelle conversation",
          profession: ctx.user.profession || undefined,
        });
      }),

    // Obtenir les messages d'une conversation
    getMessages: protectedProcedure
      .input(z.object({
        conversationId: z.number(),
      }))
      .query(async ({ input }) => {
        return getConversationMessages(input.conversationId);
      }),

    // Envoyer un message et obtenir une réponse
    sendMessage: protectedProcedure
      .input(z.object({
        conversationId: z.number(),
        content: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Sauvegarder le message de l'utilisateur
        const userMessage = await createMessage({
          conversationId: input.conversationId,
          role: "user",
          content: input.content,
        });

        // Récupérer l'historique de la conversation
        const history = await getConversationMessages(input.conversationId);
        
        // Construire le contexte pour l'IA
        const messages = history.map(msg => ({
          role: msg.role as "user" | "assistant" | "system",
          content: msg.content,
        }));

        // Récupérer le profil de l'utilisateur
        const userProfileType = ctx.user.profileType || 'professionnel';
        
        // Ajouter un message système si c'est la première interaction
        if (messages.length === 1) {
          const systemPrompt = SYSTEM_PROMPTS[userProfileType as keyof typeof SYSTEM_PROMPTS] || SYSTEM_PROMPTS.professionnel;
          messages.unshift({
            role: "system",
            content: systemPrompt
          });
        }

        // Appeler l'API IA
        const response = await invokeLLM({
          messages,
        });

        const rawContent = response.choices[0]?.message?.content;
        const assistantContent = typeof rawContent === 'string' ? rawContent : "Désolé, je n'ai pas pu générer de réponse.";

        // Sauvegarder la réponse de l'assistant
        const assistantMessage = await createMessage({
          conversationId: input.conversationId,
          role: "assistant",
          content: assistantContent,
        });

        // Mettre à jour la conversation (updatedAt)
        await updateConversation(input.conversationId, {});

        return {
          userMessage,
          assistantMessage,
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;

