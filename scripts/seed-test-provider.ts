/**
 * SCRIPT SEED - PROVIDER DE TEST
 * 
 * Crée un installateur de test actif pour valider la marketplace
 */

import { drizzle } from 'drizzle-orm/mysql2';
import { providers } from '../drizzle/schema';
import bcrypt from 'bcrypt';

const db = drizzle(process.env.DATABASE_URL!);

async function seedTestProvider() {
  console.log('🌱 Seeding test provider...');
  
  const passwordHash = await bcrypt.hash('Test123!', 10);
  
  const testProvider = {
    companyName: 'SARL SOLEIL ENERGIE TEST',
    siret: '12345678901234',
    legalForm: 'SARL',
    capital: '10000',
    foundedAt: new Date('2015-01-01'),
    employeeCount: 5,
    annualRevenue: '500000',
    tvaNumber: 'FR12345678901',
    website: 'https://www.soleil-energie-test.fr',
    yearsExperience: 10,
    
    contactName: 'Jean TESTEUR',
    contactEmail: 'test@soleil-energie.fr',
    contactPhone: '06 12 34 56 78',
    passwordHash,
    
    address: '15 Rue de la République',
    city: 'Lyon',
    postalCode: '69001',
    
    serviceIds: JSON.stringify([1]), // ID du service photovoltaïque
    interventionDepartments: JSON.stringify(['69', '01', '38', '42']),
    
    description: 'Expert en installation photovoltaïque depuis 10 ans. Notre équipe de 5 techniciens certifiés RGE intervient dans toute la région Auvergne-Rhône-Alpes. Nous garantissons des installations de qualité avec un suivi personnalisé de chaque projet, de l\'étude de faisabilité à la mise en service. Plus de 500 installations réalisées avec un taux de satisfaction client de 98%.',
    
    specialites: 'Installation photovoltaïque résidentielle et professionnelle, Optimisation énergétique, Maintenance et dépannage, Stockage batterie',
    
    references: 'Mairie de Lyon (installation 50kWc), Centre commercial Part-Dieu (100kWc), Plus de 500 particuliers',
    
    certifications: 'RGE QualiPV, Qualibat 5911, Habilitation électrique BR',
    
    charteSignedAt: new Date(),
    charteIpAddress: '127.0.0.1',
    
    status: 'active' as const, // ACTIF pour pouvoir se connecter
    
    leadsReceived: 0,
    leadsConverted: 0,
    totalSpent: '0.00',
    rating: '0.00',
    reviewCount: 0,
    
    validatedAt: new Date(),
    validatedBy: 1, // Admin
  };
  
  const [result] = await db.insert(providers).values(testProvider);
  
  console.log('✅ Provider créé avec succès !');
  console.log('');
  console.log('📧 Email : test@soleil-energie.fr');
  console.log('🔑 Mot de passe : Test123!');
  console.log('');
  console.log('🔗 Login : https://3000-isnaeesj7e1grzm77w9bx-93100550.manusvm.computer/login-installateur');
  console.log('');
}

seedTestProvider()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });

