/**
 * API AUTHENTIFICATION INSTALLATEURS
 * 
 * Système login/password indépendant pour les installateurs
 * qui accèdent à la marketplace ORIASOL
 */

import { router, publicProcedure } from '../_core/trpc';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getDb } from '../db';
import { providers } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';
import { ENV } from '../_core/env';

// Durée validité token : 30 jours
const TOKEN_EXPIRY = '30d';

export const providersAuthRouter = router({
  /**
   * LOGIN INSTALLATEUR
   * POST /api/providers/login
   */
  login: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');
      
      // Trouver le provider par email
      const [provider] = await db
        .select()
        .from(providers)
        .where(eq(providers.contactEmail, input.email))
        .limit(1);
      
      if (!provider) {
        throw new Error('Email ou mot de passe incorrect');
      }
      
      // Vérifier le mot de passe
      const passwordMatch = await bcrypt.compare(input.password, provider.passwordHash);
      
      if (!passwordMatch) {
        throw new Error('Email ou mot de passe incorrect');
      }
      
      // Vérifier que le provider est actif
      if (provider.status !== 'active') {
        if (provider.status === 'pending') {
          throw new Error('Votre compte est en attente de validation. Nous vous contacterons sous 48h.');
        } else if (provider.status === 'suspended') {
          throw new Error('Votre compte a été suspendu. Contactez-nous pour plus d\'informations.');
        } else if (provider.status === 'rejected') {
          throw new Error('Votre demande d\'inscription a été refusée.');
        } else {
          throw new Error('Votre compte n\'est pas actif.');
        }
      }
      
      // Générer le token JWT
      const token = jwt.sign(
        {
          providerId: provider.id,
          email: provider.contactEmail,
          companyName: provider.companyName,
        },
        ENV.cookieSecret,
        { expiresIn: TOKEN_EXPIRY }
      );
      
      return {
        success: true,
        token,
        provider: {
          id: provider.id,
          companyName: provider.companyName,
          email: provider.contactEmail,
          status: provider.status,
        },
      };
    }),
  
  /**
   * GET PROVIDER INFO (current logged in)
   * GET /api/providers/me
   */
  me: publicProcedure
    .input(z.object({
      token: z.string(),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');
      
      try {
        // Vérifier et décoder le token
        const decoded = jwt.verify(input.token, ENV.cookieSecret) as {
          providerId: number;
          email: string;
          companyName: string;
        };
        
        // Récupérer les infos du provider
        const [provider] = await db
          .select()
          .from(providers)
          .where(eq(providers.id, decoded.providerId))
          .limit(1);
        
        if (!provider) {
          throw new Error('Provider not found');
        }
        
        // Retourner les infos (sans le passwordHash)
        return {
          id: provider.id,
          companyName: provider.companyName,
          contactName: provider.contactName,
          contactEmail: provider.contactEmail,
          contactPhone: provider.contactPhone,
          status: provider.status,
          leadsReceived: provider.leadsReceived,
          leadsConverted: provider.leadsConverted,
          totalSpent: provider.totalSpent,
          rating: provider.rating,
          reviewCount: provider.reviewCount,
          createdAt: provider.createdAt,
        };
      } catch (error) {
        throw new Error('Token invalide ou expiré');
      }
    }),
  
  /**
   * VERIFY TOKEN
   * Vérifie si un token est valide
   */
  verifyToken: publicProcedure
    .input(z.object({
      token: z.string(),
    }))
    .query(async ({ input }) => {
      try {
        const decoded = jwt.verify(input.token, ENV.cookieSecret) as {
          providerId: number;
          email: string;
          companyName: string;
        };
        
        return {
          valid: true,
          providerId: decoded.providerId,
          email: decoded.email,
          companyName: decoded.companyName,
        };
      } catch (error) {
        return {
          valid: false,
        };
      }
    }),
});

