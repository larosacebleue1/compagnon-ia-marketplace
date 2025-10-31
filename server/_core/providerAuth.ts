/**
 * MIDDLEWARE AUTHENTIFICATION PROVIDERS
 * 
 * Système d'authentification centralisé pour les installateurs
 * qui accèdent à la marketplace ORIASOL
 */

import { TRPCError } from '@trpc/server';
import jwt from 'jsonwebtoken';
import { publicProcedure } from './trpc';
import { getDb } from '../db';
import { providers } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';
import { ENV } from './env';

/**
 * Interface du provider décodé depuis le JWT
 */
interface ProviderJWT {
  providerId: number;
  email: string;
  companyName: string;
}

/**
 * Interface du contexte étendu avec les infos provider
 */
export interface ProviderContext {
  provider: {
    id: number;
    email: string;
    companyName: string;
    status: string;
  };
}

/**
 * MIDDLEWARE: Vérification authentification provider
 * 
 * Vérifie le token JWT dans les headers Authorization
 * et injecte les infos du provider dans le contexte
 */
export const providerProcedure = publicProcedure.use(async ({ ctx, next }) => {
  // 1. Récupérer le token depuis les headers
  const authHeader = ctx.req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Token d\'authentification manquant. Veuillez vous connecter.',
    });
  }
  
  const token = authHeader.replace('Bearer ', '');
  
  try {
    // 2. Vérifier et décoder le token JWT
    const decoded = jwt.verify(token, ENV.cookieSecret) as ProviderJWT;
    
    // 3. Récupérer les infos complètes du provider depuis la BDD
    const db = await getDb();
    if (!db) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Base de données non disponible',
      });
    }
    
    const [provider] = await db
      .select()
      .from(providers)
      .where(eq(providers.id, decoded.providerId))
      .limit(1);
    
    if (!provider) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Compte installateur non trouvé',
      });
    }
    
    // 4. Vérifier que le provider est actif
    if (provider.status !== 'active') {
      if (provider.status === 'pending') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Votre compte est en attente de validation. Nous vous contacterons sous 48h.',
        });
      } else if (provider.status === 'suspended') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Votre compte a été suspendu. Contactez-nous pour plus d\'informations.',
        });
      } else if (provider.status === 'rejected') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Votre demande d\'inscription a été refusée.',
        });
      } else {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Votre compte n\'est pas actif.',
        });
      }
    }
    
    // 5. Injecter les infos du provider dans le contexte
    return next({
      ctx: {
        ...ctx,
        provider: {
          id: provider.id,
          email: provider.contactEmail,
          companyName: provider.companyName,
          status: provider.status,
        },
      },
    });
    
  } catch (error) {
    // Erreur de vérification du token
    if (error instanceof jwt.JsonWebTokenError) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Token invalide. Veuillez vous reconnecter.',
      });
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Votre session a expiré. Veuillez vous reconnecter.',
      });
    }
    
    // Autres erreurs (TRPCError déjà lancées)
    throw error;
  }
});

