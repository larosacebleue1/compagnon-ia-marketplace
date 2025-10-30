/**
 * SCHÉMA UNIVERSEL - SERVICE MISE EN RELATION
 * 
 * Architecture générique pour tous secteurs d'activité :
 * - Photovoltaïque, Plomberie, Avocat, Architecte, etc.
 * - Commissions flexibles par secteur
 * - Tracking affiliation complet
 * - Extensible à l'infini
 */

import { mysqlTable, int, varchar, text, timestamp, decimal, boolean, json, mysqlEnum } from 'drizzle-orm/mysql-core';

// ============================================================================
// ENUMS
// ============================================================================

export const leadStatusEnum = mysqlEnum('lead_status', [
  'pending',        // En attente (client a rempli formulaire)
  'available',      // Disponible pour prestataires
  'reserved',       // Réservé par un prestataire (48h)
  'contacted',      // Client contacté
  'quote_sent',     // Devis envoyé
  'accepted',       // Client a accepté
  'paid',           // Prestataire a payé commission
  'completed',      // Service terminé
  'cancelled',      // Annulé
]);

export const providerStatusEnum = mysqlEnum('provider_status', [
  'pending',        // En attente validation
  'active',         // Actif
  'suspended',      // Suspendu
  'rejected',       // Rejeté
]);

export const commissionStatusEnum = mysqlEnum('commission_status', [
  'pending',        // En attente
  'processing',     // En cours
  'paid',           // Payée
  'failed',         // Échouée
  'refunded',       // Remboursée
]);

// ============================================================================
// TABLE: SERVICES (Secteurs d'activité)
// ============================================================================

export const services = mysqlTable('services', {
  id: int('id').autoincrement().primaryKey(),
  
  // Identification
  slug: varchar('slug', { length: 100 }).notNull().unique(), // 'photovoltaique', 'plomberie', 'avocat'
  name: varchar('name', { length: 255 }).notNull(), // 'Installation Photovoltaïque'
  category: varchar('category', { length: 100 }).notNull(), // 'energie', 'batiment', 'juridique'
  
  // Description
  description: text('description'),
  icon: varchar('icon', { length: 50 }), // Emoji ou icon name
  
  // Commission
  commissionType: mysqlEnum('commission_type', ['fixed', 'percentage']).notNull().default('percentage'),
  commissionValue: decimal('commission_value', { precision: 10, scale: 2 }).notNull(), // 6.00 pour 6% ou 50.00 pour 50€
  commissionMin: decimal('commission_min', { precision: 10, scale: 2 }), // Commission minimale
  commissionMax: decimal('commission_max', { precision: 10, scale: 2 }), // Commission maximale
  
  // Configuration
  requiresQuote: boolean('requires_quote').notNull().default(true), // Nécessite devis
  reservationDuration: int('reservation_duration').notNull().default(48), // Durée réservation en heures
  
  // Formulaire personnalisé
  customFields: json('custom_fields').$type<Array<{
    name: string;
    type: 'text' | 'number' | 'select' | 'date' | 'textarea';
    label: string;
    required: boolean;
    options?: string[];
  }>>(),
  
  // Statut
  isActive: boolean('is_active').notNull().default(true),
  
  // Métadonnées
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
});

export type Service = typeof services.$inferSelect;
export type InsertService = typeof services.$inferInsert;

// ============================================================================
// TABLE: PROVIDERS (Prestataires tous secteurs)
// ============================================================================

export const providers = mysqlTable('providers', {
  id: int('id').autoincrement().primaryKey(),
  
  // Compte utilisateur lié
  userId: int('user_id').notNull().unique(),
  
  // Informations entreprise
  companyName: varchar('company_name', { length: 255 }).notNull(),
  siret: varchar('siret', { length: 14 }),
  
  // Contact
  contactName: varchar('contact_name', { length: 255 }).notNull(),
  contactEmail: varchar('contact_email', { length: 320 }).notNull(),
  contactPhone: varchar('contact_phone', { length: 20 }).notNull(),
  
  // Adresse
  address: text('address'),
  city: varchar('city', { length: 255 }),
  postalCode: varchar('postal_code', { length: 10 }),
  
  // Services proposés (multi-secteurs)
  serviceIds: json('service_ids').notNull().$type<number[]>(), // [1, 3, 5] = PV + Plomberie + Électricité
  
  // Zone d'intervention
  interventionDepartments: json('intervention_departments').$type<string[]>(), // ["13", "84", "06"]
  interventionRadius: int('intervention_radius').default(50), // km
  
  // Certifications
  certifications: json('certifications').$type<{
    [key: string]: boolean | string;
  }>(),
  
  // Statut
  status: mysqlEnum('provider_status', ['pending', 'active', 'suspended', 'rejected']).notNull().default('pending'),
  
  // Statistiques
  leadsReceived: int('leads_received').notNull().default(0),
  leadsConverted: int('leads_converted').notNull().default(0),
  totalSpent: decimal('total_spent', { precision: 10, scale: 2 }).notNull().default('0.00'),
  rating: decimal('rating', { precision: 3, scale: 2 }).default('0.00'), // Note /5
  reviewCount: int('review_count').notNull().default(0),
  
  // Métadonnées
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
  validatedAt: timestamp('validated_at'),
  validatedBy: int('validated_by'), // Admin user_id
});

