/**
 * SEED DATA - Services initiaux
 * 
 * Initialise les premiers services disponibles sur la plateforme
 */

import { getDb } from './db';
import { services } from '../drizzle/schema';

const INITIAL_SERVICES = [
  {
    slug: 'photovoltaique',
    name: 'Installation Photovoltaïque',
    category: 'energie',
    description: 'Installation complète de panneaux solaires photovoltaïques avec onduleur, raccordement et démarches administratives.',
    icon: '☀️',
    commissionType: 'percentage' as const,
    commissionValue: '6.00', // 6%
    commissionMin: '330.00', // 3kWc minimum
    commissionMax: '900.00', // 9kWc maximum
    requiresQuote: true,
    reservationDuration: 48,
    customFields: [
      {
        name: 'power',
        type: 'number' as const,
        label: 'Puissance (kWc)',
        required: true,
      },
      {
        name: 'orientation',
        type: 'select' as const,
        label: 'Orientation toiture',
        required: true,
        options: ['Sud', 'Sud-Est', 'Sud-Ouest', 'Est', 'Ouest', 'Nord'],
      },
      {
        name: 'surface',
        type: 'number' as const,
        label: 'Surface disponible (m²)',
        required: true,
      },
      {
        name: 'monthlyBill',
        type: 'number' as const,
        label: 'Facture mensuelle (€)',
        required: false,
      },
    ],
    isActive: true,
  },
  {
    slug: 'plomberie',
    name: 'Plomberie & Sanitaire',
    category: 'batiment',
    description: 'Interventions plomberie : fuites, installation sanitaires, chauffe-eau, etc.',
    icon: '🔧',
    commissionType: 'fixed' as const,
    commissionValue: '50.00', // 50€ fixe
    requiresQuote: true,
    reservationDuration: 24,
    customFields: [
      {
        name: 'urgency',
        type: 'select' as const,
        label: 'Urgence',
        required: true,
        options: ['Urgente (< 24h)', 'Normale (< 1 semaine)', 'Planifiée'],
      },
      {
        name: 'description',
        type: 'textarea' as const,
        label: 'Description du problème',
        required: true,
      },
    ],
    isActive: true,
  },
  {
    slug: 'electricite',
    name: 'Électricité',
    category: 'batiment',
    description: 'Travaux électriques : installation, rénovation, mise aux normes, dépannage.',
    icon: '⚡',
    commissionType: 'fixed' as const,
    commissionValue: '80.00', // 80€ fixe
    requiresQuote: true,
    reservationDuration: 24,
    customFields: [
      {
        name: 'workType',
        type: 'select' as const,
        label: 'Type de travaux',
        required: true,
        options: ['Installation', 'Rénovation', 'Mise aux normes', 'Dépannage'],
      },
      {
        name: 'description',
        type: 'textarea' as const,
        label: 'Description des travaux',
        required: true,
      },
    ],
    isActive: true,
  },
  {
    slug: 'avocat',
    name: 'Consultation Juridique',
    category: 'juridique',
    description: 'Consultation avec un avocat spécialisé.',
    icon: '⚖️',
    commissionType: 'fixed' as const,
    commissionValue: '150.00', // 150€ fixe
    requiresQuote: false,
    reservationDuration: 48,
    customFields: [
      {
        name: 'specialty',
        type: 'select' as const,
        label: 'Spécialité',
        required: true,
        options: ['Droit de la famille', 'Droit du travail', 'Droit immobilier', 'Droit commercial', 'Autre'],
      },
      {
        name: 'description',
        type: 'textarea' as const,
        label: 'Description de votre situation',
        required: true,
      },
    ],
    isActive: true,
  },
  {
    slug: 'architecte',
    name: 'Architecte',
    category: 'batiment',
    description: 'Conception et suivi de projets de construction ou rénovation.',
    icon: '🏗️',
    commissionType: 'fixed' as const,
    commissionValue: '200.00', // 200€ fixe
    requiresQuote: true,
    reservationDuration: 72,
    customFields: [
      {
        name: 'projectType',
        type: 'select' as const,
        label: 'Type de projet',
        required: true,
        options: ['Construction neuve', 'Rénovation', 'Extension', 'Aménagement intérieur'],
      },
      {
        name: 'surface',
        type: 'number' as const,
        label: 'Surface (m²)',
        required: false,
      },
      {
        name: 'description',
        type: 'textarea' as const,
        label: 'Description du projet',
        required: true,
      },
    ],
    isActive: true,
  },
];

async function seedServices() {
  console.log('🌱 Seeding services...');
  
  const db = await getDb();
  if (!db) {
    console.error('❌ Database not available');
    process.exit(1);
  }
  
  try {
    for (const service of INITIAL_SERVICES) {
      console.log(`  → Inserting service: ${service.name}`);
      await db.insert(services).values(service);
    }
    
    console.log('✅ Services seeded successfully!');
    console.log(`   ${INITIAL_SERVICES.length} services created`);
  } catch (error) {
    console.error('❌ Error seeding services:', error);
    process.exit(1);
  }
}

// Exécuter automatiquement
seedServices().then(() => process.exit(0));

export { seedServices };

