/**
 * 20 ZONES MÉTROPOLITAINES - Production photovoltaïque terrain réelle
 * Basé sur 15+ ans d'expérience terrain
 * Valeurs RÉELLES observées (pas de décote supplémentaire à appliquer)
 * 
 * Algorithme : Calculer distance GPS entre ville client et ces 20 villes
 * → Prendre production de la ville la plus proche
 */

export interface MetroZone {
  id: string;
  name: string;
  city: string;
  region: string;
  lat: number;
  lon: number;
  productionSud: number; // kWh/kWc/an orientation Sud
}

export const METRO_ZONES: MetroZone[] = [
  // Zone 1 - Nord
  {
    id: 'lille',
    name: 'Lille - Nord',
    city: 'Lille',
    region: 'Hauts-de-France',
    lat: 50.6292,
    lon: 3.0573,
    productionSud: 1000,
  },
  
  // Zone 2 - Normandie
  {
    id: 'rouen',
    name: 'Rouen - Normandie',
    city: 'Rouen',
    region: 'Normandie',
    lat: 49.4432,
    lon: 1.0993,
    productionSud: 1050,
  },
  
  // Zone 3 - Bretagne Nord
  {
    id: 'brest',
    name: 'Brest - Finistère',
    city: 'Brest',
    region: 'Bretagne',
    lat: 48.3905,
    lon: -4.4860,
    productionSud: 1000,
  },
  
  // Zone 4 - Bretagne Sud
  {
    id: 'rennes',
    name: 'Rennes - Bretagne',
    city: 'Rennes',
    region: 'Bretagne',
    lat: 48.1173,
    lon: -1.6778,
    productionSud: 1100,
  },
  
  // Zone 5 - Île-de-France
  {
    id: 'paris',
    name: 'Paris - Île-de-France',
    city: 'Paris',
    region: 'Île-de-France',
    lat: 48.8566,
    lon: 2.3522,
    productionSud: 1200,
  },
  
  // Zone 6 - Est
  {
    id: 'strasbourg',
    name: 'Strasbourg - Grand Est',
    city: 'Strasbourg',
    region: 'Grand Est',
    lat: 48.5734,
    lon: 7.7521,
    productionSud: 1150,
  },
  
  // Zone 7 - Pays de Loire
  {
    id: 'nantes',
    name: 'Nantes - Pays de Loire',
    city: 'Nantes',
    region: 'Pays de la Loire',
    lat: 47.2184,
    lon: -1.5536,
    productionSud: 1250,
  },
  
  // Zone 8 - Centre-Val de Loire
  {
    id: 'orleans',
    name: 'Orléans - Centre',
    city: 'Orléans',
    region: 'Centre-Val de Loire',
    lat: 47.9029,
    lon: 1.9093,
    productionSud: 1300,
  },
  
  // Zone 9 - Bourgogne
  {
    id: 'dijon',
    name: 'Dijon - Bourgogne',
    city: 'Dijon',
    region: 'Bourgogne-Franche-Comté',
    lat: 47.3220,
    lon: 5.0415,
    productionSud: 1320,
  },
  
  // Zone 10 - Limousin
  {
    id: 'limoges',
    name: 'Limoges - Limousin',
    city: 'Limoges',
    region: 'Nouvelle-Aquitaine',
    lat: 45.8336,
    lon: 1.2611,
    productionSud: 1300,
  },
  
  // Zone 11 - Auvergne
  {
    id: 'clermont',
    name: 'Clermont-Ferrand - Auvergne',
    city: 'Clermont-Ferrand',
    region: 'Auvergne-Rhône-Alpes',
    lat: 45.7772,
    lon: 3.0870,
    productionSud: 1350,
  },
  
  // Zone 12 - Rhône-Alpes
  {
    id: 'lyon',
    name: 'Lyon - Rhône-Alpes',
    city: 'Lyon',
    region: 'Auvergne-Rhône-Alpes',
    lat: 45.7640,
    lon: 4.8357,
    productionSud: 1450,
  },
  
  // Zone 13 - Bordeaux
  {
    id: 'bordeaux',
    name: 'Bordeaux - Nouvelle-Aquitaine',
    city: 'Bordeaux',
    region: 'Nouvelle-Aquitaine',
    lat: 44.8378,
    lon: -0.5792,
    productionSud: 1500,
  },
  
  // Zone 14 - Pyrénées
  {
    id: 'pau',
    name: 'Pau - Pyrénées',
    city: 'Pau',
    region: 'Nouvelle-Aquitaine',
    lat: 43.2951,
    lon: -0.3708,
    productionSud: 1450,
  },
  
  // Zone 15 - Toulouse
  {
    id: 'toulouse',
    name: 'Toulouse - Occitanie',
    city: 'Toulouse',
    region: 'Occitanie',
    lat: 43.6047,
    lon: 1.4442,
    productionSud: 1500,
  },
  
  // Zone 16 - Montpellier
  {
    id: 'montpellier',
    name: 'Montpellier - Languedoc',
    city: 'Montpellier',
    region: 'Occitanie',
    lat: 43.6108,
    lon: 3.8767,
    productionSud: 1600,
  },
  
  // Zone 17 - Perpignan
  {
    id: 'perpignan',
    name: 'Perpignan - Roussillon',
    city: 'Perpignan',
    region: 'Occitanie',
    lat: 42.6886,
    lon: 2.8948,
    productionSud: 1620,
  },
  
  // Zone 18 - Marseille
  {
    id: 'marseille',
    name: 'Marseille - PACA',
    city: 'Marseille',
    region: "Provence-Alpes-Côte d'Azur",
    lat: 43.2965,
    lon: 5.3698,
    productionSud: 1700, // ✅ CORRIGÉ : 1700 au lieu de 1600
  },
  
  // Zone 19 - Nice
  {
    id: 'nice',
    name: 'Nice - Côte d\'Azur',
    city: 'Nice',
    region: "Provence-Alpes-Côte d'Azur",
    lat: 43.7102,
    lon: 7.2620,
    productionSud: 1680,
  },
  
  // Zone 20 - Corse
  {
    id: 'ajaccio',
    name: 'Ajaccio - Corse',
    city: 'Ajaccio',
    region: 'Corse',
    lat: 41.9267,
    lon: 8.7369,
    productionSud: 1750,
  },
];

