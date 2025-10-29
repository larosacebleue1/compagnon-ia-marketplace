/**
 * Parse une réponse IA pour extraire les données de facture
 */
export interface ParsedInvoice {
  client: string;
  amountHT: number;
  tva: number;
  amountTTC: number;
  description: string;
  date: string;
  invoiceNumber: string;
}

export function parseInvoiceFromMessage(message: string): ParsedInvoice | null {
  // Vérifier si le message contient le format de facture
  if (!message.includes('📄') && !message.includes('DONNÉES FACTURE')) {
    return null;
  }

  try {
    // Patterns d'extraction
    const patterns = {
      client: /\*\*Client\s*:\*\*\s*(.+?)(?:\n|$)/i,
      amountHT: /\*\*Montant HT\s*:\*\*\s*([\d.,]+)\s*€/i,
      tva: /\*\*TVA\s*(?:\d+%\s*)?:\*\*\s*([\d.,]+)\s*€/i,
      amountTTC: /\*\*Montant TTC\s*:\*\*\s*([\d.,]+)\s*€/i,
      description: /\*\*Description\s*:\*\*\s*(.+?)(?:\n|$)/i,
      date: /\*\*Date\s*:\*\*\s*(.+?)(?:\n|$)/i,
      invoiceNumber: /\*\*N°\s*Facture\s*(?:suggéré\s*)?:\*\*\s*(.+?)(?:\n|$)/i,
    };

    const clientMatch = message.match(patterns.client);
    const amountHTMatch = message.match(patterns.amountHT);
    const tvaMatch = message.match(patterns.tva);
    const amountTTCMatch = message.match(patterns.amountTTC);
    const descriptionMatch = message.match(patterns.description);
    const dateMatch = message.match(patterns.date);
    const invoiceNumberMatch = message.match(patterns.invoiceNumber);

    // Vérifier que les champs essentiels sont présents
    if (!clientMatch || !amountHTMatch || !tvaMatch || !amountTTCMatch) {
      return null;
    }

    return {
      client: clientMatch[1].trim(),
      amountHT: parseFloat(amountHTMatch[1].replace(',', '.')),
      tva: parseFloat(tvaMatch[1].replace(',', '.')),
      amountTTC: parseFloat(amountTTCMatch[1].replace(',', '.')),
      description: descriptionMatch ? descriptionMatch[1].trim() : 'Prestation',
      date: dateMatch ? dateMatch[1].trim() : new Date().toLocaleDateString('fr-FR'),
      invoiceNumber: invoiceNumberMatch ? invoiceNumberMatch[1].trim() : `FACT-${Date.now()}`,
    };
  } catch (error) {
    console.error('Erreur lors du parsing de la facture:', error);
    return null;
  }
}

/**
 * Vérifie si un message contient une facture
 */
export function containsInvoice(message: string): boolean {
  return message.includes('📄 **DONNÉES FACTURE') || 
         message.includes('DONNÉES FACTURE PRÊTES');
}

