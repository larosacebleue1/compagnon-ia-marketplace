/**
 * Script de test pour valider les 20 zones métropolitaines et la décote ombrage
 * 
 * Tests :
 * 1. Marseille Sud sans ombrage → 1,700 kWh/kWc
 * 2. Marseille Sud avec ombrage → 1,530 kWh/kWc (-10%)
 * 3. Lille Sud sans ombrage → 1,000 kWh/kWc
 * 4. Paris Sud sans ombrage → 1,200 kWh/kWc
 * 5. Lyon Sud sans ombrage → 1,450 kWh/kWc
 * 6. Toulouse Sud sans ombrage → 1,500 kWh/kWc
 * 7. Marseille Sud-Est sans ombrage → 1,488 kWh/kWc (87.5% de 1,700)
 * 8. Marseille Est sans ombrage → 1,381 kWh/kWc (81.25% de 1,700)
 */

import { findNearestZone, applyOrientationCoefficient, applyShadingDiscount } from './server/data/zones-metro';

console.log('🧪 TEST DES 20 ZONES MÉTROPOLITAINES + DÉCOTE OMBRAGE\n');
console.log('=' .repeat(80));

// Test 1 : Marseille Sud sans ombrage
console.log('\n📍 TEST 1 : Marseille Sud sans ombrage');
const marseilleCoords = { lat: 43.2965, lon: 5.3698 };
const zoneMarseille = findNearestZone(marseilleCoords.lat, marseilleCoords.lon);
const productionMarseilleSud = applyOrientationCoefficient(zoneMarseille.productionSud, 'sud');
const finalMarseilleSud = applyShadingDiscount(productionMarseilleSud, false);
console.log(`Zone trouvée : ${zoneMarseille.name} (${zoneMarseille.city})`);
console.log(`Production Sud base : ${zoneMarseille.productionSud} kWh/kWc/an`);
console.log(`Production Sud finale : ${finalMarseilleSud} kWh/kWc/an`);
console.log(`✅ Attendu : 1,700 kWh/kWc/an`);
console.log(`✅ Résultat : ${finalMarseilleSud === 1700 ? 'PASS' : 'FAIL'}`);

// Test 2 : Marseille Sud avec ombrage
console.log('\n📍 TEST 2 : Marseille Sud avec ombrage (-10%)');
const finalMarseilleSudOmbrage = applyShadingDiscount(productionMarseilleSud, true);
console.log(`Production Sud avec ombrage : ${finalMarseilleSudOmbrage} kWh/kWc/an`);
console.log(`✅ Attendu : 1,530 kWh/kWc/an (1,700 * 0.9)`);
console.log(`✅ Résultat : ${finalMarseilleSudOmbrage === 1530 ? 'PASS' : 'FAIL'}`);

// Test 3 : Lille Sud sans ombrage
console.log('\n📍 TEST 3 : Lille Sud sans ombrage');
const lilleCoords = { lat: 50.6292, lon: 3.0573 };
const zoneLille = findNearestZone(lilleCoords.lat, lilleCoords.lon);
const productionLilleSud = applyOrientationCoefficient(zoneLille.productionSud, 'sud');
const finalLilleSud = applyShadingDiscount(productionLilleSud, false);
console.log(`Zone trouvée : ${zoneLille.name} (${zoneLille.city})`);
console.log(`Production Sud base : ${zoneLille.productionSud} kWh/kWc/an`);
console.log(`Production Sud finale : ${finalLilleSud} kWh/kWc/an`);
console.log(`✅ Attendu : 1,000 kWh/kWc/an`);
console.log(`✅ Résultat : ${finalLilleSud === 1000 ? 'PASS' : 'FAIL'}`);

// Test 4 : Paris Sud sans ombrage
console.log('\n📍 TEST 4 : Paris Sud sans ombrage');
const parisCoords = { lat: 48.8566, lon: 2.3522 };
const zoneParis = findNearestZone(parisCoords.lat, parisCoords.lon);
const productionParisSud = applyOrientationCoefficient(zoneParis.productionSud, 'sud');
const finalParisSud = applyShadingDiscount(productionParisSud, false);
console.log(`Zone trouvée : ${zoneParis.name} (${zoneParis.city})`);
console.log(`Production Sud base : ${zoneParis.productionSud} kWh/kWc/an`);
console.log(`Production Sud finale : ${finalParisSud} kWh/kWc/an`);
console.log(`✅ Attendu : 1,200 kWh/kWc/an`);
console.log(`✅ Résultat : ${finalParisSud === 1200 ? 'PASS' : 'FAIL'}`);

