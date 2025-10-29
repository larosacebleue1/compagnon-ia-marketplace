import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy, Download, Sun, Zap, TrendingUp, Clock, DollarSign } from "lucide-react";
import { toast } from "sonner";

interface QuoteData {
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

interface QuoteCardProps {
  data: QuoteData;
}

export default function QuoteCard({ data }: QuoteCardProps) {
  const timeSaved = 120; // minutes (2 heures)
  const hourlyCost = 50; // €/h
  const savings = (timeSaved / 60) * hourlyCost;

  const handleCopyData = () => {
    const text = `
DEVIS PHOTOVOLTAÏQUE PROFESSIONNEL

Localisation : ${data.location} (${data.region})
Ensoleillement : ${data.sunlight} kWh/kWc/an

INSTALLATION RECOMMANDÉE
Puissance : ${data.power} kWc (${data.panels} panneaux de 400Wc)
Surface nécessaire : ${data.surface} m²
Production annuelle : ${data.annualProduction.toLocaleString()} kWh/an
Autoconsommation estimée : ${data.selfConsumptionPercent}% (${data.selfConsumptionKwh.toLocaleString()} kWh/an)
Revente surplus : ${data.surplusKwh.toLocaleString()} kWh/an à 0.13€/kWh

RENTABILITÉ
Coût installation : ${data.costTotal.toLocaleString()} € TTC

Aides disponibles :
- MaPrimeRénov' : ${data.aideMaPrimeRenov.toLocaleString()} €
- CEE : ${data.aideCEE.toLocaleString()} €
- TVA réduite 10% : ${data.aideTVA.toLocaleString()} €
Total aides : ${data.totalAides.toLocaleString()} €

Prix final après aides : ${data.finalPrice.toLocaleString()} €

Économies annuelles : ${data.annualSavings.toLocaleString()} €/an
- Autoconsommation : ${data.savingsSelfConsumption.toLocaleString()} €
- Revente surplus : ${data.savingsSurplus.toLocaleString()} €

ROI : ${data.roi} ans
Gain sur 25 ans : ${data.gain25Years.toLocaleString()} €

MATÉRIEL RECOMMANDÉ
- Panneaux : ${data.panelBrand} 400Wc (garantie 25 ans)
- Onduleur : ${data.inverterBrand} (garantie 10 ans)
- Structure : Aluminium anodisé
- Câblage : Conforme NF C 15-100
    `.trim();

    navigator.clipboard.writeText(text);
    toast.success("Devis copié dans le presse-papier !");
  };

  const handleExportPDF = () => {
    toast.info("Export PDF disponible prochainement !", {
      description: "Fonctionnalité en cours de développement",
      duration: 3000,
    });
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sun className="w-6 h-6 text-orange-600" />
          <h3 className="text-xl font-bold text-orange-900">
            Devis Photovoltaïque Professionnel
          </h3>
        </div>
        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-100 px-3 py-1 rounded-full">
          <Clock className="w-4 h-4" />
          <span className="font-semibold">Temps économisé : {timeSaved / 60}h</span>
        </div>
      </div>

      {/* Location */}
      <div className="bg-white rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Localisation</p>
            <p className="text-lg font-semibold text-gray-900">{data.location} ({data.region})</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Ensoleillement</p>
            <p className="text-lg font-semibold text-orange-600">{data.sunlight} kWh/kWc/an</p>
          </div>
        </div>
      </div>

      {/* Installation */}
      <div className="bg-white rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-5 h-5 text-orange-600" />
          <h4 className="font-semibold text-gray-900">Installation Recommandée</h4>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-600">Puissance :</span>
            <p className="font-semibold text-gray-900">{data.power} kWc ({data.panels} panneaux)</p>
          </div>
          <div>
            <span className="text-gray-600">Surface :</span>
            <p className="font-semibold text-gray-900">{data.surface} m²</p>
          </div>
          <div>
            <span className="text-gray-600">Production annuelle :</span>
            <p className="font-semibold text-gray-900">{data.annualProduction.toLocaleString()} kWh/an</p>
          </div>
          <div>
            <span className="text-gray-600">Autoconsommation :</span>
            <p className="font-semibold text-gray-900">{data.selfConsumptionPercent}%</p>
          </div>
        </div>
      </div>

      {/* Rentabilité */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 mb-4 border-2 border-green-200">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-5 h-5 text-green-600" />
          <h4 className="font-semibold text-gray-900">Rentabilité</h4>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-700">Coût installation :</span>
            <span className="font-semibold text-gray-900">{data.costTotal.toLocaleString()} €</span>
          </div>

          <div className="border-t pt-2">
            <p className="text-gray-700 font-semibold mb-1">Aides disponibles :</p>
            <div className="pl-3 space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">MaPrimeRénov' :</span>
                <span className="text-green-600 font-semibold">- {data.aideMaPrimeRenov.toLocaleString()} €</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">CEE :</span>
                <span className="text-green-600 font-semibold">- {data.aideCEE.toLocaleString()} €</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">TVA réduite 10% :</span>
                <span className="text-green-600 font-semibold">- {data.aideTVA.toLocaleString()} €</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span className="text-gray-900">Prix final après aides :</span>
            <span className="text-green-600">{data.finalPrice.toLocaleString()} €</span>
          </div>

          <div className="border-t pt-2">
            <div className="flex justify-between">
              <span className="text-gray-700">Économies annuelles :</span>
              <span className="font-semibold text-green-600">{data.annualSavings.toLocaleString()} €/an</span>
            </div>
          </div>

          <div className="bg-white rounded p-3 border border-green-300">
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-gray-900">ROI (Retour sur Investissement) :</span>
              <span className="text-2xl font-bold text-orange-600">{data.roi} ans</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-900">Gain sur 25 ans :</span>
              <span className="text-xl font-bold text-green-600">+{data.gain25Years.toLocaleString()} €</span>
            </div>
          </div>
        </div>
      </div>

      {/* Matériel */}
      <div className="bg-white rounded-lg p-4 mb-4">
        <h4 className="font-semibold text-gray-900 mb-2">🔧 Matériel Recommandé</h4>
        <ul className="text-sm space-y-1 text-gray-700">
          <li>✓ Panneaux : {data.panelBrand} 400Wc (garantie 25 ans)</li>
          <li>✓ Onduleur : {data.inverterBrand} (garantie 10 ans)</li>
          <li>✓ Structure : Aluminium anodisé</li>
          <li>✓ Câblage : Conforme NF C 15-100</li>
        </ul>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm bg-green-100 rounded px-3 py-2">
          <DollarSign className="w-4 h-4 text-green-700" />
          <span className="text-green-700 font-semibold">
            Économie : {savings}€ ({timeSaved / 60}h × {hourlyCost}€/h)
          </span>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleCopyData}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copier le devis
          </Button>
          <Button
            onClick={handleExportPDF}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Next Steps */}
      <div className="mt-3 text-xs text-gray-600 bg-blue-50 border border-blue-200 rounded p-3">
        <p className="font-semibold mb-1">📋 Prochaines étapes :</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Envoyez ce devis au client</li>
          <li>Planifiez une visite technique (gratuite)</li>
          <li>Finalisez les démarches administratives</li>
        </ol>
      </div>
    </Card>
  );
}

