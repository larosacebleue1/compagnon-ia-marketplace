/**
 * Grille tarifaire marketplace installateurs
 * 
 * Prix fixes installations photovoltaïques
 * Commission 6% du prix installation
 */

export interface PricingTier {
  power: number; // kWc
  installationPrice: number; // Prix installation TTC
  leadCommission: number; // Commission 6%
  description: string;
}

export const PRICING_GRID: PricingTier[] = [
  {
    power: 3,
    installationPrice: 5500,
    leadCommission: 330, // 6% de 5,500€
    description: "Installation 3 kWc - Idéale pour petite maison",
  },
  {
    power: 6,
    installationPrice: 11500,
    leadCommission: 690, // 6% de 11,500€
    description: "Installation 6 kWc - Idéale pour maison moyenne",
  },
  {
    power: 9,
    installationPrice: 15000,
    leadCommission: 900, // 6% de 15,000€
    description: "Installation 9 kWc - Idéale pour grande maison",
  },
];

/**
 * Trouve le prix grille le plus proche de la puissance calculée
 */
export function getClosestPricingTier(calculatedPower: number): PricingTier {
  // Trouver la tier la plus proche
  let closest = PRICING_GRID[0];
  let minDiff = Math.abs(calculatedPower - PRICING_GRID[0].power);
  
  for (const tier of PRICING_GRID) {
    const diff = Math.abs(calculatedPower - tier.power);
    if (diff < minDiff) {
      minDiff = diff;
      closest = tier;
    }
  }
  
  return closest;
}

/**
 * Calcule le prix exact selon la puissance
 * Interpolation linéaire entre les paliers
 */
export function calculateExactPrice(power: number): {
  installationPrice: number;
  leadCommission: number;
  tier: PricingTier;
} {
  // Arrondir à la tier la plus proche
  const tier = getClosestPricingTier(power);
  
  return {
    installationPrice: tier.installationPrice,
    leadCommission: tier.leadCommission,
    tier,
  };
}

/**
 * Vérifie si un prix est conforme à la grille (±5% tolérance)
 */
export function isPriceCompliant(power: number, proposedPrice: number): boolean {
  const { installationPrice } = calculateExactPrice(power);
  const tolerance = installationPrice * 0.05; // 5% tolérance
  
  return Math.abs(proposedPrice - installationPrice) <= tolerance;
}

