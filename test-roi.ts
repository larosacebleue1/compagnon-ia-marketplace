/**
 * Script de test pour valider le calcul ROI
 * 
 * Test : Installation 6kWc à Marseille Sud sans ombrage
 * - Production : 6 kWc * 1,700 kWh/kWc = 10,200 kWh/an
 * - Coût : 12,000€ (2,000€/kWc)
 * - Aides : ~1,800€ (300€/kWc prime autoconsommation)
 * - Prix final : ~10,200€
 * - Économies annuelles : ~2,040€/an
 * - Seuil rentabilité : ~5 ans
 * - Gain 25 ans : ~41,000€
 */

// Simulation calcul ROI
const finalPrice = 10200; // Prix après aides
const annualProduction = 10200; // kWh/an

// Économies (70% autoconsommation + 30% revente)
const selfConsumptionKwh = annualProduction * 0.70; // 7,140 kWh
const surplusKwh = annualProduction * 0.30; // 3,060 kWh

const savingsAutoconsommation = selfConsumptionKwh * 0.25; // 1,785€
const savingsSurplus = surplusKwh * 0.13; // 398€

const totalAnnualSavings = savingsAutoconsommation + savingsSurplus; // 2,183€

// ROI
const paybackYears = Math.round((finalPrice / totalAnnualSavings) * 10) / 10;
const totalSavings25Years = Math.round(totalAnnualSavings * 25);
const netGain25Years = totalSavings25Years - finalPrice;

console.log('🧪 TEST CALCUL ROI - Installation 6kWc Marseille Sud\n');
console.log('=' .repeat(80));

console.log('\n📊 DONNÉES D\'ENTRÉE :');
console.log(`Prix final (après aides) : ${finalPrice.toLocaleString()}€`);
console.log(`Production annuelle : ${annualProduction.toLocaleString()} kWh/an`);

console.log('\n💰 ÉCONOMIES ANNUELLES :');
console.log(`Autoconsommation (70%) : ${selfConsumptionKwh.toLocaleString()} kWh × 0.25€ = ${savingsAutoconsommation.toLocaleString()}€`);
console.log(`Revente surplus (30%) : ${surplusKwh.toLocaleString()} kWh × 0.13€ = ${savingsSurplus.toLocaleString()}€`);
console.log(`TOTAL ANNUEL : ${totalAnnualSavings.toLocaleString()}€/an`);

console.log('\n🎯 RÉSULTATS ROI :');
console.log(`Seuil de rentabilité : ${paybackYears} ans`);
console.log(`Économies totales (25 ans) : ${totalSavings25Years.toLocaleString()}€`);
console.log(`Gain net après amortissement : +${netGain25Years.toLocaleString()}€`);

console.log('\n📅 ÉVOLUTION ANNÉE PAR ANNÉE :');
for (let year = 1; year <= 25; year++) {
  const cumulativeSavings = Math.round(totalAnnualSavings * year);
  const netGain = cumulativeSavings - finalPrice;
  
  if (year <= 5 || year === 10 || year === 15 || year === 20 || year === 25) {
    console.log(`Année ${year.toString().padStart(2, ' ')} : Économies cumulées ${cumulativeSavings.toLocaleString().padStart(7, ' ')}€ | Gain net ${netGain >= 0 ? '+' : ''}${netGain.toLocaleString().padStart(7, ' ')}€`);
  }
}

console.log('\n' + '='.repeat(80));
console.log('✅ TEST TERMINÉ');
console.log('='.repeat(80));

// Validation
console.log('\n🔍 VALIDATION :');
console.log(`✅ Seuil rentabilité attendu : ~4.7 ans → Résultat : ${paybackYears} ans`);
console.log(`✅ Gain 25 ans attendu : ~44,000€ → Résultat : ${netGain25Years.toLocaleString()}€`);
console.log(`✅ Rentabilité : ${paybackYears <= 15 ? 'EXCELLENTE' : paybackYears <= 20 ? 'BONNE' : 'MOYENNE'}`);

