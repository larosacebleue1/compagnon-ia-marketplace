import { publicProcedure, router } from '../_core/trpc';
import { z } from 'zod';
import { findNearestZone, applyOrientationCoefficient, applyShadingDiscount } from '../data/zones-metro';

// Géocodage ville → coordonnées GPS
async function geocodeCity(city: string): Promise<{ lat: number; lon: number }> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)},France&format=json&limit=1`;
  
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'UNIALIST/1.0',
    },
  });
  
  if (!response.ok) {
    throw new Error('Service de géocodage indisponible');
  }
  
  const data = await response.json();
  
  if (data.length === 0) {
    throw new Error('Ville introuvable');
  }
  
  return {
    lat: parseFloat(data[0].lat),
    lon: parseFloat(data[0].lon),
  };
}

// Production par kWc selon zone métropolitaine, orientation et ombrage
// Basés sur 15+ ans d'expérience terrain
// Valeurs RÉELLES observées (pas de décote supplémentaire)
function getProductionPerKwc(lat: number, lon: number, orientation: string, hasShading: boolean): number {
  // 1. Trouver la zone métropolitaine la plus proche
  const zone = findNearestZone(lat, lon);
  
  // 2. Appliquer coefficient orientation
  const productionWithOrientation = applyOrientationCoefficient(zone.productionSud, orientation);
  
  // 3. Appliquer décote ombrage si nécessaire (-10%)
  const finalProduction = applyShadingDiscount(productionWithOrientation, hasShading);
  
  return finalProduction;
}

// Dimensionnement optimal
function calculateOptimalSize(params: {
  annualConsumption: number;
  productionPerKwc: number;
  surface: number;
}): { power: number; panels: number } {
  // Objectif : 100% de la consommation annuelle
  // (70% autoconsommation + 30% revente = 100% production)
  const targetProduction = params.annualConsumption;
  
  // Puissance nécessaire
  let optimalPower = targetProduction / params.productionPerKwc;
  
  // Nombre de panneaux (400Wc chacun)
  let panels = Math.round(optimalPower / 0.4);
  
  // Contrainte surface (2m² par panneau)
  const maxPanels = Math.floor(params.surface / 2);
  if (panels > maxPanels) {
    panels = maxPanels;
  }
  
  // Minimum 3 panneaux (1.2 kWc)
  if (panels < 3) {
    panels = 3;
  }
  
  // Puissance finale
  const finalPower = panels * 0.4;
  
  return {
    power: finalPower,
    panels,
  };
}

// Calcul aides
function calculateAides(power: number): {
  primeAutoconsommation: number;
  tvaReduite: number;
  total: number;
} {
  // Prime à l'autoconsommation (2025)
  let primeAutoconsommation = 0;
  if (power <= 3) {
    primeAutoconsommation = power * 300;
  } else if (power <= 9) {
    primeAutoconsommation = 3 * 300 + (power - 3) * 230;
  } else if (power <= 36) {
    primeAutoconsommation = 3 * 300 + 6 * 230 + (power - 9) * 200;
  } else if (power <= 100) {
    primeAutoconsommation = 3 * 300 + 6 * 230 + 27 * 200 + (power - 36) * 100;
  }
  
  // TVA réduite 10% (si ≤ 3 kWc)
  const costHT = (power * 2000) / 1.20;
  const tvaReduite = power <= 3 ? costHT * 0.10 : 0;
  
  return {
    primeAutoconsommation: Math.round(primeAutoconsommation),
    tvaReduite: Math.round(tvaReduite),
    total: Math.round(primeAutoconsommation + tvaReduite),
  };
}

// Calcul autofinancement
function calculateAutofinancement(params: {
  finalPrice: number;
  annualProduction: number;
}): {
  monthlyPayment: number;
  monthlySavings: number;
  cashFlowNet: number;
  isAutofinanced: boolean;
  monthlyBillAfter: number;
} {
  // Mensualité crédit 15 ans à 3%
  const monthlyRate = 0.03 / 12;
  const months = 15 * 12;
  const monthlyPayment = Math.round(
    (params.finalPrice * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1)
  );
  
  // Économies (70% autoconsommation + 30% revente)
  const selfConsumptionKwh = params.annualProduction * 0.70;
  const surplusKwh = params.annualProduction * 0.30;
  
  const savingsAutoconsommation = selfConsumptionKwh * 0.25; // 0.25€/kWh
  const savingsSurplus = surplusKwh * 0.13; // 0.13€/kWh tarif EDF OA
  
  const annualSavings = savingsAutoconsommation + savingsSurplus;
  const monthlySavings = Math.round(annualSavings / 12);
  
  const cashFlowNet = monthlySavings - monthlyPayment;
  const isAutofinanced = cashFlowNet > 0;
  
  // Facture EDF après (30% de la consommation initiale)
  const monthlyBillBefore = Math.round((selfConsumptionKwh / 0.70) * 0.25 / 12);
  const monthlyBillAfter = Math.round(monthlyBillBefore * 0.30);
  
  return {
    monthlyPayment,
    monthlySavings,
    cashFlowNet,
    isAutofinanced,
    monthlyBillAfter,
  };
}

export const pvgisRouter = router({
  calculate: publicProcedure
    .input(
      z.object({
        city: z.string().min(2),
        orientation: z.enum(['sud', 'sud-est', 'sud-ouest', 'est', 'ouest', 'nord']),
        tilt: z.number().min(0).max(90),
        surface: z.number().min(10).max(500),
        monthlyBill: z.number().min(20).max(1000),
        hasShading: z.boolean().optional().default(false),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // 1. Géocodage
        const coords = await geocodeCity(input.city);
        
        // 2. Trouver la zone métropolitaine la plus proche
        const zone = findNearestZone(coords.lat, coords.lon);
        
        // 3. Conversion facture → consommation annuelle
        const annualConsumption = (input.monthlyBill / 0.25) * 12;
        
        // 4. Production par kWc (zone + orientation + ombrage)
        const productionPerKwc = getProductionPerKwc(coords.lat, coords.lon, input.orientation, input.hasShading);
        
        // 5. Dimensionnement optimal
        const sizing = calculateOptimalSize({
          annualConsumption,
          productionPerKwc,
          surface: input.surface,
        });
        
        // 6. Production finale
        const annualProduction = Math.round(sizing.power * productionPerKwc);
        const selfConsumptionKwh = Math.round(annualProduction * 0.70);
        const surplusKwh = Math.round(annualProduction * 0.30);
        
        // 7. Aides
        const aides = calculateAides(sizing.power);
        
        // 8. Coûts
        const costTotal = Math.round(sizing.power * 2000);
        const finalPrice = costTotal - aides.total;
        
        // 9. Autofinancement
        const autofinancement = calculateAutofinancement({
          finalPrice,
          annualProduction,
        });
        
        return {
          location: {
            city: input.city,
            lat: coords.lat,
            lon: coords.lon,
            zone: zone.name,
            zoneCity: zone.city,
            zoneProduction: zone.productionSud,
          },
          installation: {
            power: sizing.power,
            panels: sizing.panels,
            surfaceUsed: sizing.panels * 2,
            orientation: input.orientation,
            tilt: input.tilt,
          },
          production: {
            annualProduction,
            productionPerKwc,
            selfConsumptionKwh,
            selfConsumptionPercent: 70,
            surplusKwh,
            surplusPercent: 30,
          },
          costs: {
            costTotal,
            aides: {
              primeAutoconsommation: aides.primeAutoconsommation,
              tvaReduite: aides.tvaReduite,
              total: aides.total,
            },
            finalPrice,
          },
          autofinancement: {
            monthlyPayment: autofinancement.monthlyPayment,
            monthlySavings: autofinancement.monthlySavings,
            monthlyBillBefore: input.monthlyBill,
            monthlyBillAfter: autofinancement.monthlyBillAfter,
            cashFlowNet: autofinancement.cashFlowNet,
            isAutofinanced: autofinancement.isAutofinanced,
          },
        };
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Erreur lors du calcul');
      }
    }),
});

