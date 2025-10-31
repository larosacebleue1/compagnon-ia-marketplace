/**
 * API PAIEMENT STRIPE - COMMISSIONS MARKETPLACE
 * 
 * Gestion des paiements de commissions 6% pour l'achat de leads
 */

import { router } from '../_core/trpc';
import { providerProcedure } from '../_core/providerAuth';
import { z } from 'zod';
import Stripe from 'stripe';
import { getDb } from '../db';
import { leads, leadReservations, commissions, providers } from '../../drizzle/schema';
import { eq, and, sql } from 'drizzle-orm';

// Initialiser Stripe avec la clé secrète
// TODO: Ajouter STRIPE_SECRET_KEY dans les variables d'environnement
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_...', {
  apiVersion: '2025-10-29.clover',
});

export const stripePaymentRouter = router({
  /**
   * CRÉER UN PAYMENT INTENT
   * 
   * Génère un PaymentIntent Stripe pour payer la commission d'un lead
   */
  createPaymentIntent: providerProcedure
    .input(z.object({
      leadId: z.number(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');
      
      const providerId = ctx.provider.id;
      
      // 1. Vérifier que le lead existe et est réservé par ce provider
      const [lead] = await db
        .select()
        .from(leads)
        .where(eq(leads.id, input.leadId))
        .limit(1);
      
      if (!lead) {
        throw new Error('Lead non trouvé');
      }
      
      if (lead.status !== 'reserved') {
        throw new Error('Ce lead n\'est pas réservé');
      }
      
      if (lead.reservedBy !== providerId) {
        throw new Error('Ce lead n\'est pas réservé par vous');
      }
      
      // 2. Vérifier que la réservation est encore valide (pas expirée)
      if (lead.reservedUntil && new Date() > new Date(lead.reservedUntil)) {
        throw new Error('Votre réservation a expiré');
      }
      
      // 3. Calculer le montant de la commission (déjà calculé dans lead.commissionAmount)
      const commissionAmount = parseFloat(lead.commissionAmount as string);
      
      if (!commissionAmount || commissionAmount <= 0) {
        throw new Error('Montant de commission invalide');
      }
      
      // 4. Créer le PaymentIntent Stripe
      // Montant en centimes (Stripe utilise les plus petites unités)
      const amountInCents = Math.round(commissionAmount * 100);
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: 'eur',
        metadata: {
          leadId: input.leadId.toString(),
          providerId: providerId.toString(),
          providerCompany: ctx.provider.companyName,
          providerEmail: ctx.provider.email,
        },
        description: `Commission ORIASOL - Lead #${input.leadId}`,
        // Activer la confirmation automatique
        automatic_payment_methods: {
          enabled: true,
        },
      });
      
      return {
        clientSecret: paymentIntent.client_secret,
        amount: commissionAmount,
        leadId: input.leadId,
      };
    }),
  
  /**
   * CONFIRMER LE PAIEMENT
   * 
   * Appelé après le paiement réussi pour mettre à jour le statut du lead
   * et créer l'enregistrement de commission
   */
  confirmPayment: providerProcedure
    .input(z.object({
      leadId: z.number(),
      paymentIntentId: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');
      
      const providerId = ctx.provider.id;
      
      // 1. Vérifier le PaymentIntent auprès de Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(input.paymentIntentId);
      
      if (paymentIntent.status !== 'succeeded') {
        throw new Error('Le paiement n\'a pas été confirmé par Stripe');
      }
      
      // 2. Vérifier que le lead correspond
      const leadIdFromStripe = parseInt(paymentIntent.metadata.leadId || '0');
      if (leadIdFromStripe !== input.leadId) {
        throw new Error('Le lead ne correspond pas au paiement');
      }
      
      // 3. Récupérer le lead
      const [lead] = await db
        .select()
        .from(leads)
        .where(eq(leads.id, input.leadId))
        .limit(1);
      
      if (!lead) {
        throw new Error('Lead non trouvé');
      }
      
      if (lead.reservedBy !== providerId) {
        throw new Error('Ce lead n\'est pas réservé par vous');
      }
      
      // 4. Mettre à jour le statut du lead → "paid"
      await db.update(leads)
        .set({
          status: 'paid',
          convertedBy: providerId,
          convertedAt: new Date(),
        })
        .where(eq(leads.id, input.leadId));
      
      // 5. Créer l'enregistrement de commission
      const commissionAmount = parseFloat(lead.commissionAmount as string);
      
      await db.insert(commissions).values({
        leadId: input.leadId,
        providerId: providerId,
        serviceId: lead.serviceId,
        amount: commissionAmount.toString(),
        status: 'paid',
        paidAt: new Date(),
        paymentMethod: 'stripe',
        paymentIntentId: input.paymentIntentId,
      });
      
      // 6. Mettre à jour les stats du provider
      await db.update(providers)
        .set({
          leadsConverted: sql`${providers.leadsConverted} + 1`,
          totalSpent: sql`${providers.totalSpent} + ${commissionAmount}`,
        })
        .where(eq(providers.id, providerId));
      
      // 7. Désactiver la réservation
      await db.update(leadReservations)
        .set({
          isActive: false,
        })
        .where(and(
          eq(leadReservations.leadId, input.leadId),
          eq(leadReservations.providerId, providerId)
        ));
      
      return {
        success: true,
        message: 'Paiement confirmé ! Vous pouvez maintenant contacter le client.',
        lead: {
          id: lead.id,
          clientFirstName: lead.clientFirstName,
          clientLastName: lead.clientLastName,
          clientEmail: lead.clientEmail,
          clientPhone: lead.clientPhone,
          clientAddress: lead.clientAddress,
          clientCity: lead.clientCity,
          clientPostalCode: lead.clientPostalCode,
        },
      };
    }),
  
  /**
   * RÉCUPÉRER LES INFOS D'UN LEAD ACHETÉ
   * 
   * Permet de voir les coordonnées complètes d'un lead déjà payé
   */
  getPurchasedLead: providerProcedure
    .input(z.object({
      leadId: z.number(),
    }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');
      
      const providerId = ctx.provider.id;
      
      // Vérifier que le lead a été acheté par ce provider
      const [lead] = await db
        .select()
        .from(leads)
        .where(and(
          eq(leads.id, input.leadId),
          eq(leads.convertedBy, providerId),
          eq(leads.status, 'paid')
        ))
        .limit(1);
      
      if (!lead) {
        throw new Error('Lead non trouvé ou non acheté par vous');
      }
      
      return {
        id: lead.id,
        serviceId: lead.serviceId,
        serviceData: lead.serviceData,
        estimatedAmount: lead.estimatedAmount,
        commissionAmount: lead.commissionAmount,
        clientFirstName: lead.clientFirstName,
        clientLastName: lead.clientLastName,
        clientEmail: lead.clientEmail,
        clientPhone: lead.clientPhone,
        clientAddress: lead.clientAddress,
        clientCity: lead.clientCity,
        clientPostalCode: lead.clientPostalCode,
        createdAt: lead.createdAt,
        convertedAt: lead.convertedAt,
      };
    }),
});

