/**
 * Test avec chiffres terrain expert
 */

function testTerrain() {
  console.log('🧪 TEST CHIFFRES TERRAIN EXPERT\n');
  console.log('='.repeat(70));
  
  const orientations = ['sud', 'sud-est', 'sud-ouest', 'est', 'ouest'];
  const power = 6; // kWc
  const monthlyBill = 150; // €/mois
  const annualConsumption = (monthlyBill / 0.25) * 12; // 7,200 kWh/an
  
  console.log('\n📝 PARAMÈTRES:');
  console.log(`   Installation: ${power} kWc`);
  console.log(`   Facture mensuelle: ${monthlyBill}€`);
  console.log(`   Consommation annuelle: ${annualConsumption.toLocaleString()} kWh/an`);
  console.log('\n' + '='.repeat(70));
  
  const productionBase: Record<string, number> = {
    'sud': 1600,
    'sud-est': 1400,
    'sud-ouest': 1400,
    'est': 1300,
    'ouest': 1300,
  };
  
  orientations.forEach(orientation => {
    const productionPerKwc = productionBase[orientation];
    const annualProduction = power * productionPerKwc;
    
    // Autoconsommation 70%
    const selfConsumptionKwh = Math.round(annualProduction * 0.70);
    const surplusKwh = Math.round(annualProduction * 0.30);
    
    // Économies
    const savingsAutoconsommation = selfConsumptionKwh * 0.25;
    const savingsSurplus = surplusKwh * 0.13;
    const annualSavings = savingsAutoconsommation + savingsSurplus;
    const monthlySavings = Math.round(annualSavings / 12);
    
    // Coûts
    const costTotal = power * 2000; // 12,000€
    let primeAutoconsommation = 0;
    if (power <= 3) {
      primeAutoconsommation = power * 300;
    } else if (power <= 9) {
      primeAutoconsommation = 3 * 300 + (power - 3) * 230;
    }
    const finalPrice = costTotal - primeAutoconsommation;
    
    // Mensualité crédit 15 ans à 3%
    const monthlyRate = 0.03 / 12;
    const months = 15 * 12;
    const monthlyPayment = Math.round(
      (finalPrice * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1)
    );
    
    const cashFlowNet = monthlySavings - monthlyPayment;
    const isAutofinanced = cashFlowNet > 0;
    
    console.log(`\n${orientation.toUpperCase()} (${productionPerKwc} kWh/kWc/an):`);
    console.log(`   Production: ${annualProduction.toLocaleString()} kWh/an`);
    console.log(`   Autoconso: ${selfConsumptionKwh.toLocaleString()} kWh (${Math.round(savingsAutoconsommation)}€/an)`);
    console.log(`   Surplus: ${surplusKwh.toLocaleString()} kWh (${Math.round(savingsSurplus)}€/an)`);
    console.log(`   Économie: ${monthlySavings}€/mois`);
    console.log(`   Mensualité: ${monthlyPayment}€/mois`);
    console.log(`   Cash-flow: ${cashFlowNet > 0 ? '+' : ''}${cashFlowNet}€/mois ${isAutofinanced ? '✅ AUTOFINANCÉ' : '❌ NON AUTOFINANCÉ'}`);
  });
  
  console.log('\n' + '='.repeat(70));
  console.log('\n✅ TEST TERMINÉ\n');
}

testTerrain();

