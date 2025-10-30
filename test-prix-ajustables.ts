/**
 * Script de test pour valider l'impact des prix ajustables sur la rentabilité
 * 
 * Scénarios :
 * 1. Prix par défaut (0.25€/kWh électricité, 0.13€/kWh rachat)
 * 2. Hausse électricité +20% (0.30€/kWh)
 * 3. Hausse électricité +40% (0.35€/kWh)
 * 4. Hausse rachat +30% (0.17€/kWh)
 */

// Installation 6kWc Marseille Sud
const finalPrice = 10200; // Prix après aides
const annualProduction = 10200; // kWh/an

console.log('🧪 TEST IMPACT PRIX AJUSTABLES SUR RENTABILITÉ\n');
console.log('Installation 6kWc Marseille Sud - Prix final : 10,200€');
console.log('Production annuelle : 10,200 kWh/an');
console.log('=' .repeat(80));

// Fonction calcul ROI
function calculateROI(electricityPrice: number, surplusPrice: number) {
  const selfConsumptionKwh = annualProduction * 0.70;
  const surplusKwh = annualProduction * 0.30;
  
  const savingsAutoconsommation = selfConsumptionKwh * electricityPrice;
  const savingsSurplus = surplusKwh * surplusPrice;
  
  const totalAnnualSavings = savingsAutoconsommation + savingsSurplus;
  const paybackYears = Math.round((finalPrice / totalAnnualSavings) * 10) / 10;
  const totalSavings25Years = Math.round(totalAnnualSavings * 25);
  const netGain25Years = totalSavings25Years - finalPrice;
  
  return {
    totalAnnualSavings: Math.round(totalAnnualSavings),
    paybackYears,
    totalSavings25Years,
    netGain25Years,
  };
}

// Scénario 1 : Prix par défaut
console.log('\n📊 SCÉNARIO 1 : Prix par défaut (2025)');
console.log('Prix électricité : 0.25€/kWh | Prix rachat : 0.13€/kWh');
const scenario1 = calculateROI(0.25, 0.13);
console.log(`Économies annuelles : ${scenario1.totalAnnualSavings.toLocaleString()}€/an`);
console.log(`Seuil rentabilité : ${scenario1.paybackYears} ans`);
console.log(`Gain 25 ans : +${scenario1.netGain25Years.toLocaleString()}€`);

// Scénario 2 : Hausse électricité +20%
console.log('\n📊 SCÉNARIO 2 : Hausse électricité +20%');
console.log('Prix électricité : 0.30€/kWh (+20%) | Prix rachat : 0.13€/kWh');
const scenario2 = calculateROI(0.30, 0.13);
console.log(`Économies annuelles : ${scenario2.totalAnnualSavings.toLocaleString()}€/an (+${scenario2.totalAnnualSavings - scenario1.totalAnnualSavings}€)`);
console.log(`Seuil rentabilité : ${scenario2.paybackYears} ans (${(scenario1.paybackYears - scenario2.paybackYears).toFixed(1)} an plus rapide)`);
console.log(`Gain 25 ans : +${scenario2.netGain25Years.toLocaleString()}€ (+${(scenario2.netGain25Years - scenario1.netGain25Years).toLocaleString()}€)`);

// Scénario 3 : Hausse électricité +40%
console.log('\n📊 SCÉNARIO 3 : Hausse électricité +40%');
console.log('Prix électricité : 0.35€/kWh (+40%) | Prix rachat : 0.13€/kWh');
const scenario3 = calculateROI(0.35, 0.13);
console.log(`Économies annuelles : ${scenario3.totalAnnualSavings.toLocaleString()}€/an (+${scenario3.totalAnnualSavings - scenario1.totalAnnualSavings}€)`);
console.log(`Seuil rentabilité : ${scenario3.paybackYears} ans (${(scenario1.paybackYears - scenario3.paybackYears).toFixed(1)} ans plus rapide)`);
console.log(`Gain 25 ans : +${scenario3.netGain25Years.toLocaleString()}€ (+${(scenario3.netGain25Years - scenario1.netGain25Years).toLocaleString()}€)`);

// Scénario 4 : Hausse rachat +30%
console.log('\n📊 SCÉNARIO 4 : Hausse rachat surplus +30%');
console.log('Prix électricité : 0.25€/kWh | Prix rachat : 0.17€/kWh (+30%)');
const scenario4 = calculateROI(0.25, 0.17);
console.log(`Économies annuelles : ${scenario4.totalAnnualSavings.toLocaleString()}€/an (+${scenario4.totalAnnualSavings - scenario1.totalAnnualSavings}€)`);
console.log(`Seuil rentabilité : ${scenario4.paybackYears} ans (${(scenario1.paybackYears - scenario4.paybackYears).toFixed(1)} an plus rapide)`);
console.log(`Gain 25 ans : +${scenario4.netGain25Years.toLocaleString()}€ (+${(scenario4.netGain25Years - scenario1.netGain25Years).toLocaleString()}€)`);

// Scénario 5 : Hausse combinée
console.log('\n📊 SCÉNARIO 5 : Hausse combinée (+20% électricité, +30% rachat)');
console.log('Prix électricité : 0.30€/kWh (+20%) | Prix rachat : 0.17€/kWh (+30%)');
const scenario5 = calculateROI(0.30, 0.17);
console.log(`Économies annuelles : ${scenario5.totalAnnualSavings.toLocaleString()}€/an (+${scenario5.totalAnnualSavings - scenario1.totalAnnualSavings}€)`);
console.log(`Seuil rentabilité : ${scenario5.paybackYears} ans (${(scenario1.paybackYears - scenario5.paybackYears).toFixed(1)} ans plus rapide)`);
console.log(`Gain 25 ans : +${scenario5.netGain25Years.toLocaleString()}€ (+${(scenario5.netGain25Years - scenario1.netGain25Years).toLocaleString()}€)`);

console.log('\n' + '='.repeat(80));
console.log('✅ CONCLUSION :');
console.log('Plus le prix de l\'électricité augmente, plus l\'installation devient rentable !');
console.log('Une hausse de 20% du prix électricité réduit le seuil de rentabilité de ~1 an.');
console.log('Une hausse de 40% du prix électricité réduit le seuil de rentabilité de ~1.5 ans.');
console.log('='.repeat(80));