// Test 5 : Lyon Sud sans ombrage
console.log('\n📍 TEST 5 : Lyon Sud sans ombrage');
const lyonCoords = { lat: 45.7640, lon: 4.8357 };
const zoneLyon = findNearestZone(lyonCoords.lat, lyonCoords.lon);
const productionLyonSud = applyOrientationCoefficient(zoneLyon.productionSud, 'sud');
const finalLyonSud = applyShadingDiscount(productionLyonSud, false);
console.log(`Zone trouvée : ${zoneLyon.name} (${zoneLyon.city})`);
console.log(`Production Sud base : ${zoneLyon.productionSud} kWh/kWc/an`);
console.log(`Production Sud finale : ${finalLyonSud} kWh/kWc/an`);
console.log(`✅ Attendu : 1,450 kWh/kWc/an`);
console.log(`✅ Résultat : ${finalLyonSud === 1450 ? 'PASS' : 'FAIL'}`);

// Test 6 : Toulouse Sud sans ombrage
console.log('\n📍 TEST 6 : Toulouse Sud sans ombrage');
const toulouseCoords = { lat: 43.6047, lon: 1.4442 };
const zoneToulouse = findNearestZone(toulouseCoords.lat, toulouseCoords.lon);
const productionToulouseSud = applyOrientationCoefficient(zoneToulouse.productionSud, 'sud');
const finalToulouseSud = applyShadingDiscount(productionToulouseSud, false);
console.log(`Zone trouvée : ${zoneToulouse.name} (${zoneToulouse.city})`);
console.log(`Production Sud base : ${zoneToulouse.productionSud} kWh/kWc/an`);
console.log(`Production Sud finale : ${finalToulouseSud} kWh/kWc/an`);
console.log(`✅ Attendu : 1,500 kWh/kWc/an`);
console.log(`✅ Résultat : ${finalToulouseSud === 1500 ? 'PASS' : 'FAIL'}`);

// Test 7 : Marseille Sud-Est sans ombrage (coefficient 87.5%)
console.log('\n📍 TEST 7 : Marseille Sud-Est sans ombrage');
const productionMarseilleSudEst = applyOrientationCoefficient(zoneMarseille.productionSud, 'sud-est');
const finalMarseilleSudEst = applyShadingDiscount(productionMarseilleSudEst, false);
console.log(`Production Sud-Est finale : ${finalMarseilleSudEst} kWh/kWc/an`);
console.log(`✅ Attendu : 1,488 kWh/kWc/an (1,700 * 0.875)`);
console.log(`✅ Résultat : ${finalMarseilleSudEst === 1488 ? 'PASS' : 'FAIL'}`);

// Test 8 : Marseille Est sans ombrage (coefficient 81.25%)
console.log('\n📍 TEST 8 : Marseille Est sans ombrage');
const productionMarseilleEst = applyOrientationCoefficient(zoneMarseille.productionSud, 'est');
const finalMarseilleEst = applyShadingDiscount(productionMarseilleEst, false);
console.log(`Production Est finale : ${finalMarseilleEst} kWh/kWc/an`);
console.log(`✅ Attendu : 1,381 kWh/kWc/an (1,700 * 0.8125)`);
console.log(`✅ Résultat : ${finalMarseilleEst === 1381 ? 'PASS' : 'FAIL'}`);

// Test 9 : Ajaccio (Corse) Sud sans ombrage
console.log('\n📍 TEST 9 : Ajaccio (Corse) Sud sans ombrage');
const ajaccioCoords = { lat: 41.9267, lon: 8.7369 };
const zoneAjaccio = findNearestZone(ajaccioCoords.lat, ajaccioCoords.lon);
const productionAjaccioSud = applyOrientationCoefficient(zoneAjaccio.productionSud, 'sud');
const finalAjaccioSud = applyShadingDiscount(productionAjaccioSud, false);
console.log(`Zone trouvée : ${zoneAjaccio.name} (${zoneAjaccio.city})`);
console.log(`Production Sud base : ${zoneAjaccio.productionSud} kWh/kWc/an`);
console.log(`Production Sud finale : ${finalAjaccioSud} kWh/kWc/an`);
console.log(`✅ Attendu : 1,750 kWh/kWc/an (meilleure zone France)`);
console.log(`✅ Résultat : ${finalAjaccioSud === 1750 ? 'PASS' : 'FAIL'}`);

// Test 10 : Brest (Bretagne) Sud sans ombrage
console.log('\n📍 TEST 10 : Brest (Bretagne) Sud sans ombrage');
const brestCoords = { lat: 48.3905, lon: -4.4860 };
const zoneBrest = findNearestZone(brestCoords.lat, brestCoords.lon);
const productionBrestSud = applyOrientationCoefficient(zoneBrest.productionSud, 'sud');
const finalBrestSud = applyShadingDiscount(productionBrestSud, false);
console.log(`Zone trouvée : ${zoneBrest.name} (${zoneBrest.city})`);
console.log(`Production Sud base : ${zoneBrest.productionSud} kWh/kWc/an`);
console.log(`Production Sud finale : ${finalBrestSud} kWh/kWc/an`);
console.log(`✅ Attendu : 1,000 kWh/kWc/an`);
console.log(`✅ Résultat : ${finalBrestSud === 1000 ? 'PASS' : 'FAIL'}`);

console.log('\n' + '='.repeat(80));
console.log('✅ TESTS TERMINÉS - Vérifiez les résultats ci-dessus');
console.log('='.repeat(80));

