/**
 * Test 6 kWc orientation Est
 * Vérification autoconsommation 200€/mois
 */

async function test6kWcEst() {
  console.log('🧪 TEST 6 kWc ORIENTATION EST\n');
  console.log('='.repeat(60));
  
  const lat = 43.2962; // Marseille
  const lon = 5.3700;
  const power = 6; // kWc
  const azimuth = -90; // Est
  const tilt = 30;
  
  console.log('\n📝 PARAMÈTRES:');
  console.log(`   Puissance: ${power} kWc`);
  console.log(`   Orientation: Est`);
  console.log(`   Inclinaison: ${tilt}°`);
  console.log(`   Localisation: Marseille`);
  
  try {
    // Appel PVGIS
    console.log('\n☀️ Appel API PVGIS...');
    const pvgisUrl = `https://re.jrc.ec.europa.eu/api/v5_2/PVcalc?lat=${lat}&lon=${lon}&peakpower=${power}&angle=${tilt}&aspect=${azimuth}&loss=10&outputformat=json`;
    
    const response = await fetch(pvgisUrl);
    const data = await response.json();
    
    const annualProduction = Math.round(data.outputs.totals.fixed.E_y);
    const productionPerKwc = Math.round(annualProduction / power);
    
    console.log(`   ✅ Production annuelle: ${annualProduction.toLocaleString()} kWh/an`);
    console.log(`   ✅ Production par kWc: ${productionPerKwc} kWh/kWc/an`);
    
    // Calcul autoconsommation
    console.log('\n💰 CALCUL AUTOCONSOMMATION:');
    
    // Hypothèse : 70% autoconsommation (standard)
    const selfConsumptionKwh = Math.round(annualProduction * 0.70);
    const surplusKwh = Math.round(annualProduction * 0.30);
    
    console.log(`   Autoconsommation (70%): ${selfConsumptionKwh.toLocaleString()} kWh/an`);
    console.log(`   Surplus (30%): ${surplusKwh.toLocaleString()} kWh/an`);
    
    // Valeur économique
    const savingsAutoconsommation = selfConsumptionKwh * 0.25;
    const savingsSurplus = surplusKwh * 0.13;
    const annualSavings = savingsAutoconsommation + savingsSurplus;
    const monthlySavings = Math.round(annualSavings / 12);
    
    console.log(`\n   Économie autoconsommation: ${Math.round(savingsAutoconsommation)}€/an (${Math.round(savingsAutoconsommation/12)}€/mois)`);
    console.log(`   Revente surplus: ${Math.round(savingsSurplus)}€/an (${Math.round(savingsSurplus/12)}€/mois)`);
    console.log(`   TOTAL: ${Math.round(annualSavings)}€/an (${monthlySavings}€/mois)`);
    
    // Comparaison avec votre chiffre
    console.log('\n📊 COMPARAISON:');
    console.log(`   Votre chiffre: 200€/mois autoconsommation`);
    console.log(`   Mon calcul: ${Math.round(savingsAutoconsommation/12)}€/mois autoconsommation`);
    console.log(`   Écart: ${Math.abs(200 - Math.round(savingsAutoconsommation/12))}€/mois`);
    
    // Pour atteindre 200€/mois d'autoconsommation
    const targetMonthlyAutoconso = 200;
    const targetAnnualAutoconso = targetMonthlyAutoconso * 12; // 2,400€/an
    const requiredKwh = targetAnnualAutoconso / 0.25; // 9,600 kWh/an
    const requiredAutoconsoRate = requiredKwh / annualProduction;
    
    console.log('\n🎯 POUR ATTEINDRE 200€/mois:');
    console.log(`   Il faudrait autoconsommer: ${requiredKwh.toLocaleString()} kWh/an`);
    console.log(`   Soit un taux d'autoconsommation de: ${Math.round(requiredAutoconsoRate * 100)}%`);
    
    if (requiredAutoconsoRate > 1) {
      console.log(`   ⚠️ IMPOSSIBLE : La production totale n'est que de ${annualProduction.toLocaleString()} kWh/an`);
      console.log(`   ⚠️ Il faudrait une installation de ${Math.ceil(requiredKwh / productionPerKwc)} kWc pour atteindre 200€/mois`);
    } else if (requiredAutoconsoRate > 0.85) {
      console.log(`   ⚠️ DIFFICILE : Nécessite un taux d'autoconsommation très élevé (${Math.round(requiredAutoconsoRate * 100)}%)`);
      console.log(`   💡 Standard : 60-80% selon profil de consommation`);
    } else {
      console.log(`   ✅ POSSIBLE avec un bon profil de consommation`);
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ TEST TERMINÉ\n');
    
  } catch (error) {
    console.error('\n❌ ERREUR:', error);
  }
}

test6kWcEst();

