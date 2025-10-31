/**
 * API UNIVERSELLE - SERVICE MISE EN RELATION
 * 
 * CRUD complet pour tous secteurs d'activité
 * Architecture générique extensible
 */

import { router, publicProcedure, protectedProcedure } from '../_core/trpc';
import { providerProcedure } from '../_core/providerAuth';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { getDb } from '../db';
import { services, providers, leads, leadReservations, commissions, leadHistory } from '../../drizzle/schema';
import { eq, and, sql, desc, inArray } from 'drizzle-orm';

export const leadsRouter = router({
  
  // ============================================================================
  // SERVICES (Secteurs d'activité)
  // ============================================================================
  
  /**
   * Lister tous les services actifs
   */
  listServices: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error('Database not available');
    
    return await db
      .select()
      .from(services)
      .where(eq(services.isActive, true))
      .orderBy(services.category, services.name);
  }),
  
  /**
   * Obtenir un service par slug
   */
  getService: publicProcedure
    .input(z.object({
      slug: z.string(),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');
      
      const [service] = await db
        .select()
        .from(services)
        .where(and(
          eq(services.slug, input.slug),
          eq(services.isActive, true)
        ))
        .limit(1);
      
      if (!service) {
        throw new Error('Service non trouvé');
      }
      
      return service;
    }),
  
  // ============================================================================
  // LEADS (Demandes clients)
  // ============================================================================
  
  /**
   * Créer un lead (appelé par formulaire client)
   */
  createLead: publicProcedure
    .input(z.object({
      serviceId: z.number(),
      clientFirstName: z.string().min(2),
      clientLastName: z.string().min(2),
      clientEmail: z.string().email(),
      clientPhone: z.string().min(10),
      clientAddress: z.string().optional(),
      clientCity: z.string(),
      clientPostalCode: z.string(),
      serviceData: z.record(z.string(), z.any()),
      estimatedAmount: z.string().optional(),
      commissionAmount: z.string(),
      acceptedTerms: z.boolean(),
      acceptedContact: z.boolean(),
      sourceUrl: z.string().optional(),
      sourceModule: z.string().optional(),
      // Nouveaux champs parcours
      chosenPath: z.enum(['standard', 'express']).optional().default('standard'),
      depositAmount: z.string().optional(),
      waiverSigned: z.boolean().optional().default(false),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');
      
      // Générer token unique pour accès dashboard
      const accessToken = Array.from({ length: 32 }, () => 
        Math.random().toString(36).charAt(2)
      ).join('');
      
      // Créer le lead
      const result = await db
        .insert(leads)
        .values({
          serviceId: input.serviceId,
          clientFirstName: input.clientFirstName,
          clientLastName: input.clientLastName,
          clientEmail: input.clientEmail,
          clientPhone: input.clientPhone,
          clientAddress: input.clientAddress,
          clientCity: input.clientCity,
          clientPostalCode: input.clientPostalCode,
          serviceData: input.serviceData,
          estimatedAmount: input.estimatedAmount,
          commissionAmount: input.commissionAmount,
          acceptedTerms: input.acceptedTerms,
          acceptedContact: input.acceptedContact,
          sourceUrl: input.sourceUrl,
          sourceModule: input.sourceModule,
          status: 'pending',
          // Nouveaux champs parcours
          chosenPath: input.chosenPath,
          depositAmount: input.depositAmount,
          waiverSigned: input.waiverSigned,
          waiverSignedAt: input.waiverSigned ? new Date() : null,
          coolingOffEndsAt: input.chosenPath === 'standard' ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) : null, // +14 jours si standard
          accessToken,
        });
      
      const leadId = Number(result[0].insertId);
      
      // Historique
      await db.insert(leadHistory).values({
        leadId,
        fromStatus: null,
        toStatus: 'pending',
        changedBy: null,
        reason: 'Lead créé',
      });
      
      // TODO: Notifier prestataires de la zone
      
      return { success: true, leadId, accessToken };
    }),
  
  /**
   * Obtenir un lead par token (dashboard client)
   */
  getLeadByToken: publicProcedure
    .input(z.object({
      token: z.string(),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');
      
      const [lead] = await db
        .select()
        .from(leads)
        .where(eq(leads.accessToken, input.token))
        .limit(1);
      
      if (!lead) {
        throw new Error('Lead non trouvé ou token invalide');
      }
      
      // Récupérer le service
      const [service] = await db
        .select()
        .from(services)
        .where(eq(services.id, lead.serviceId))
        .limit(1);
      
      // Récupérer le prestataire si assigné
      let provider = null;
      if (lead.reservedBy) {
        [provider] = await db
          .select()
          .from(providers)
          .where(eq(providers.id, lead.reservedBy))
          .limit(1);
      }
      
      return {
        lead,
        service,
        provider,
      };
    }),
  
  /**
   * Lister les leads disponibles (marketplace prestataires)
   */
  listAvailableLeads: protectedProcedure
    .input(z.object({
      serviceIds: z.array(z.number()).optional(),
      postalCodes: z.array(z.string()).optional(),
      limit: z.number().default(20),
      offset: z.number().default(0),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');
      
      let conditions = [eq(leads.status, 'available')];
      
      if (input.serviceIds && input.serviceIds.length > 0) {
        conditions.push(inArray(leads.serviceId, input.serviceIds));
      }
      
      if (input.postalCodes && input.postalCodes.length > 0) {
        conditions.push(inArray(leads.clientPostalCode, input.postalCodes));
      }
      
      return await db
        .select()
        .from(leads)
        .where(and(...conditions))
        .orderBy(desc(leads.createdAt))
        .limit(input.limit)
        .offset(input.offset);
    }),
  
  /**
   * Obtenir un lead par ID (avec vérification accès)
   */
  getLead: protectedProcedure
    .input(z.object({
      leadId: z.number(),
    }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');
      
      const [lead] = await db
        .select()
        .from(leads)
        .where(eq(leads.id, input.leadId))
        .limit(1);
      
      if (!lead) {
        throw new Error('Lead non trouvé');
      }
      
      // Vérifier que le prestataire a accès (réservé ou acheté)
      // TODO: Implémenter vérification accès
      
      return lead;
    }),
  
  // ============================================================================
  // RÉSERVATIONS
  // ============================================================================
  
  /**
   * Réserver un lead (48h exclusivité)
   */
  reserveLead: providerProcedure
    .input(z.object({
      leadId: z.number(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');
      
      // Récupérer le providerId depuis le contexte (injecté par providerProcedure)
      const providerId = ctx.provider.id;
      
      // Vérifier que le lead est disponible
      const [lead] = await db
        .select()
        .from(leads)
        .where(eq(leads.id, input.leadId))
        .limit(1);
      
      if (!lead) {
        throw new Error('Lead non trouvé');
      }
      
      if (lead.status !== 'available') {
        throw new Error('Lead non disponible');
      }
      
      // Récupérer le service pour la durée de réservation
      const [service] = await db
        .select()
        .from(services)
        .where(eq(services.id, lead.serviceId))
        .limit(1);
      
      const reservationDuration = service?.reservationDuration || 48;
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + reservationDuration);
      
      // Créer la réservation
      await db.insert(leadReservations).values({
        leadId: input.leadId,
        providerId: providerId,
        expiresAt,
        isActive: true,
      });
      
      // Mettre à jour le lead
      await db.update(leads)
        .set({
          status: 'reserved',
          reservedBy: providerId,
          reservedAt: new Date(),
          reservedUntil: expiresAt,
        })
        .where(eq(leads.id, input.leadId));
      
      // Historique
      await db.insert(leadHistory).values({
        leadId: input.leadId,
        fromStatus: 'available',
        toStatus: 'reserved',
        changedBy: providerId,
        reason: 'Réservé par prestataire',
      });
            // Mettre à jour stats prestataire
      await db.update(providers)
        .set({
          leadsReceived: sql`${providers.leadsReceived} + 1`,
        })
        .where(eq(providers.id, providerId));
      
      return { success: true, expiresAt };
    }),
  
  /**
   * Annuler une réservation
   */
  cancelReservation: protectedProcedure
    .input(z.object({
      leadId: z.number(),
      reason: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');
      
      // Récupérer le provider
      const [provider] = await db
        .select()
        .from(providers)
        .where(eq(providers.userId, ctx.user.id))
        .limit(1);
      
      if (!provider) {
        throw new Error('Profil prestataire non trouvé');
      }
      
      // Annuler la réservation active
      await db.update(leadReservations)
        .set({
          isActive: false,
          cancelledAt: new Date(),
          cancelReason: input.reason,
        })
        .where(and(
          eq(leadReservations.leadId, input.leadId),
          eq(leadReservations.providerId, provider.id),
          eq(leadReservations.isActive, true)
        ));
      
      // Remettre le lead disponible
      await db.update(leads)
        .set({
          status: 'available',
          reservedBy: null,
          reservedAt: null,
          reservedUntil: null,
        })
        .where(eq(leads.id, input.leadId));
      
      // Historique
      await db.insert(leadHistory).values({
        leadId: input.leadId,
        fromStatus: 'reserved',
        toStatus: 'available',
        changedBy: ctx.user.id,
        reason: input.reason || 'Réservation annulée',
      });
      
      return { success: true };
    }),
  
  // ============================================================================
  // COMMISSIONS (Paiements)
  // ============================================================================
  
  /**
   * Créer une commission (après devis signé)
   */
  createCommission: protectedProcedure
    .input(z.object({
      leadId: z.number(),
      quoteUrl: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');
      
      // Récupérer le lead
      const [lead] = await db
        .select()
        .from(leads)
        .where(eq(leads.id, input.leadId))
        .limit(1);
      
      if (!lead) {
        throw new Error('Lead non trouvé');
      }
      
      // Récupérer le provider
      const [provider] = await db
        .select()
        .from(providers)
        .where(eq(providers.userId, ctx.user.id))
        .limit(1);
      
      if (!provider) {
        throw new Error('Profil prestataire non trouvé');
      }
      
      // Vérifier que le lead est réservé par ce prestataire
      if (lead.reservedBy !== provider.id) {
        throw new Error('Vous n\'avez pas réservé ce lead');
      }
      
      // Créer la commission
      const result = await db
        .insert(commissions)
        .values({
          leadId: input.leadId,
          providerId: provider.id,
          serviceId: lead.serviceId,
          amount: lead.commissionAmount,
          quoteUrl: input.quoteUrl,
          status: 'pending',
        });
      
      const commissionId = Number(result[0].insertId);
      
      // Mettre à jour le lead
      await db.update(leads)
        .set({
          status: 'accepted' as const,
        })
        .where(eq(leads.id, input.leadId));
      
      // Historique
      await db.insert(leadHistory).values({
        leadId: input.leadId,
        fromStatus: 'reserved',
        toStatus: 'quote_signed',
        changedBy: ctx.user.id,
        reason: 'Devis signé - Commission créée',
      });
      
      return { success: true, commissionId };
    }),
  
  /**
   * Créer un profil prestataire (inscription)
   */
  createProvider: publicProcedure
    .input(z.object({
      // Entreprise
      companyName: z.string(),
      siret: z.string().length(14),
      formeJuridique: z.string(),
      capital: z.number(),
      dateCreation: z.string(),
      effectif: z.number(),
      caAnnuel: z.number(),
      numeroTVA: z.string().optional(),
      siteWeb: z.string().optional(),
      anneesExperience: z.number(),
      // Contact
      contactName: z.string(),
      contactEmail: z.string().email(),
      contactPhone: z.string(),
      password: z.string().min(8),
      // Adresse
      address: z.string(),
      city: z.string(),
      postalCode: z.string(),
      // Services et zones
      serviceDepartments: z.array(z.string()),
      services: z.array(z.string()),
      // Présentation
      description: z.string().min(500),
      specialites: z.string().optional(),
      references: z.string().optional(),
      // Certifications
      certifications: z.string(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');
      
      // Vérifier si SIRET existe déjà
      const [existing] = await db
        .select()
        .from(providers)
        .where(eq(providers.siret, input.siret))
        .limit(1);
      
      if (existing) {
        throw new Error('Ce SIRET est déjà enregistré');
      }
      
      // TODO: Récupérer serviceIds depuis les slugs
      // Pour l'instant, on met photovoltaique (id=1) par défaut
      const serviceIds = [1]; // Photovoltaïque
      
      // Créer un compte utilisateur temporaire (userId)
      // TODO: Intégrer avec système auth
      const userId = Math.floor(Math.random() * 1000000); // Temporaire
      
      // Créer le provider
      const result = await db
        .insert(providers)
        .values({
          userId,
          // Entreprise
          companyName: input.companyName,
          siret: input.siret,
          formeJuridique: input.formeJuridique,
          capital: input.capital.toString(),
          dateCreation: new Date(input.dateCreation),
          effectif: input.effectif,
          caAnnuel: input.caAnnuel.toString(),
          numeroTVA: input.numeroTVA || null,
          siteWeb: input.siteWeb || null,
          anneesExperience: input.anneesExperience,
          // Contact
          contactName: input.contactName,
          contactEmail: input.contactEmail,
          contactPhone: input.contactPhone,
          // Authentification
          passwordHash: await bcrypt.hash(input.password, 10),
          // Adresse
          address: input.address,
          city: input.city,
          postalCode: input.postalCode,
          // Services et zones
          serviceIds,
          interventionDepartments: input.serviceDepartments,
          // Présentation
          description: input.description,
          specialites: input.specialites || null,
          references: input.references || null,
          // Certifications
          certifications: { raw: input.certifications },
          // Charte (signée via checkbox)
          charteSignedAt: new Date(),
          // Statut
          status: 'pending', // Validation manuelle admin
        });
      
      const providerId = Number(result[0].insertId);
      
      return {
        success: true,
        providerId,
        message: 'Inscription envoyée avec succès ! Nous validons votre dossier sous 48h.',
      };
    }),
  
  /**
   * Lister mes leads (prestataire)
   */
  myLeads: protectedProcedure
    .input(z.object({
      status: z.enum(['reserved', 'contacted', 'quote_sent', 'accepted', 'paid', 'completed']).optional(),
      limit: z.number().default(20),
      offset: z.number().default(0),
    }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');
      
      // Récupérer le provider
      const [provider] = await db
        .select()
        .from(providers)
        .where(eq(providers.userId, ctx.user.id))
        .limit(1);
      
      if (!provider) {
        return [];
      }
      
      let conditions = [eq(leads.reservedBy, provider.id)];
      
      if (input.status) {
        conditions.push(eq(leads.status, input.status));
      }
      
      return await db
        .select()
        .from(leads)
        .where(and(...conditions))
        .orderBy(desc(leads.createdAt))
        .limit(input.limit)
        .offset(input.offset);
    }),
});

