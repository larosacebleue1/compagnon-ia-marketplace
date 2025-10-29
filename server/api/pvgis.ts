import { publicProcedure, router } from '../_core/trpc';
import { z } from 'zod';
import { getZoneByDepartment, applyOrientationCoefficient } from '../data/zones-france';

// Géocodage ville → coordonnées GPS + département
async function geocodeCity(city: string): Promise<{ lat: number; lon: number; department: string; zoneName: string; zoneProduction: number }> {
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
  
  // Extraire le code département depuis l'adresse
  const address = data[0].address || {};
  const postcode = address.postcode || '';
  const department = postcode.substring(0, 2);
  
  // Trouver la zone géographique
  const zone = getZoneByDepartment(department);
  
  return {
    lat: parseFloat(data[0].lat),
    lon: parseFloat(data[0].lon),
    department,
    zoneName: zone.name,
    zoneProduction: zone.production,
  };
}

// Production par kWc selon zone et orientation
// Basés sur 25 ans d'expérience terrain
// Incluent déjà les pertes réelles (salissure, câblage, micro-ombres, etc.)
function getProductionPerKwc(zoneProduction: number, orientation: string): number {
  return applyOrientationCoefficient(zoneProduction, orientation);
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
      })
    )
    .mutation(async ({ input }) => {
      try {
        // 1. Géocodage
        const coords = await geocodeCity(input.city);
        
        // 2. Conversion facture → consommation annuelle
        const annualConsumption = (input.monthlyBill / 0.25) * 12;
        
        // 3. Production par kWc (zone + orientation)
        const productionPerKwc = getProductionPerKwc(coords.zoneProduction, input.orientation);
        
        // 4. Dimensionnement optimal
        const sizing = calculateOptimalSize({
          annualConsumption,
          productionPerKwc,
          surface: input.surface,
        });
        
        // 5. Production finale
        const annualProduction = Math.round(sizing.power * productionPerKwc);
        const selfConsumptionKwh = Math.round(annualProduction * 0.70);
        const surplusKwh = Math.round(annualProduction * 0.30);
        
        // 6. Aides
        const aides = calculateAides(sizing.power);
        
        // 7. Coûts
        const costTotal = Math.round(sizing.power * 2000);
        const finalPrice = costTotal - aides.total;
        
        // 8. Autofinancement
        const autofinancement = calculateAutofinancement({
          finalPrice,
          annualProduction,
        });
        
        return {
          location: {
            city: input.city,
            lat: coords.lat,
            lon: coords.lon,
            department: coords.department,
            zone: coords.zoneName,
            zoneProduction: coords.zoneProduction,
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

