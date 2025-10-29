import { jsPDF } from 'jspdf';

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  clientName: string;
  clientAddress?: string;
  description: string;
  amountHT: number;
  tvaRate?: number;
  companyName?: string;
  companyAddress?: string;
  companySiret?: string;
}

/**
 * Génère une facture PDF professionnelle
 */
export function generateInvoicePDF(data: InvoiceData): jsPDF {
  const doc = new jsPDF();
  
  const {
    invoiceNumber,
    date,
    clientName,
    clientAddress,
    description,
    amountHT,
    tvaRate = 20,
    companyName = 'Votre Entreprise',
    companyAddress = 'Adresse de votre entreprise',
    companySiret = 'SIRET: XXX XXX XXX XXXXX',
  } = data;

  // Calculs
  const tvaAmount = amountHT * (tvaRate / 100);
  const amountTTC = amountHT + tvaAmount;

  // Couleurs
  const primaryColor = '#1e40af'; // Bleu
  const textColor = '#1f2937'; // Gris foncé

  // En-tête
  doc.setFontSize(24);
  doc.setTextColor(primaryColor);
  doc.text('FACTURE', 20, 20);

  // Informations entreprise (en haut à droite)
  doc.setFontSize(10);
  doc.setTextColor(textColor);
  doc.text(companyName, 140, 20);
  doc.text(companyAddress, 140, 26);
  doc.text(companySiret, 140, 32);

  // Numéro et date de facture
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`N° ${invoiceNumber}`, 20, 45);
  doc.setFont('helvetica', 'normal');
  doc.text(`Date: ${date}`, 20, 52);

  // Ligne de séparation
  doc.setDrawColor(primaryColor);
  doc.setLineWidth(0.5);
  doc.line(20, 58, 190, 58);

  // Informations client
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Client:', 20, 70);
  doc.setFont('helvetica', 'normal');
  doc.text(clientName, 20, 77);
  if (clientAddress) {
    doc.text(clientAddress, 20, 84);
  }

  // Tableau des prestations
  const tableTop = 100;
  
  // En-tête du tableau
  doc.setFillColor(primaryColor);
  doc.rect(20, tableTop, 170, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('Description', 25, tableTop + 7);
  doc.text('Montant HT', 150, tableTop + 7);

  // Contenu du tableau
  doc.setTextColor(textColor);
  doc.setFont('helvetica', 'normal');
  
  // Description (avec retour à la ligne si trop long)
  const splitDescription = doc.splitTextToSize(description, 120);
  doc.text(splitDescription, 25, tableTop + 17);
  
  // Montant HT
  doc.text(`${amountHT.toFixed(2)} €`, 150, tableTop + 17);

  // Ligne de séparation
  const lineY = tableTop + 17 + (splitDescription.length * 5) + 5;
  doc.setDrawColor(200, 200, 200);
  doc.line(20, lineY, 190, lineY);

  // Totaux
  const totalsY = lineY + 10;
  doc.setFont('helvetica', 'normal');
  doc.text('Total HT:', 130, totalsY);
  doc.text(`${amountHT.toFixed(2)} €`, 170, totalsY, { align: 'right' });

  doc.text(`TVA (${tvaRate}%):`, 130, totalsY + 7);
  doc.text(`${tvaAmount.toFixed(2)} €`, 170, totalsY + 7, { align: 'right' });

  // Total TTC (en gras)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Total TTC:', 130, totalsY + 17);
  doc.text(`${amountTTC.toFixed(2)} €`, 170, totalsY + 17, { align: 'right' });

  // Conditions de paiement
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text('Conditions de paiement: 30 jours', 20, totalsY + 35);
  doc.text('Pénalités de retard: 3 fois le taux d\'intérêt légal', 20, totalsY + 40);

  // Pied de page
  doc.setFontSize(8);
  doc.text('Facture générée automatiquement par UNIALIST', 105, 280, { align: 'center' });

  return doc;
}

/**
 * Extrait les informations de facture depuis un message
 */
export function extractInvoiceData(message: string): Partial<InvoiceData> | null {
  // Patterns de détection
  const patterns = {
    clientName: /(?:client|pour|à)\s*:?\s*([A-ZÀ-ÿ][a-zà-ÿ]+(?:\s+[A-ZÀ-ÿ][a-zà-ÿ]+)*)/i,
    amount: /(\d+(?:[.,]\d{1,2})?)\s*€?\s*(?:HT|ht)?/i,
    description: /(?:pour|prestation|travaux|installation)\s*:?\s*([^,\.]+)/i,
  };

  const clientMatch = message.match(patterns.clientName);
  const amountMatch = message.match(patterns.amount);
  const descriptionMatch = message.match(patterns.description);

  if (!clientMatch || !amountMatch) {
    return null;
  }

  return {
    clientName: clientMatch[1].trim(),
    amountHT: parseFloat(amountMatch[1].replace(',', '.')),
    description: descriptionMatch ? descriptionMatch[1].trim() : 'Prestation',
    date: new Date().toLocaleDateString('fr-FR'),
    invoiceNumber: `FACT-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
  };
}

/**
 * Télécharge le PDF
 */
export function downloadInvoicePDF(doc: jsPDF, filename: string = 'facture.pdf') {
  doc.save(filename);
}

