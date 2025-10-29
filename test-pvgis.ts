/**
 * Test automatique API PVGIS
 * 
 * Ce script teste l'API PVGIS avec des données réelles
 * et affiche les résultats complets.
 */

// Simuler l'appel API PVGIS
async function testPVGIS() {
  console.log('🧪 TEST API PVGIS - Calculateur Photovoltaïque\n');
  console.log('='.repeat(60));
  
  // Données de test (Marseille)
  const testData = {
    city: 'Marseille',
    orientation: 'sud' as const,
    tilt: 30,
    surface: 50,
    monthlyBill: 150,
  };
  
  console.log('\n📝 DONNÉES DE TEST:');
  console.log(`   Ville: ${testData.city}`);
  console.log(`   Orientation: ${testData.orientation}`);
  console.log(`   Inclinaison: ${testData.tilt}°`);
  console.log(`   Surface: ${testData.surface} m²`);
  console.log(`   Facture mensuelle: ${testData.monthlyBill}€`);
  console.log('\n' + '='.repeat(60));
  
  try {
    // 1. Géocodage
    console.log('\n🌍 ÉTAPE 1: Géocodage...');
    const geocodeUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(testData.city)},France&format=json&limit=1`;
    const geocodeResponse = await fetch(geocodeUrl, {
      headers: { 'User-Agent': 'UNIALIST/1.0' },
    });
    const geocodeData = await geocodeResponse.json();
    
    if (geocodeData.length === 0) {
      throw new Error('Ville introuvable');
    }
    
    const lat = parseFloat(geocodeData[0].lat);
    const lon = parseFloat(geocodeData[0].lon);
    
    console.log(`   ✅ Coordonnées: ${lat.toFixed(4)}, ${lon.toFixed(4)}`);
    
    // 2. Conversion facture → consommation
    console.log('\n⚡ ÉTAPE 2: Calcul consommation...');
    const annualConsumption = (testData.monthlyBill / 0.25) * 12;
    console.log(`   ✅ Consommation annuelle: ${annualConsumption.toLocaleString()} kWh/an`);
    
    // 3. Appel PVGIS (1 kWc pour avoir production par kWc)
    console.log('\n☀️ ÉTAPE 3: Appel API PVGIS (1 kWc)...');
    const orientationMap: Record<string, number> = {
      'sud': 0,
      'sud-est': -45,
      'sud-ouest': 45,
      'est': -90,
      'ouest': 90,
      'nord': 180,
    };
    const azimuth = orientationMap[testData.orientation];
    
    const pvgisUrl1kWc = `https://re.jrc.ec.europa.eu/api/v5_2/PVcalc?lat=${lat}&lon=${lon}&peakpower=1&angle=${testData.tilt}&aspect=${azimuth}&loss=10&outputformat=json`;
    
    const pvgisResponse1kWc = await fetch(pvgisUrl1kWc);
    const pvgisData1kWc = await pvgisResponse1kWc.json();
    
    if (!pvgisData1kWc.outputs || !pvgisData1kWc.outputs.totals || !pvgisData1kWc.outputs.totals.fixed) {
      throw new Error('Réponse PVGIS invalide');
    }
    
    const productionPerKwc = pvgisData1kWc.outputs.totals.fixed.E_y;
    console.log(`   ✅ Production: ${Math.round(productionPerKwc)} kWh/kWc/an`);
    console.log(`   ✅ Irradiation: ${Math.round(pvgisData1kWc.outputs.totals.fixed.H_y)} kWh/m²/an`);
    
    // 4. Dimensionnement optimal
    console.log('\n🔧 ÉTAPE 4: Dimensionnement optimal...');
    const targetProduction = annualConsumption; // 100% de la consommation
    let optimalPower = targetProduction / productionPerKwc;
    let panels = Math.round(optimalPower / 0.4);
    
    // Contrainte surface
    const maxPanels = Math.floor(testData.surface / 2);
    if (panels > maxPanels) {
      panels = maxPanels;
    }
    if (panels < 3) {
      panels = 3;
    }
    
    const finalPower = panels * 0.4;
    console.log(`   ✅ Puissance optimale: ${finalPower} kWc`);
    console.log(`   ✅ Nombre de panneaux: ${panels}`);
    console.log(`   ✅ Surface utilisée: ${panels * 2} m²`);
    
    // 5. Production finale
    console.log('\n📊 ÉTAPE 5: Production finale...');
    const pvgisUrlFinal = `https://re.jrc.ec.europa.eu/api/v5_2/PVcalc?lat=${lat}&lon=${lon}&peakpower=${finalPower}&angle=${testData.tilt}&aspect=${azimuth}&loss=10&outputformat=json`;
    
    const pvgisResponseFinal = await fetch(pvgisUrlFinal);
    const pvgisDataFinal = await pvgisResponseFinal.json();
    
    const annualProduction = Math.round(pvgisDataFinal.outputs.totals.fixed.E_y);
    const selfConsumptionKwh = Math.round(annualProduction * 0.70);
    const surplusKwh = Math.round(annualProduction * 0.30);
    
    console.log(`   ✅ Production annuelle: ${annualProduction.toLocaleString()} kWh/an`);
    console.log(`   ✅ Autoconsommation (70%): ${selfConsumptionKwh.toLocaleString()} kWh/an`);
    console.log(`   ✅ Surplus (30%): ${surplusKwh.toLocaleString()} kWh/an`);
    
    // 6. Aides
    console.log('\n💰 ÉTAPE 6: Calcul aides...');
    let primeAutoconsommation = 0;
    if (finalPower <= 3) {
      primeAutoconsommation = finalPower * 300;
    } else if (finalPower <= 9) {
      primeAutoconsommation = 3 * 300 + (finalPower - 3) * 230;
    }
    
    const costHT = finalPower * 2000 / 1.20;
    const tvaReduite = finalPower <= 3 ? costHT * 0.10 : 0;
    const totalAides = Math.round(primeAutoconsommation + tvaReduite);
    
    console.log(`   ✅ Prime autoconsommation: ${Math.round(primeAutoconsommation).toLocaleString()}€`);
    if (tvaReduite > 0) {
      console.log(`   ✅ TVA réduite 10%: ${Math.round(tvaReduite).toLocaleString()}€`);
    }
    console.log(`   ✅ Total aides: ${totalAides.toLocaleString()}€`);
    
    // 7. Coûts
    console.log('\n💵 ÉTAPE 7: Calcul coûts...');
    const costTotal = Math.round(finalPower * 2000);
    const finalPrice = costTotal - totalAides;
    
    console.log(`   ✅ Coût installation TTC: ${costTotal.toLocaleString()}€`);
    console.log(`   ✅ Prix final (après aides): ${finalPrice.toLocaleString()}€`);
    
    // 8. Autofinancement
    console.log('\n🎯 ÉTAPE 8: Calcul autofinancement...');
    
    // Mensualité crédit 15 ans à 3%
    const monthlyRate = 0.03 / 12;
    const months = 15 * 12;
    const monthlyPayment = Math.round((finalPrice * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1));
    
    // Économies
    const savingsAutoconsommation = selfConsumptionKwh * 0.25;
    const savingsSurplus = surplusKwh * 0.13;
    const annualSavings = savingsAutoconsommation + savingsSurplus;
    const monthlySavings = Math.round(annualSavings / 12);
    
    const cashFlowNet = monthlySavings - monthlyPayment;
    const isAutofinanced = cashFlowNet > 0;
    
    const monthlyBillAfter = Math.round(testData.monthlyBill * 0.30);
    
    console.log(`   ✅ Mensualité crédit (15 ans, 3%): ${monthlyPayment}€/mois`);
    console.log(`   ✅ Économie mensuelle: ${monthlySavings}€/mois`);
    console.log(`   ✅ Facture EDF avant: ${testData.monthlyBill}€/mois`);
    console.log(`   ✅ Facture EDF après: ${monthlyBillAfter}€/mois`);
    console.log(`   ✅ Cash-flow net: ${cashFlowNet > 0 ? '+' : ''}${cashFlowNet}€/mois`);
    
    // 9. Résultat final
    console.log('\n' + '='.repeat(60));
    if (isAutofinanced) {
      console.log('\n✅ ✅ ✅ INSTALLATION AUTOFINANCÉE ✅ ✅ ✅');
      console.log(`\n🎉 Vous économisez ${cashFlowNet}€/mois dès le 1er mois !`);
    } else {
      console.log('\n❌ ❌ ❌ NON AUTOFINANCÉE ❌ ❌ ❌');
      console.log(`\n⚠️ Surcoût mensuel: ${Math.abs(cashFlowNet)}€/mois`);
    }
    console.log('\n' + '='.repeat(60));
    
    // 10. Résumé
    console.log('\n📋 RÉSUMÉ:');
    console.log(`   Installation: ${finalPower} kWc (${panels} panneaux)`);
    console.log(`   Production: ${annualProduction.toLocaleString()} kWh/an`);
    console.log(`   Coût total: ${costTotal.toLocaleString()}€`);
    console.log(`   Aides: ${totalAides.toLocaleString()}€`);
    console.log(`   Prix final: ${finalPrice.toLocaleString()}€`);
    console.log(`   Mensualité: ${monthlyPayment}€/mois`);
    console.log(`   Économie: ${monthlySavings}€/mois`);
    console.log(`   Cash-flow: ${cashFlowNet > 0 ? '+' : ''}${cashFlowNet}€/mois`);
    console.log(`   Autofinancé: ${isAutofinanced ? '✅ OUI' : '❌ NON'}`);
    
    console.log('\n✅ TEST RÉUSSI !\n');
    
  } catch (error) {
    console.error('\n❌ ERREUR:', error);
    process.exit(1);
  }
}

// Exécuter le test
testPVGIS();

