/**
 * SCHÉMA UNIVERSEL - SERVICE MISE EN RELATION
 * 
 * Architecture générique pour tous secteurs d'activité :
 * - Photovoltaïque, Plomberie, Avocat, Architecte, etc.
 * - Commissions flexibles par secteur
 * - Tracking affiliation complet
 * - Extensible à l'infini
 */

import { mysqlTable, int, varchar, text, timestamp, decimal, boolean, json, mysqlEnum, date } from 'drizzle-orm/mysql-core';

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
  formeJuridique: varchar('forme_juridique', { length: 50 }), // SARL, SAS, EURL, etc.
  capital: decimal('capital', { precision: 12, scale: 2 }), // Capital social
  dateCreation: date('date_creation'),
  effectif: int('effectif'), // Nombre salariés
  caAnnuel: decimal('ca_annuel', { precision: 12, scale: 2 }), // CA dernier exercice
  numeroTVA: varchar('numero_tva', { length: 20 }), // N° TVA intracommunautaire
  siteWeb: varchar('site_web', { length: 255 }),
  anneesExperience: int('annees_experience'),
  
  // Contact
  contactName: varchar('contact_name', { length: 255 }).notNull(),
  contactEmail: varchar('contact_email', { length: 320 }).notNull(),
  contactPhone: varchar('contact_phone', { length: 20 }).notNull(),
  
  // Authentification
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  
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
  
  // Documents (URLs S3)
  documentKbis: varchar('document_kbis', { length: 500 }), // URL Kbis
  documentAssuranceDecennale: varchar('document_assurance_decennale', { length: 500 }),
  documentAssuranceRC: varchar('document_assurance_rc', { length: 500 }),
  documentCertifications: varchar('document_certifications', { length: 500 }),
  documentURSSAF: varchar('document_urssaf', { length: 500 }),
  
  // Présentation
  description: text('description'), // Description activité
  specialites: text('specialites'), // Spécialités / Points forts
  references: text('references'), // Références clients
  
  // Charte
  charteSignedAt: timestamp('charte_signed_at'),
  charteIpAddress: varchar('charte_ip_address', { length: 50 }),
  
  // Statut
  status: mysqlEnum('provider_status', ['pending', 'documents_incomplete', 'under_review', 'active', 'suspended', 'rejected']).notNull().default('pending'),
  rejectionReason: text('rejection_reason'), // Raison du refus
  
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
  status: mysqlEnum('status', [
    'pending', 
    'available', 
    'reserved', 
    'contacted', 
    'quote_sent', 
    'quote_signed_standard',  // Devis signé, délai 14j
    'quote_signed_express',   // Devis signé, renonciation + acompte
    'cooling_off',            // En période rétractation 14j
    'retracted',              // Client rétracté
    'confirmed',              // Projet confirmé (après 14j ou acompte)
    'accepted', 
    'paid', 
    'in_progress',            // Travaux en cours
    'completed', 
    'cancelled'
  ]).notNull().default('pending'),
  
  // Réservation
  reservedBy: int('reserved_by'), // provider_id
  reservedAt: timestamp('reserved_at'),
  reservedUntil: timestamp('reserved_until'),
  
  // Conversion
  convertedBy: int('converted_by'), // provider_id qui a converti
  convertedAt: timestamp('converted_at'),
  
  // Parcours client (Standard vs Express)
  chosenPath: mysqlEnum('chosen_path', ['standard', 'express']).default('standard'),
  
  // Acompte (si Express)
  depositAmount: decimal('deposit_amount', { precision: 10, scale: 2 }),
  depositPaid: boolean('deposit_paid').notNull().default(false),
  depositPaidAt: timestamp('deposit_paid_at'),
  depositPaymentIntentId: varchar('deposit_payment_intent_id', { length: 255 }), // Stripe payment_intent
  
  // Renonciation délai rétractation (si Express)
  waiverSigned: boolean('waiver_signed').notNull().default(false),
  waiverSignedAt: timestamp('waiver_signed_at'),
  
  // Délai rétractation (si Standard)
  coolingOffEndsAt: timestamp('cooling_off_ends_at'), // Date fin délai 14j
  
  // Consentements
  acceptedTerms: boolean('accepted_terms').notNull().default(true),
  acceptedContact: boolean('accepted_contact').notNull().default(true),
  
  // Source
  sourceUrl: varchar('source_url', { length: 500 }), // URL d'origine
  sourceModule: varchar('source_module', { length: 100 }), // 'calculateur-pv', 'chat-ia', etc.
  
  // Accès dashboard client
  accessToken: varchar('access_token', { length: 64 }).notNull().unique(), // Token unique pour accès dashboard
  
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

