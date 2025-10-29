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
  }>({
    city: '',
    orientation: 'sud',
    tilt: 30,
    surface: 50,
    monthlyBill: 150,
  });

  const [result, setResult] = useState<any>(null);
  const [showContactForm, setShowContactForm] = useState(false);

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

            {/* CTA */}
            <Card className="p-8 bg-gradient-to-r from-blue-600 to-green-600 text-white text-center">
              <h3 className="text-3xl font-bold mb-4">Intéressé par cette installation ?</h3>
              <p className="text-xl mb-6">
                Recevez 3 devis gratuits d'artisans certifiés de votre région
              </p>
              <Button
                onClick={() => setShowContactForm(true)}
                className="bg-white text-blue-600 hover:bg-gray-100 text-lg py-6 px-12 font-bold"
              >
                Je veux être contacté
              </Button>
            </Card>

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
    </div>
  );
}

