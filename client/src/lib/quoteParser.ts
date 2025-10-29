/**
 * Parse une réponse IA pour extraire les données de devis photovoltaïque
 */
export interface ParsedQuote {
  location: string;
  region: string;
  sunlight: number;
  power: number;
  panels: number;
  surface: number;
  annualProduction: number;
  selfConsumptionPercent: number;
  selfConsumptionKwh: number;
  surplusKwh: number;
  costTotal: number;
  aideMaPrimeRenov: number;
  aideCEE: number;
  aideTVA: number;
  totalAides: number;
  finalPrice: number;
  annualSavings: number;
  savingsSelfConsumption: number;
  savingsSurplus: number;
  roi: number;
  gain25Years: number;
  panelBrand: string;
  inverterBrand: string;
}

function extractNumber(text: string, pattern: RegExp): number {
  const match = text.match(pattern);
  if (!match) return 0;
  const numStr = match[1].replace(/[^\d.,-]/g, '').replace(',', '.');
  return parseFloat(numStr) || 0;
}

function extractText(text: string, pattern: RegExp): string {
  const match = text.match(pattern);
  return match ? match[1].trim() : '';
}

export function parseQuoteFromMessage(message: string): ParsedQuote | null {
  // Vérifier si le message contient un devis photovoltaïque
  if (!message.includes('☀️') && !message.includes('DEVIS PHOTOVOLTAÏQUE')) {
    return null;
  }

  try {
    // Patterns d'extraction
    const patterns = {
      location: /\*\*Localisation\s*:\*\*\s*([^(]+)/i,
      region: /\(([^)]+)\)/,
      sunlight: /\*\*Ensoleillement\s*:\*\*\s*([\d.,]+)/i,
      power: /\*\*Puissance\s*:\*\*\s*([\d.,]+)\s*kWc/i,
      panels: /\((\d+)\s*panneaux/i,
      surface: /\*\*Surface\s*(?:nécessaire)?\s*:\*\*\s*([\d.,]+)\s*m/i,
      annualProduction: /\*\*Production\s*annuelle\s*:\*\*\s*([\d.,\s]+)\s*kWh/i,
      selfConsumptionPercent: /\*\*Autoconsommation\s*(?:estimée)?\s*:\*\*\s*(\d+)%/i,
      selfConsumptionKwh: /Autoconsommation\s*(?:estimée)?\s*:\*\*\s*\d+%\s*\(([\d.,\s]+)\s*kWh/i,
      surplusKwh: /\*\*Revente\s*surplus\s*:\*\*\s*([\d.,\s]+)\s*kWh/i,
      costTotal: /\*\*Coût\s*installation\s*:\*\*\s*([\d.,\s]+)\s*€/i,
      aideMaPrimeRenov: /MaPrimeRénov'\s*:\s*([\d.,\s]+)\s*€/i,
      aideCEE: /CEE[^:]*:\s*([\d.,\s]+)\s*€/i,
      aideTVA: /TVA\s*réduite[^:]*:\s*([\d.,\s]+)\s*€/i,
      totalAides: /\*\*Total\s*aides\s*:\s*([\d.,\s]+)\s*€/i,
      finalPrice: /\*\*Prix\s*final\s*après\s*aides\s*:\s*([\d.,\s]+)\s*€/i,
      annualSavings: /\*\*Économies\s*annuelles\s*:\s*([\d.,\s]+)\s*€/i,
      savingsSelfConsumption: /-\s*Autoconsommation\s*:\s*([\d.,\s]+)\s*€/i,
      savingsSurplus: /-\s*Revente\s*surplus\s*:\s*([\d.,\s]+)\s*€/i,
      roi: /\*\*ROI[^:]*:\s*([\d.,]+)\s*ans/i,
      gain25Years: /\*\*Gain\s*sur\s*25\s*ans\s*:\s*([\d.,\s]+)\s*€/i,
      panelBrand: /Panneaux\s*:\s*([^\d]+?)\s*\d+Wc/i,
      inverterBrand: /Onduleur\s*:\s*([^(]+?)\s*\(/i,
    };

    const location = extractText(message, patterns.location);
    const region = extractText(message, patterns.region);
    
    if (!location) {
      return null;
    }

    return {
      location,
      region,
      sunlight: extractNumber(message, patterns.sunlight),
      power: extractNumber(message, patterns.power),
      panels: extractNumber(message, patterns.panels),
      surface: extractNumber(message, patterns.surface),
      annualProduction: extractNumber(message, patterns.annualProduction),
      selfConsumptionPercent: extractNumber(message, patterns.selfConsumptionPercent),
      selfConsumptionKwh: extractNumber(message, patterns.selfConsumptionKwh),
      surplusKwh: extractNumber(message, patterns.surplusKwh),
      costTotal: extractNumber(message, patterns.costTotal),
      aideMaPrimeRenov: extractNumber(message, patterns.aideMaPrimeRenov),
      aideCEE: extractNumber(message, patterns.aideCEE),
      aideTVA: extractNumber(message, patterns.aideTVA),
      totalAides: extractNumber(message, patterns.totalAides),
      finalPrice: extractNumber(message, patterns.finalPrice),
      annualSavings: extractNumber(message, patterns.annualSavings),
      savingsSelfConsumption: extractNumber(message, patterns.savingsSelfConsumption),
      savingsSurplus: extractNumber(message, patterns.savingsSurplus),
      roi: extractNumber(message, patterns.roi),
      gain25Years: extractNumber(message, patterns.gain25Years),
      panelBrand: extractText(message, patterns.panelBrand) || 'Panneaux Premium',
      inverterBrand: extractText(message, patterns.inverterBrand) || 'Onduleur Premium',
    };
  } catch (error) {
    console.error('Erreur lors du parsing du devis:', error);
    return null;
  }
}

/**
 * Vérifie si un message contient un devis
 */
export function containsQuote(message: string): boolean {
  return message.includes('☀️ **DEVIS PHOTOVOLTAÏQUE') || 
         message.includes('DEVIS PHOTOVOLTAÏQUE PROFESSIONNEL');
}

