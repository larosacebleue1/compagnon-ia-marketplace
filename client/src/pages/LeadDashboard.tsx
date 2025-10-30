import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { trpc } from '../lib/trpc';
// Composants UI simples inline (pas de dépendances externes)
const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-2xl shadow-xl ${className}`}>{children}</div>
);

const Button = ({ children, className = '', variant = 'default', ...props }: any) => (
  <button
    className={`px-6 py-3 rounded-xl font-semibold transition-all ${
      variant === 'outline' ? 'bg-white' : 'bg-blue-600 text-white hover:bg-blue-700'
    } ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default function LeadDashboard() {
  const { token } = useParams<{ token: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    // Charger les données du lead
    fetch(`/api/trpc/leads.getLeadByToken?input=${encodeURIComponent(JSON.stringify({ token }))}`)
      .then(res => res.json())
      .then(result => {
        if (result.result?.data) {
          setData(result.result.data);
        } else {
          console.error('Lead non trouvé ou token invalide');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        console.error('Erreur lors du chargement');
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <div className="text-xl font-semibold text-gray-700">Chargement de votre projet...</div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Projet non trouvé</h1>
          <p className="text-gray-600">Le lien que vous avez utilisé est invalide ou expiré.</p>
        </Card>
      </div>
    );
  }

  const { lead, service, provider } = data;
  const serviceData = lead.serviceData || {};

  // Calculer jours restants période rétractation
  const daysLeft = lead.coolingOffEndsAt 
    ? Math.ceil((new Date(lead.coolingOffEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  // Statuts timeline
  const statuses = [
    { key: 'pending', label: 'Demande envoyée', icon: '📝', done: true },
    { key: 'reserved', label: 'Installateur trouvé', icon: '🔍', done: lead.status !== 'pending' },
    { key: 'contacted', label: 'Contact établi', icon: '📞', done: ['contacted', 'quote_sent', 'quote_signed_standard', 'quote_signed_express', 'confirmed', 'in_progress', 'completed'].includes(lead.status) },
    { key: 'quote_sent', label: 'Devis reçu', icon: '📄', done: ['quote_sent', 'quote_signed_standard', 'quote_signed_express', 'confirmed', 'in_progress', 'completed'].includes(lead.status) },
    { key: 'quote_signed', label: 'Devis signé', icon: '✅', done: ['quote_signed_standard', 'quote_signed_express', 'confirmed', 'in_progress', 'completed'].includes(lead.status) },
    { key: 'cooling_off', label: 'Période rétractation', icon: '🛡️', done: lead.status === 'cooling_off' || ['confirmed', 'in_progress', 'completed'].includes(lead.status), current: lead.status === 'cooling_off' },
    { key: 'confirmed', label: 'Projet confirmé', icon: '✅', done: ['confirmed', 'in_progress', 'completed'].includes(lead.status) },
    { key: 'in_progress', label: 'Travaux en cours', icon: '🔨', done: ['in_progress', 'completed'].includes(lead.status), current: lead.status === 'in_progress' },
    { key: 'completed', label: 'Installation terminée', icon: '🎉', done: lead.status === 'completed', current: lead.status === 'completed' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-black text-gray-900 mb-2">
            🌞 Suivi de votre projet solaire
          </h1>
          <p className="text-gray-600">
            {lead.clientFirstName} {lead.clientLastName} • {lead.clientCity}
          </p>
        </div>

        {/* Timeline */}
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📊 Avancement du projet</h2>
          <div className="relative">
            {/* Ligne horizontale */}
            <div className="absolute top-8 left-0 right-0 h-1 bg-gray-200" />
            <div 
              className="absolute top-8 left-0 h-1 bg-green-500 transition-all duration-500"
              style={{ width: `${(statuses.filter(s => s.done).length / statuses.length) * 100}%` }}
            />

            {/* Étapes */}
            <div className="relative flex justify-between">
              {statuses.map((status, index) => (
                <div key={status.key} className="flex flex-col items-center" style={{ width: `${100 / statuses.length}%` }}>
                  <div className={`
                    w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-2 border-4 transition-all
                    ${status.done ? 'bg-green-500 border-green-600' : 'bg-gray-200 border-gray-300'}
                    ${status.current ? 'ring-4 ring-blue-300 animate-pulse' : ''}
                  `}>
                    {status.icon}
                  </div>
                  <div className={`text-xs text-center font-semibold ${status.done ? 'text-green-700' : 'text-gray-500'}`}>
                    {status.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Compte à rebours rétractation */}
        {lead.status === 'cooling_off' && daysLeft && daysLeft > 0 && (
          <Card className="p-6 mb-6 bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-300">
            <div className="flex items-center gap-4">
              <div className="text-6xl">🛡️</div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Période de rétractation</h3>
                <p className="text-gray-700 mb-3">
                  Vous disposez encore de <strong className="text-3xl text-orange-600">{daysLeft} jour{daysLeft > 1 ? 's' : ''}</strong> pour vous rétracter sans frais ni justification.
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" className="border-orange-500 text-orange-700 hover:bg-orange-100">
                    ℹ️ En savoir plus
                  </Button>
                  <Button className="bg-red-600 hover:bg-red-700 text-white">
                    ❌ Annuler mon projet
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Informations projet */}
          <Card className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">📋 Votre installation</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Ville</span>
                <span className="font-semibold">{lead.clientCity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Zone</span>
                <span className="font-semibold">{serviceData.zone || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Puissance</span>
                <span className="font-semibold">{serviceData.power} kWc</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Production estimée</span>
                <span className="font-semibold">{serviceData.annualProduction?.toLocaleString()} kWh/an</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Orientation</span>
                <span className="font-semibold">{serviceData.orientation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Prix</span>
                <span className="font-semibold text-2xl text-green-600">{parseFloat(lead.estimatedAmount).toLocaleString()}€</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Parcours</span>
                <span className={`font-semibold ${lead.chosenPath === 'express' ? 'text-orange-600' : 'text-blue-600'}`}>
                  {lead.chosenPath === 'express' ? '🚀 Express' : '🐢 Standard'}
                </span>
              </div>
              {lead.depositAmount && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Acompte 30%</span>
                  <span className="font-semibold">{parseFloat(lead.depositAmount).toLocaleString()}€</span>
                </div>
              )}
            </div>
          </Card>

          {/* Installateur */}
          <Card className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">🔨 Votre installateur</h3>
            {provider ? (
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600">Entreprise</div>
                  <div className="font-semibold text-lg">{provider.companyName}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Contact</div>
                  <div className="font-semibold">{provider.contactName}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Téléphone</div>
                  <div className="font-semibold">{provider.contactPhone}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Email</div>
                  <div className="font-semibold">{provider.contactEmail}</div>
                </div>
                <div className="pt-3">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    📞 Contacter l'installateur
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">⏳</div>
                <p className="text-gray-600 mb-4">
                  Nous recherchons le meilleur installateur certifié RGE de votre région.
                </p>
                <p className="text-sm text-gray-500">
                  Vous serez contacté sous 48h maximum.
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Actions */}
        <Card className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">🎯 Actions</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Button variant="outline" className="border-blue-500 text-blue-700 hover:bg-blue-50">
              📄 Télécharger mon devis
            </Button>
            <Button variant="outline" className="border-purple-500 text-purple-700 hover:bg-purple-50">
              💬 Poser une question
            </Button>
            <Button variant="outline" className="border-red-500 text-red-700 hover:bg-red-50">
              ⚠️ Signaler un problème
            </Button>
          </div>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>🔒 Lien sécurisé • Ne partagez pas cette URL</p>
          <p className="mt-2">Besoin d'aide ? <a href="mailto:support@compagnon-ia.fr" className="text-blue-600 underline">Contactez-nous</a></p>
        </div>
      </div>
    </div>
  );
}