/**
 * Calcule la distance entre deux points GPS (formule Haversine)
 * @returns distance en km
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Trouve la zone métropolitaine la plus proche d'une position GPS
 */
export function findNearestZone(lat: number, lon: number): MetroZone {
  let nearestZone = METRO_ZONES[0];
  let minDistance = calculateDistance(lat, lon, nearestZone.lat, nearestZone.lon);
  
  for (const zone of METRO_ZONES) {
    const distance = calculateDistance(lat, lon, zone.lat, zone.lon);
    if (distance < minDistance) {
      minDistance = distance;
      nearestZone = zone;
    }
  }
  
  return nearestZone;
}

/**
 * Applique le coefficient d'orientation sur la production Sud
 * Coefficients basés sur 15+ ans d'expérience terrain
 */
export function applyOrientationCoefficient(productionSud: number, orientation: string): number {
  const coefficients: Record<string, number> = {
    'sud': 1.0,           // 100%
    'sud-est': 0.875,     // 87.5% (-12.5%)
    'sud-ouest': 0.875,   // 87.5% (-12.5%)
    'est': 0.8125,        // 81.25% (-18.75%)
    'ouest': 0.8125,      // 81.25% (-18.75%)
    'nord': 0.5,          // 50% (-50%)
  };
  
  const coefficient = coefficients[orientation] || 1.0;
  return Math.round(productionSud * coefficient);
}

/**
 * Applique la décote ombrage si nécessaire
 */
export function applyShadingDiscount(production: number, hasShading: boolean): number {
  if (!hasShading) return production;
  return Math.round(production * 0.9); // -10% si ombrage
}

