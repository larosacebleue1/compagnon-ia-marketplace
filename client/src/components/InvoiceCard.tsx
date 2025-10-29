import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy, Download, Zap, Clock, DollarSign } from "lucide-react";
import { toast } from "sonner";

interface InvoiceData {
  client: string;
  amountHT: number;
  tva: number;
  amountTTC: number;
  description: string;
  date: string;
  invoiceNumber: string;
}

interface InvoiceCardProps {
  data: InvoiceData;
}

export default function InvoiceCard({ data }: InvoiceCardProps) {
  const timeSaved = 10; // minutes
  const hourlyCost = 50; // €/h
  const savings = (timeSaved / 60) * hourlyCost;
  const automationCost = 1.50;
  const netSavings = savings - automationCost;

  const handleCopyData = () => {
    const text = `
DONNÉES FACTURE

Client : ${data.client}
Montant HT : ${data.amountHT.toFixed(2)} €
TVA 20% : ${data.tva.toFixed(2)} €
Montant TTC : ${data.amountTTC.toFixed(2)} €
Description : ${data.description}
Date : ${data.date}
N° Facture : ${data.invoiceNumber}

Conditions de paiement : 30 jours
    `.trim();

    navigator.clipboard.writeText(text);
    toast.success("Données copiées dans le presse-papier !");
  };

  const handleExportCSV = () => {
    const csv = `Client,Montant HT,TVA,Montant TTC,Description,Date,Numéro
"${data.client}",${data.amountHT},${data.tva},${data.amountTTC},"${data.description}",${data.date},${data.invoiceNumber}`;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `facture_${data.invoiceNumber}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Fichier CSV téléchargé !");
  };

  const handleAutomaticSend = () => {
    toast.info("Fonctionnalité disponible après la levée de fonds !", {
      description: "Intégration PDP (Chorus Pro, Pennylane) en cours de développement",
      duration: 5000,
    });
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-indigo-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-indigo-900">
          📄 Données Facture Prêtes
        </h3>
        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-100 px-3 py-1 rounded-full">
          <Clock className="w-4 h-4" />
          <span className="font-semibold">Temps économisé : {timeSaved} min</span>
        </div>
      </div>

      {/* Invoice Data */}
      <div className="bg-white rounded-lg p-4 mb-4 space-y-2">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="font-semibold text-gray-700">Client :</span>
            <p className="text-gray-900">{data.client}</p>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Date :</span>
            <p className="text-gray-900">{data.date}</p>
          </div>
        </div>

        <div className="border-t pt-2">
          <span className="font-semibold text-gray-700">Description :</span>
          <p className="text-gray-900">{data.description}</p>
        </div>

        <div className="border-t pt-2 space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-700">Montant HT :</span>
            <span className="font-semibold">{data.amountHT.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-700">TVA 20% :</span>
            <span className="font-semibold">{data.tva.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t pt-1">
            <span className="text-gray-900">Montant TTC :</span>
            <span className="text-indigo-600">{data.amountTTC.toFixed(2)} €</span>
          </div>
        </div>

        <div className="text-xs text-gray-500 pt-2">
          N° Facture suggéré : {data.invoiceNumber}
        </div>
      </div>

      {/* Option 1: Manual (Free) */}
      <div className="bg-white rounded-lg p-4 mb-3 border-2 border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-gray-900">
            Option 1 : Copier les données
          </h4>
          <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded">
            GRATUIT
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-3">
          → Vous collez dans votre logiciel de facturation<br />
          → Vous envoyez via votre PDP
        </p>
        <div className="flex gap-2">
          <Button
            onClick={handleCopyData}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copier
          </Button>
          <Button
            onClick={handleExportCSV}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Option 2: Automatic (Paid) */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg p-4 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-bl-lg">
          BIENTÔT
        </div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold">
            Option 2 : Envoi automatique 🚀
          </h4>
          <span className="text-sm font-semibold bg-white/20 px-2 py-1 rounded">
            {automationCost.toFixed(2)}€
          </span>
        </div>
        <p className="text-sm text-white/90 mb-3">
          → Génération Factur-X<br />
          → Envoi via PDP (Chorus Pro/Pennylane)<br />
          → Suivi paiement + Relances automatiques
        </p>
        <div className="flex items-center gap-2 mb-3 text-sm bg-white/10 rounded px-2 py-1">
          <DollarSign className="w-4 h-4" />
          <span>Économie nette : {netSavings.toFixed(2)}€ ({savings.toFixed(2)}€ - {automationCost.toFixed(2)}€)</span>
        </div>
        <Button
          onClick={handleAutomaticSend}
          variant="secondary"
          size="sm"
          className="w-full"
          disabled
        >
          <Zap className="w-4 h-4 mr-2" />
          Envoyer automatiquement
        </Button>
      </div>

      {/* Regulatory Notice */}
      <div className="mt-3 text-xs text-gray-500 bg-yellow-50 border border-yellow-200 rounded p-2">
        ⚠️ <span className="font-semibold">Rappel réglementaire :</span> Facturation électronique obligatoire via PDP (loi 2024)
      </div>
    </Card>
  );
}

