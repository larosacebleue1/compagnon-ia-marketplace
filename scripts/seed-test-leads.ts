/**
 * SCRIPT SEED - LEADS DE TEST
 * 
 * Génère des leads de test pour valider la marketplace
 */

import { drizzle } from 'drizzle-orm/mysql2';
import { leads } from '../drizzle/schema';
import crypto from 'crypto';

function generateAccessToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

const db = drizzle(process.env.DATABASE_URL!);

async function seedTestLeads() {
  console.log('🌱 Seeding test leads...');
  
  const testLeads = [
    {
      serviceId: 1, // Photovoltaïque
      serviceData: JSON.stringify({
        power: 6,
        annualProduction: 7200,
        roofType: 'tuiles',
        orientation: 'sud',
      }),
      estimatedAmount: '11500',
      commissionAmount: '690', // 6%
      clientFirstName: 'Jean',
      clientLastName: 'Dupont',
      clientEmail: 'jean.dupont@example.com',
      clientPhone: '06 12 34 56 78',
      clientAddress: '15 Rue de la République',
      clientCity: 'Lyon',
      clientPostalCode: '69001',
      status: 'available' as const,
      chosenPath: 'standard' as const,
      acceptedTerms: true,
      acceptedContact: true,
      accessToken: generateAccessToken(),
    },
    {
      serviceId: 1, // Photovoltaïque
      serviceData: JSON.stringify({
        power: 9,
        annualProduction: 10800,
        roofType: 'ardoise',
        orientation: 'sud-ouest',
      }),
      estimatedAmount: '15000',
      commissionAmount: '900', // 6%
      clientFirstName: 'Marie',
      clientLastName: 'Martin',
      clientEmail: 'marie.martin@example.com',
      clientPhone: '06 23 45 67 89',
      clientAddress: '42 Avenue des Champs',
      clientCity: 'Paris',
      clientPostalCode: '75008',
      status: 'available' as const,
      chosenPath: 'express' as const,
      acceptedTerms: true,
      acceptedContact: true,
      accessToken: generateAccessToken(),
    },
    {
      serviceId: 1, // Photovoltaïque
      serviceData: JSON.stringify({
        power: 3,
        annualProduction: 3600,
        roofType: 'tuiles',
        orientation: 'est',
      }),
      estimatedAmount: '8500',
      commissionAmount: '510', // 6%
      clientFirstName: 'Pierre',
      clientLastName: 'Bernard',
      clientEmail: 'pierre.bernard@example.com',
      clientPhone: '06 34 56 78 90',
      clientAddress: '8 Impasse du Soleil',
      clientCity: 'Marseille',
      clientPostalCode: '13001',
      status: 'available' as const,
      chosenPath: 'standard' as const,
      acceptedTerms: true,
      acceptedContact: true,
      accessToken: generateAccessToken(),
    },
    {
      serviceId: 1, // Photovoltaïque
      serviceData: JSON.stringify({
        power: 12,
        annualProduction: 14400,
        roofType: 'bac acier',
        orientation: 'sud',
      }),
      estimatedAmount: '18000',
      commissionAmount: '1080', // 6%
      clientFirstName: 'Sophie',
      clientLastName: 'Dubois',
      clientEmail: 'sophie.dubois@example.com',
      clientPhone: '06 45 67 89 01',
      clientAddress: '23 Rue Victor Hugo',
      clientCity: 'Toulouse',
      clientPostalCode: '31000',
      status: 'available' as const,
      chosenPath: 'express' as const,
      acceptedTerms: true,
      acceptedContact: true,
      accessToken: generateAccessToken(),
    },
    {
      serviceId: 1, // Photovoltaïque
      serviceData: JSON.stringify({
        power: 6,
        annualProduction: 7200,
        roofType: 'tuiles',
        orientation: 'sud-est',
      }),
      estimatedAmount: '11500',
      commissionAmount: '690', // 6%
      clientFirstName: 'Luc',
      clientLastName: 'Petit',
      clientEmail: 'luc.petit@example.com',
      clientPhone: '06 56 78 90 12',
      clientAddress: '56 Boulevard de la Liberté',
      clientCity: 'Bordeaux',
      clientPostalCode: '33000',
      status: 'available' as const,
      chosenPath: 'standard' as const,
      acceptedTerms: true,
      acceptedContact: true,
      accessToken: generateAccessToken(),
    },
  ];
  
  for (const lead of testLeads) {
    await db.insert(leads).values(lead);
    console.log(`✅ Lead créé : ${lead.clientFirstName} ${lead.clientLastName} - ${lead.clientCity}`);
  }
  
  console.log('✅ Seeding completed!');
  console.log(`📊 ${testLeads.length} leads de test créés`);
}

seedTestLeads()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });

