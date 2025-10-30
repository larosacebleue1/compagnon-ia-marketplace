import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { Sun, MapPin, Compass, Home, Zap, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const ORIENTATIONS = [
  { value: 'sud', label: 'Sud', icon: '☀️', description: 'Optimal', color: 'bg-green-100 border-green-500' },
  { value: 'sud-est', label: 'Sud-Est', icon: '🌅', description: 'Très bon', color: 'bg-green-50 border-green-400' },
  { value: 'sud-ouest', label: 'Sud-Ouest', icon: '🌄', description: 'Très bon', color: 'bg-green-50 border-green-400' },
  { value: 'est', label: 'Est', icon: '⬅️', description: 'Correct', color: 'bg-yellow-50 border-yellow-400' },
  { value: 'ouest', label: 'Ouest', icon: '➡️', description: 'Correct', color: 'bg-yellow-50 border-yellow-400' },
  { value: 'nord', label: 'Nord', icon: '⚠️', description: 'Non recommandé', color: 'bg-red-50 border-red-400' },
];

export default function CalculatorPublic() {
  const [formData, setFormData] = useState<{
    city: string;
    orientation: 'sud' | 'sud-est' | 'sud-ouest' | 'est' | 'ouest' | 'nord';
    tilt: number;
    surface: number;
    monthlyBill: number;
    hasShading: boolean;
    customCost?: number;
    electricityPrice?: number;
    surplusPrice?: number;
  }>({
    city: '',
    orientation: 'sud',
    tilt: 30,
    surface: 50,
    monthlyBill: 150,
    hasShading: false,
    electricityPrice: 0.25,
    surplusPrice: 0.13,
  });

  const [result, setResult] = useState<any>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

  const calculateMutation = trpc.pvgis.calculate.useMutation({
    onSuccess: (data) => {
      setResult(data);
      toast.success("Devis généré avec succès !");
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors du calcul");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            ☀️ Calculateur Photovoltaïque Gratuit
          </h1>
          <p className="text-xl text-gray-600">
            Découvrez si votre installation peut être <span className="font-bold text-green-600">autofinancée</span>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Calculs précis basés sur PVGIS (Commission Européenne)
          </p>
        </div>

        {/* Formulaire */}
        {!result && (
          <Card className="p-8 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Localisation */}
              <div>
                <Label className="text-lg font-semibold flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Votre ville
                </Label>
                <Input
                  type="text"
                  placeholder="Ex: Marseille, Lyon, Paris..."
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                  className="mt-2 text-lg"
                />
              </div>

              {/* Orientation */}
              <div>
                <Label className="text-lg font-semibold flex items-center gap-2 mb-4">
                  <Compass className="w-5 h-5" />
                  Orientation de votre toiture
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {ORIENTATIONS.map((orientation) => (
                    <button
                      key={orientation.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, orientation: orientation.value as 'sud' | 'sud-est' | 'sud-ouest' | 'est' | 'ouest' | 'nord' })}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        formData.orientation === orientation.value
                          ? `${orientation.color} border-4`
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-3xl mb-2">{orientation.icon}</div>
                      <div className="font-semibold">{orientation.label}</div>
                      <div className="text-sm text-gray-600">{orientation.description}</div>
                    </button>
                  ))}
                </div>
                {formData.orientation === 'nord' && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-red-800">
                      <strong>Attention :</strong> Une toiture orientée Nord produit très peu d'électricité (30-50% de moins qu'une toiture Sud). 
                      L'installation risque de ne pas être rentable.
                    </div>
                  </div>
                )}
              </div>

              {/* Inclinaison */}
              <div>
                <Label className="text-lg font-semibold flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  Inclinaison de votre toiture : {formData.tilt}°
                </Label>
                <input
                  type="range"
                  min="0"
                  max="90"
                  value={formData.tilt}
                  onChange={(e) => setFormData({ ...formData, tilt: parseInt(e.target.value) })}
                  className="w-full mt-2"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>Plat (0°)</span>
                  <span className="font-semibold text-green-600">Optimal (30°)</span>
                  <span>Vertical (90°)</span>
                </div>
              </div>

              {/* Surface */}
              <div>
                <Label className="text-lg font-semibold flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  Surface disponible sur votre toiture (m²)
                </Label>
                <Input
                  type="number"
                  min="10"
                  max="500"
                  value={formData.surface}
                  onChange={(e) => setFormData({ ...formData, surface: parseInt(e.target.value) })}
                  required
                  className="mt-2 text-lg"
                />
                <p className="text-sm text-gray-600 mt-1">
                  1 panneau = 2m² environ
                </p>
              </div>

              {/* Facture */}
              <div>
                <Label className="text-lg font-semibold flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Votre facture d'électricité mensuelle (€)
                </Label>
                <Input
                  type="number"
                  min="20"
                  max="1000"
                  value={formData.monthlyBill}
                  onChange={(e) => setFormData({ ...formData, monthlyBill: parseInt(e.target.value) })}
                  required
                  className="mt-2 text-lg"
                />
              </div>

              {/* Coût personnalisé */}
              <div className="border-2 border-blue-200 rounded-lg p-6 bg-blue-50">
                <Label className="text-lg font-semibold flex items-center gap-2">
                  💰 Coût de votre installation (€) - Optionnel
                </Label>
                <Input
                  type="number"
                  min="1000"
                  max="100000"
                  placeholder="Laissez vide pour calcul automatique"
                  value={formData.customCost || ''}
                  onChange={(e) => setFormData({ ...formData, customCost: e.target.value ? parseInt(e.target.value) : undefined })}
                  className="mt-2 text-lg"
                />
                <p className="text-sm text-gray-600 mt-2">
                  Si vous avez déjà un devis, saisissez le montant ici pour calculer votre seuil de rentabilité personnalisé.
                  <br />
                  <span className="font-semibold text-blue-600">Par défaut : 2,000€/kWc (prix marché 2025)</span>
                </p>
              </div>

              {/* Prix électricité ajustables */}
              <div className="border-2 border-purple-200 rounded-lg p-6 bg-purple-50">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  ⚡ Prix électricité (ajustables pour simulation)
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Prix électricité */}
                  <div>
                    <Label className="text-sm font-semibold">
                      Prix électricité (€/kWh)
                    </Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0.20"
                      max="0.40"
                      value={formData.electricityPrice}
                      onChange={(e) => setFormData({ ...formData, electricityPrice: parseFloat(e.target.value) })}
                      className="mt-2"
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      Défaut : 0.25€/kWh (tarif moyen 2025)
                    </p>
                  </div>

                  {/* Prix rachat surplus */}
                  <div>
                    <Label className="text-sm font-semibold">
                      Prix rachat surplus (€/kWh)
                    </Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0.10"
                      max="0.20"
                      value={formData.surplusPrice}
                      onChange={(e) => setFormData({ ...formData, surplusPrice: parseFloat(e.target.value) })}
                      className="mt-2"
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      Défaut : 0.13€/kWh (EDF OA 2025)
                    </p>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-white rounded-lg border border-purple-300">
                  <p className="text-xs text-gray-700">
                    💡 <strong>Astuce :</strong> Ajustez ces prix pour simuler l'impact d'une hausse future de l'électricité
                    sur votre rentabilité. Plus le prix de l'électricité augmente, plus votre installation devient rentable !
                  </p>
                </div>
              </div>

              {/* Ombrage */}
              <div className="border-2 border-gray-200 rounded-lg p-6 bg-gray-50">
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    id="hasShading"
                    checked={formData.hasShading}
                    onChange={(e) => setFormData({ ...formData, hasShading: e.target.checked })}
                    className="mt-1 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <Label htmlFor="hasShading" className="text-lg font-semibold cursor-pointer">
                      🌳 Ma toiture a de l'ombrage (matin ou soir)
                    </Label>
                    <p className="text-sm text-gray-600 mt-2">
                      Cochez cette case si votre toiture est ombragée par des arbres, bâtiments ou collines le matin ou le soir.
                      <br />
                      <span className="font-semibold text-orange-600">Décote appliquée : -10% sur la production</span>
                    </p>
                  </div>
                </div>
                {formData.hasShading && (
                  <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-orange-800">
                      <strong>Ombrage détecté :</strong> La production sera réduite de 10% pour tenir compte des ombres.
                      Cela reste une estimation conservative basée sur 15+ ans d'expérience terrain.
                    </div>
                  </div>
                )}
              </div>

              {/* Bouton Submit */}
              <Button
                type="submit"
                disabled={calculateMutation.isPending}
                className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                {calculateMutation.isPending ? (
                  "Calcul en cours..."
                ) : (
                  <>
                    <Sun className="w-5 h-5 mr-2" />
                    Calculer mon installation
                  </>
                )}
              </Button>
            </form>
          </Card>
        )}

        {/* Résultats */}
        {result && (
          <div className="space-y-6">
            {/* Badge Autofinancement */}
            <div className={`p-8 rounded-2xl text-center ${
              result.isAutofinanced
                ? 'bg-gradient-to-r from-green-500 to-green-600'
                : 'bg-gradient-to-r from-red-500 to-red-600'
            } text-white shadow-2xl`}>
              {result.isAutofinanced ? (
                <>
                  <CheckCircle className="w-16 h-16 mx-auto mb-4" />
                  <h2 className="text-4xl font-bold mb-2">✅ INSTALLATION AUTOFINANCÉE</h2>
                  <p className="text-xl">
                    Vous économisez <span className="font-bold">{result.cashFlowNet}€/mois</span> dès le 1er mois !
                  </p>
                </>
              ) : (
                <>
                  <AlertCircle className="w-16 h-16 mx-auto mb-4" />
                  <h2 className="text-4xl font-bold mb-2">❌ NON AUTOFINANCÉE</h2>
                  <p className="text-xl">
                    Surcoût mensuel : <span className="font-bold">{Math.abs(result.cashFlowNet)}€/mois</span>
                  </p>
                </>
              )}
            </div>

            {/* Détails Installation */}
            <Card className="p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Sun className="w-6 h-6" />
                Votre Installation Recommandée
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <div className="text-3xl font-bold text-blue-600">{result.power} kWc</div>
                  <div className="text-sm text-gray-600">Puissance</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600">{result.panels}</div>
                  <div className="text-sm text-gray-600">Panneaux</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600">{result.annualProduction.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">kWh/an produits</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600">{result.sunlight}</div>
                  <div className="text-sm text-gray-600">kWh/kWc/an</div>
                </div>
              </div>
            </Card>

            {/* Autofinancement Détails */}
            <Card className="p-8 bg-gradient-to-br from-blue-50 to-green-50">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                Détails Autofinancement
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-white rounded-lg">
                  <span className="font-semibold">Facture EDF actuelle</span>
                  <span className="text-2xl font-bold text-red-600">{result.monthlyBillBefore}€/mois</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white rounded-lg">
                  <span className="font-semibold">Mensualité crédit (15 ans, 3%)</span>
                  <span className="text-2xl font-bold text-orange-600">{result.monthlyPayment}€/mois</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white rounded-lg">
                  <span className="font-semibold">Facture EDF résiduelle (30%)</span>
                  <span className="text-2xl font-bold text-blue-600">{result.monthlyBillAfter}€/mois</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white rounded-lg">
                  <span className="font-semibold">Économie mensuelle</span>
                  <span className="text-2xl font-bold text-green-600">{result.monthlySavings}€/mois</span>
                </div>
                <div className={`flex justify-between items-center p-6 rounded-lg border-4 ${
                  result.isAutofinanced ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500'
                }`}>
                  <span className="text-xl font-bold">CASH-FLOW NET</span>
                  <span className={`text-4xl font-bold ${result.isAutofinanced ? 'text-green-600' : 'text-red-600'}`}>
                    {result.cashFlowNet > 0 ? '+' : ''}{result.cashFlowNet}€/mois
                  </span>
                </div>
              </div>
            </Card>

            {/* Coûts et Aides */}
            <Card className="p-8">
              <h3 className="text-2xl font-bold mb-6">💰 Coûts et Aides</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Coût installation TTC</span>
                  <span className="font-bold">{result.costTotal.toLocaleString()}€</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Prime autoconsommation</span>
                  <span className="font-bold">-{result.aides.primeAutoconsommation.toLocaleString()}€</span>
                </div>
                {result.aides.tvaReduite > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>TVA réduite 10%</span>
                    <span className="font-bold">-{result.aides.tvaReduite.toLocaleString()}€</span>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t-2 text-xl font-bold">
                  <span>Prix final</span>
                  <span>{result.finalPrice.toLocaleString()}€</span>
                </div>
              </div>
            </Card>

            {/* ROI - Seuil de Rentabilité */}
            {result.roi && (
              <Card className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  📈 Seuil de Rentabilité (ROI)
                </h3>
                
                {/* Prix utilisés */}
                {result.prices && (
                  <div className="mb-4 p-3 bg-white rounded-lg border border-purple-200">
                    <p className="text-sm text-gray-700">
                      📊 <strong>Prix utilisés pour ce calcul :</strong> Électricité <span className="font-bold text-purple-600">{result.prices.electricityPrice.toFixed(2)}€/kWh</span> | 
                      Rachat surplus <span className="font-bold text-purple-600">{result.prices.surplusPrice.toFixed(2)}€/kWh</span>
                    </p>
                  </div>
                )}
                
                {/* Badge Rentabilité */}
                <div className={`p-6 rounded-xl text-center mb-6 ${
                  result.roi.paybackYears <= 15
                    ? 'bg-gradient-to-r from-green-500 to-green-600'
                    : result.roi.paybackYears <= 20
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600'
                    : 'bg-gradient-to-r from-red-500 to-red-600'
                } text-white shadow-xl`}>
                  <div className="text-5xl font-bold mb-2">{result.roi.paybackYears} ans</div>
                  <div className="text-xl">pour amortir votre installation</div>
                </div>

                {/* Gains sur 25 ans */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-white rounded-lg border-2 border-green-300">
                    <div className="text-sm text-gray-600 mb-1">Économies totales (25 ans)</div>
                    <div className="text-3xl font-bold text-green-600">{result.roi.totalSavings25Years.toLocaleString()}€</div>
                  </div>
                  <div className="p-4 bg-white rounded-lg border-2 border-purple-300">
                    <div className="text-sm text-gray-600 mb-1">Gain net après amortissement</div>
                    <div className="text-3xl font-bold text-purple-600">+{result.roi.netGain25Years.toLocaleString()}€</div>
                  </div>
                </div>

                {/* Tableau évolution */}
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold mb-3 text-gray-700">📅 Évolution de vos économies</h4>
                  <div className="space-y-2">
                    {result.roi.yearlyBreakdown.map((item: any) => (
                      <div key={item.year} className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="font-semibold">Année {item.year}</span>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">Économies cumulées : {item.cumulativeSavings.toLocaleString()}€</div>
                          <div className={`font-bold ${
                            item.netGain >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {item.netGain >= 0 ? '+' : ''}{item.netGain.toLocaleString()}€
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Message explicatif */}
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-gray-700">
                    💡 <strong>Durée de vie installation :</strong> 25 ans minimum. Les panneaux photovoltaïques
                    continuent de produire au-delà, avec un rendement légèrement réduit.
                  </p>
                </div>
              </Card>
            )}

            {/* Message Empowerment */}
            {result.marketplace && (
              <Card className="p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-2 border-blue-300">
                <div className="flex items-start gap-4">
                  <div className="text-5xl">👑</div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      🎯 VOUS êtes le décisionnaire de VOTRE projet
                    </h3>
                    <p className="text-gray-700 mb-4">
                      Avec cette application, <strong>vous prenez le contrôle</strong> de votre installation photovoltaïque :
                    </p>
                    <div className="grid md:grid-cols-2 gap-3 mb-4">
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">✅</span>
                        <span className="text-sm"><strong>Prix transparent</strong> fixé à l'avance (pas de surprise)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">✅</span>
                        <span className="text-sm"><strong>Installateurs certifiés</strong> RGE validés par nous</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">✅</span>
                        <span className="text-sm"><strong>Vous choisissez</strong> quand démarrer (Standard ou Express)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">✅</span>
                        <span className="text-sm"><strong>Suivi complet</strong> de A à Z dans l'application</span>
                      </div>
                    </div>
                    <p className="text-lg font-semibold text-blue-900">
                      🚀 Réalisez votre projet solaire en toute confiance, à VOTRE rythme.
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* CTA Marketplace */}
            {result.marketplace && (
              <Card className="p-8 bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                <div className="text-center mb-6">
                  <h3 className="text-4xl font-bold mb-2">🌟 Installation clé en main</h3>
                  <div className="text-6xl font-black mb-4">{result.marketplace.installationPrice.toLocaleString()}€</div>
                  <p className="text-xl opacity-90">{result.marketplace.tier.description}</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-3xl font-bold">{result.power} kWc</div>
                      <div className="text-sm opacity-90">Puissance</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold">{result.panels}</div>
                      <div className="text-sm opacity-90">Panneaux</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-6">
                  <div className="flex items-start gap-3 text-sm">
                    <div className="text-2xl">✅</div>
                    <div>
                      <strong>Inclus :</strong> Panneaux + Onduleur + Pose + Raccordement + Démarches administratives + Garanties
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm mt-3">
                    <div className="text-2xl">⚠️</div>
                    <div>
                      <strong>Travaux supplémentaires éventuels</strong> (renforcement toiture, mise aux normes) facturés en sus après visite technique
                    </div>
                  </div>
                </div>

                {/* Section Financement */}
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-5 mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-3xl">💳</div>
                    <h4 className="text-xl font-bold">Financement facile</h4>
                  </div>
                  <p className="text-sm mb-3 opacity-90">
                    Ce budget est <strong>facilement finançable</strong> auprès de votre banque :
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-3">
                    <div className="flex items-start gap-2">
                      <span>•</span>
                      <span>Crédit travaux à taux avantageux</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span>•</span>
                      <span>Éco-PTZ possible (prêt à taux zéro)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span>•</span>
                      <span>Mensualités à partir de <strong>{Math.round(result.marketplace.installationPrice / 120)}€/mois</strong> (sur 10 ans)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span>•</span>
                      <span>Économies {'>'} Mensualités crédit</span>
                    </div>
                  </div>
                  <div className="bg-green-500 text-white rounded-lg p-3 text-center font-bold">
                    🚀 Vous gagnez de l'argent dès le 1er mois !
                    <div className="text-sm font-normal mt-1 opacity-90">
                      Vos économies d'électricité ({Math.round(result.autofinancement.annualSavings / 12)}€/mois) paient votre crédit ({Math.round(result.marketplace.installationPrice / 120)}€/mois) + gain net : <strong>{Math.round(result.autofinancement.annualSavings / 12 - result.marketplace.installationPrice / 120)}€/mois</strong>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => setShowContactForm(true)}
                  className="w-full bg-white text-green-600 hover:bg-gray-100 text-2xl py-8 font-black shadow-2xl"
                  size="lg"
                >
                  👍 J'accepte ce prix - Recevoir un devis
                </Button>

                <p className="text-center text-sm mt-4 opacity-90">
                  🔒 Gratuit et sans engagement - Un installateur certifié RGE vous contactera sous 48h
                </p>
              </Card>
            )}

            {/* Nouveau calcul */}
            <div className="text-center">
              <Button
                onClick={() => {
                  setResult(null);
                  setShowContactForm(false);
                }}
                variant="outline"
                className="text-lg"
              >
                Faire un nouveau calcul
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Formulaire Pré-commande */}
      {showContactForm && result && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">📝 Finaliser ma demande</h2>
                  <p className="text-gray-600">Installation {result.power} kWc - {result.marketplace.installationPrice.toLocaleString()}€</p>
                </div>
                <Button
                  onClick={() => setShowContactForm(false)}
                  variant="ghost"
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setIsSubmittingLead(true);
                  
                  const formData = new FormData(e.currentTarget);
                  
                  try {
                    // Préparer les données du lead
                    const chosenPath = formData.get('chosenPath') as string || 'standard';
                    const waiverSigned = chosenPath === 'express' && formData.get('waiverSigned') === 'on';
                    const depositAmount = chosenPath === 'express' ? Math.round(result.marketplace.installationPrice * 0.3).toString() : undefined;
                    
                    const leadData = {
                      serviceId: 1, // Photovoltaïque (service créé dans seed)
                      clientFirstName: formData.get('firstName') as string,
                      clientLastName: formData.get('lastName') as string,
                      clientEmail: formData.get('email') as string,
                      clientPhone: formData.get('phone') as string,
                      clientAddress: formData.get('address') as string,
                      clientCity: formData.get('city') as string,
                      clientPostalCode: formData.get('postalCode') as string,
                      serviceData: {
                        power: result.power,
                        orientation: result.orientation,
                        surface: result.surface,
                        monthlyBill: result.monthlyBill,
                        hasShading: result.hasShading,
                        annualProduction: result.annualProduction,
                        zone: result.zone,
                        desiredDate: formData.get('desiredDate') as string || undefined,
                        comments: formData.get('comments') as string || undefined,
                      },
                      estimatedAmount: result.marketplace.installationPrice.toString(),
                      commissionAmount: result.marketplace.commission.toString(),
                      acceptedTerms: true,
                      acceptedContact: true,
                      sourceUrl: window.location.href,
                      sourceModule: 'photovoltaique',
                      // Nouveaux champs parcours
                      chosenPath: chosenPath as 'standard' | 'express',
                      depositAmount,
                      waiverSigned,
                    };
                    
                    // Appeler API (utiliser fetch direct car useMutation ne peut pas être dans handler)
                    const response = await fetch('/api/trpc/leads.createLead', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(leadData),
                    });
                    
                    if (!response.ok) {
                      throw new Error('Erreur lors de la création du lead');
                    }
                    
                    const apiResult = await response.json();
                    const accessToken = apiResult.result?.data?.accessToken;
                    
                    if (accessToken) {
                      // Rediriger vers dashboard client
                      window.location.href = `/dashboard/${accessToken}`;
                    } else {
                      toast.success('✅ Demande envoyée avec succès ! Un installateur vous contactera sous 48h.');
                      setShowContactForm(false);
                    }
                  } catch (error: any) {
                    console.error('Error creating lead:', error);
                    toast.error(error.message || 'Erreur lors de l\'envoi de la demande. Veuillez réessayer.');
                  } finally {
                    setIsSubmittingLead(false);
                  }
                }}
                className="space-y-6"
              >
                {/* Coordonnées */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">👤 Vos coordonnées</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Prénom *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        required
                        placeholder="Marc"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Nom *</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        required
                        placeholder="Djedir"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="marc@example.com"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Téléphone *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        placeholder="06 12 34 56 78"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Adresse installation */}
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">🏠 Adresse d'installation</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="address">Adresse complète *</Label>
                      <Input
                        id="address"
                        name="address"
                        required
                        placeholder="123 Avenue de la République"
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">Ville *</Label>
                        <Input
                          id="city"
                          name="city"
                          required
                          defaultValue={formData.city}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="postalCode">Code postal *</Label>
                        <Input
                          id="postalCode"
                          name="postalCode"
                          required
                          placeholder="13001"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Préférences */}
                <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">📅 Vos préférences</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="desiredDate">Date souhaitée pour les travaux (optionnel)</Label>
                      <Input
                        id="desiredDate"
                        name="desiredDate"
                        type="date"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="comments">Commentaires ou informations complémentaires (optionnel)</Label>
                      <textarea
                        id="comments"
                        name="comments"
                        rows={3}
                        placeholder="Ex: Accès toiture difficile, présence d'animaux, etc."
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Choix parcours */}
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-300 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">🚀 Choisissez votre parcours</h3>
                  <p className="text-sm text-gray-600 mb-4">Sélectionnez le mode de démarrage qui vous convient</p>
                  
                  <div className="space-y-4">
                    {/* Parcours Standard */}
                    <label className="flex items-start gap-4 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
                      <input
                        type="radio"
                        name="chosenPath"
                        value="standard"
                        defaultChecked
                        className="mt-1 w-5 h-5 text-blue-600"
                      />
                      <div className="flex-1">
                        <div className="font-bold text-lg text-gray-900 mb-1">🐢 Parcours Standard (recommandé)</div>
                        <ul className="text-sm text-gray-700 space-y-1 mb-2">
                          <li>✅ Délai de rétractation <strong>14 jours conservé</strong></li>
                          <li>✅ Acompte payable après confirmation (J+14)</li>
                          <li>✅ Travaux démarrent à J+16 environ</li>
                          <li>✅ Aucun paiement immédiat</li>
                        </ul>
                        <div className="text-xs text-gray-600 bg-white p-2 rounded">
                          ⚖️ <strong>Votre droit :</strong> Conformément à la loi, vous disposez d'un délai de 14 jours pour vous rétracter après signature du devis, sans justification ni pénalité.
                        </div>
                      </div>
                    </label>

                    {/* Parcours Express */}
                    <label className="flex items-start gap-4 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition">
                      <input
                        type="radio"
                        name="chosenPath"
                        value="express"
                        className="mt-1 w-5 h-5 text-orange-600"
                        onChange={(e) => {
                          const waiverSection = document.getElementById('waiverSection');
                          if (waiverSection) {
                            waiverSection.style.display = e.target.checked ? 'block' : 'none';
                          }
                        }}
                      />
                      <div className="flex-1">
                        <div className="font-bold text-lg text-gray-900 mb-1">🚀 Parcours Express</div>
                        <ul className="text-sm text-gray-700 space-y-1 mb-2">
                          <li>⚠️ Renonciation au délai de rétractation</li>
                          <li>💵 Acompte 30% à régler à l'installateur (<strong>{Math.round(result.marketplace.installationPrice * 0.3).toLocaleString()}€</strong>)</li>
                          <li>⚡ Travaux démarrent <strong>sous 48h</strong></li>
                          <li>🎯 Priorité absolue sur le planning</li>
                        </ul>
                        <div className="text-xs text-red-700 bg-red-50 p-2 rounded font-semibold">
                          ⚠️ ATTENTION : En choisissant ce parcours, vous renoncez à votre droit de rétractation de 14 jours.
                        </div>
                      </div>
                    </label>
                  </div>

                  {/* Section renonciation (affichée uniquement si Express) */}
                  <div id="waiverSection" style={{ display: 'none' }} className="mt-4 p-4 bg-red-50 border-2 border-red-300 rounded-lg">
                    <h4 className="font-bold text-red-900 mb-3">✍️ Renonciation au délai de rétractation</h4>
                    <div className="space-y-3">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="waiverSigned"
                          className="mt-1 w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                        />
                        <span className="text-sm text-gray-800">
                          <strong>Je demande expressément l'exécution du contrat avant l'expiration du délai de rétractation de quatorze jours.</strong> Je reconnais avoir été informé(e) que cette demande entraîne la perte de mon droit de rétractation.
                        </span>
                      </label>
                      <p className="text-xs text-gray-600 italic">
                        (Article L221-28 du Code de la consommation)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Consentements */}
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">✅ Confirmations</h3>
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="acceptedPrice"
                        required
                        className="mt-1 w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">
                        <strong>Je confirme mon intérêt</strong> pour une installation photovoltaïque {result.power} kWc au prix de <strong>{result.marketplace.installationPrice.toLocaleString()}€</strong>
                      </span>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="acceptedContact"
                        required
                        className="mt-1 w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">
                        <strong>J'accepte d'être contacté</strong> par un installateur certifié RGE pour une visite technique et l'établissement d'un devis détaillé
                      </span>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="acceptedTerms"
                        required
                        className="mt-1 w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">
                        J'accepte les <a href="/cgu" target="_blank" className="text-blue-600 underline">conditions générales d'utilisation</a> et la <a href="/privacy" target="_blank" className="text-blue-600 underline">politique de confidentialité</a>
                      </span>
                    </label>
                  </div>
                </div>

                {/* Boutons */}
                <div className="flex gap-4">
                  <Button
                    type="button"
                    onClick={() => setShowContactForm(false)}
                    variant="outline"
                    className="flex-1"
                    disabled={isSubmittingLead}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white text-lg py-6"
                    disabled={isSubmittingLead}
                  >
                    {isSubmittingLead ? (
                      <>
                        <span className="animate-spin inline-block mr-2">⏳</span>
                        Envoi en cours...
                      </>
                    ) : (
                      '✅ Envoyer ma demande'
                    )}
                  </Button>
                </div>

                <p className="text-center text-sm text-gray-600">
                  🔒 Vos données sont sécurisées et ne seront transmises qu'aux installateurs certifiés de votre région
                </p>
              </form>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

