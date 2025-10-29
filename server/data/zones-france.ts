/**
 * Zones géographiques France - Production photovoltaïque
 * Chiffres terrain expert (25 ans d'expérience)
 * Production en kWh/kWc/an pour orientation plein Sud
 */

export interface Zone {
  id: number;
  name: string;
  production: number; // kWh/kWc/an (plein Sud)
  departments: string[];
}

export const ZONES_FRANCE: Zone[] = [
  {
    id: 1,
    name: 'Nord',
    production: 950,
    departments: [
      '02', '08', '51', '54', '55', '57', '59', '60', '62', '67', '68', '80', '88', // Grand-Est + Hauts-de-France
      '14', '27', '50', '61', '76', // Normandie
      '22', '29', '35', '56', // Bretagne
    ],
  },
  {
    id: 2,
    name: 'Île-de-France',
    production: 1150,
    departments: [
      '75', '77', '78', '91', '92', '93', '94', '95', // Île-de-France
    ],
  },
  {
    id: 3,
    name: 'Centre',
    production: 1250,
    departments: [
      '18', '28', '36', '37', '41', '45', // Centre-Val-de-Loire
      '21', '25', '39', '58', '70', '71', '89', '90', // Bourgogne-Franche-Comté
      '44', '49', '53', '72', '85', // Pays-de-la-Loire
    ],
  },
  {
    id: 4,
    name: 'Sud-Ouest',
    production: 1450,
    departments: [
      '09', '11', '12', '30', '31', '32', '34', '46', '48', '65', '66', '81', '82', // Occitanie
      '16', '17', '19', '23', '24', '33', '40', '47', '64', '79', '86', '87', // Nouvelle-Aquitaine
    ],
  },
  {
    id: 5,
    name: 'Sud-Est',
    production: 1600,
    departments: [
      '01', '03', '07', '15', '26', '38', '42', '43', '63', '69', '73', '74', // Auvergne-Rhône-Alpes
      '04', '05', '06', '13', '83', '84', // PACA
      '2A', '2B', // Corse
    ],
  },
];

/**
 * Trouve la zone géographique à partir du code département
 */
export function getZoneByDepartment(department: string): Zone {
  const zone = ZONES_FRANCE.find(z => z.departments.includes(department));
  
  if (!zone) {
    // Par défaut, retourner Zone Centre (conservateur)
    return ZONES_FRANCE[2];
  }
  
  return zone;
}

/**
 * Applique le coefficient d'orientation à la production de base
 */
export function applyOrientationCoefficient(
  baseProduction: number,
  orientation: string
): number {
  const coefficients: Record<string, number> = {
    'sud': 1.0,
    'sud-est': 0.875, // -12.5%
    'sud-ouest': 0.875, // -12.5%
    'est': 0.8125, // -18.75%
    'ouest': 0.8125, // -18.75%
    'nord': 0.5, // -50%
  };
  
  const coefficient = coefficients[orientation] || 1.0;
  return Math.round(baseProduction * coefficient);
}