export type Provider = typeof providers.$inferSelect;
export type InsertProvider = typeof providers.$inferInsert;

// ============================================================================
// TABLE: LEADS (Demandes clients universelles)
// ============================================================================

export const leads = mysqlTable('leads', {
  id: int('id').autoincrement().primaryKey(),
  
  // Service concerné
  serviceId: int('service_id').notNull(),
  
  // Informations client
  clientFirstName: varchar('client_first_name', { length: 255 }).notNull(),
  clientLastName: varchar('client_last_name', { length: 255 }).notNull(),
  clientEmail: varchar('client_email', { length: 320 }).notNull(),
  clientPhone: varchar('client_phone', { length: 20 }).notNull(),
  clientAddress: text('client_address'),
  clientCity: varchar('client_city', { length: 255 }),
  clientPostalCode: varchar('client_postal_code', { length: 10 }),
  
  // Données spécifiques au service (JSON flexible)
  serviceData: json('service_data').notNull().$type<{
    [key: string]: any;
  }>(),
  
  // Montant estimé (si applicable)
  estimatedAmount: decimal('estimated_amount', { precision: 10, scale: 2 }),
  
  // Commission calculée
  commissionAmount: decimal('commission_amount', { precision: 10, scale: 2 }).notNull(),
  
  // Statut
  status: mysqlEnum('status', ['pending', 'available', 'reserved', 'contacted', 'quote_sent', 'accepted', 'paid', 'completed', 'cancelled']).notNull().default('pending'),
  
  // Réservation
  reservedBy: int('reserved_by'), // provider_id
  reservedAt: timestamp('reserved_at'),
  reservedUntil: timestamp('reserved_until'),
  
  // Conversion
  convertedBy: int('converted_by'), // provider_id qui a converti
  convertedAt: timestamp('converted_at'),
  
  // Consentements
  acceptedTerms: boolean('accepted_terms').notNull().default(true),
  acceptedContact: boolean('accepted_contact').notNull().default(true),
  
  // Source
  sourceUrl: varchar('source_url', { length: 500 }), // URL d'origine
  sourceModule: varchar('source_module', { length: 100 }), // 'calculateur-pv', 'chat-ia', etc.
  
  // Métadonnées
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

// ============================================================================
// TABLE: LEAD_RESERVATIONS (Réservations)
// ============================================================================

export const leadReservations = mysqlTable('lead_reservations', {
  id: int('id').autoincrement().primaryKey(),
  
  leadId: int('lead_id').notNull(),
  providerId: int('provider_id').notNull(),
  
  // Réservation
  reservedAt: timestamp('reserved_at').notNull().defaultNow(),
  expiresAt: timestamp('expires_at').notNull(),
  
  // Statut
  isActive: boolean('is_active').notNull().default(true),
  cancelledAt: timestamp('cancelled_at'),
  cancelReason: text('cancel_reason'),
  
  // Conversion
  converted: boolean('converted').notNull().default(false),
  convertedAt: timestamp('converted_at'),
  
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type LeadReservation = typeof leadReservations.$inferSelect;
export type InsertLeadReservation = typeof leadReservations.$inferInsert;

// ============================================================================
// TABLE: COMMISSIONS (Paiements affiliation)
// ============================================================================

export const commissions = mysqlTable('commissions', {
  id: int('id').autoincrement().primaryKey(),
  
  leadId: int('lead_id').notNull(),
  providerId: int('provider_id').notNull(),
  serviceId: int('service_id').notNull(),
  
  // Montant
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  
  // Paiement
  paymentMethod: varchar('payment_method', { length: 50 }), // 'stripe', 'paypal', 'virement'
  paymentIntentId: varchar('payment_intent_id', { length: 255 }), // Stripe payment_intent_id
  status: mysqlEnum('commission_status', ['pending', 'processing', 'paid', 'failed', 'refunded']).notNull().default('pending'),
  
  // Documents
  invoiceUrl: varchar('invoice_url', { length: 500 }),
  quoteUrl: varchar('quote_url', { length: 500 }), // Devis signé
  
  // Validation admin
  adminValidated: boolean('admin_validated').notNull().default(false),
  adminValidatedAt: timestamp('admin_validated_at'),
  adminValidatedBy: int('admin_validated_by'),
  adminNotes: text('admin_notes'),
  
  // Métadonnées
  createdAt: timestamp('created_at').notNull().defaultNow(),
  paidAt: timestamp('paid_at'),
});

export type Commission = typeof commissions.$inferSelect;
export type InsertCommission = typeof commissions.$inferInsert;

// ============================================================================
// TABLE: LEAD_HISTORY (Historique changements)
// ============================================================================

export const leadHistory = mysqlTable('lead_history', {
  id: int('id').autoincrement().primaryKey(),
  
  leadId: int('lead_id').notNull(),
  
  // Changement
  fromStatus: varchar('from_status', { length: 50 }),
  toStatus: varchar('to_status', { length: 50 }).notNull(),
  
  // Contexte
  changedBy: int('changed_by'), // user_id ou NULL si system
  reason: text('reason'),
  metadata: json('metadata'),
  
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type LeadHistory = typeof leadHistory.$inferSelect;
export type InsertLeadHistory = typeof leadHistory.$inferInsert;

