import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '../lib/trpc';

export default function Marketplace() {
  const [, setLocation] = useLocation();
  const [providerInfo, setProviderInfo] = useState<any>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const token = localStorage.getItem('provider_token');
    const info = localStorage.getItem('provider_info');
    
    if (!token || !info) {
      // Pas connecté → rediriger vers login
      setLocation('/login-installateur');
      return;
    }
    
    try {
      setProviderInfo(JSON.parse(info));
      setIsCheckingAuth(false);
    } catch (error) {
      // Token invalide → rediriger vers login
      localStorage.removeItem('provider_token');
      localStorage.removeItem('provider_info');
      setLocation('/login-installateur');
    }
  }, [setLocation]);
  
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-2xl font-bold text-blue-600">⏳ Vérification authentification...</div>
      </div>
    );
  }
  const [selectedService, setSelectedService] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');

  // Récupérer les leads disponibles
  const { data: leads, isLoading } = trpc.leads.listAvailableLeads.useQuery({
    serviceIds: selectedService === 'all' ? undefined : [parseInt(selectedService)],
    postalCodes: selectedDepartment === 'all' ? undefined : [selectedDepartment],
    limit: 50,
    offset: 0,
  });

  // Mutation réservation lead
  const reserveLead = trpc.leads.reserveLead.useMutation({
    onSuccess: () => {
      alert('✅ Lead réservé avec succès ! Vous avez 48h pour contacter le client.');
      window.location.reload();
    },
    onError: (error) => {
      alert('❌ ' + error.message);
    },
  });

  const handleReserve = (leadId: number) => {
    if (confirm('Réserver ce lead pour 48h ?')) {
      reserveLead.mutate({ leadId });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getCommission = (price: number) => {
    return price * 0.06; // 6%
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-2xl font-bold text-blue-600">⏳ Chargement des leads...</div>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem('provider_token');
    localStorage.removeItem('provider_info');
    setLocation('/login-installateur');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Top Bar */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              {providerInfo?.companyName?.charAt(0) || 'O'}
            </div>
            <div>
              <div className="font-bold text-gray-900">{providerInfo?.companyName}</div>
              <div className="text-sm text-gray-500">{providerInfo?.email}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            🚪 Déconnexion
          </button>
        </div>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
            🏪 Marketplace Leads
          </h1>
          <p className="text-xl text-gray-700 mb-6">
            Leads qualifiés à <span className="font-bold text-green-600">6% seulement</span> (60% moins cher que le marché)
          </p>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-xl">
              <div className="text-3xl font-bold">{leads?.length || 0}</div>
              <div className="text-sm opacity-90">Leads disponibles</div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-xl">
              <div className="text-3xl font-bold">6%</div>
              <div className="text-sm opacity-90">Commission</div>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-4 rounded-xl">
              <div className="text-3xl font-bold">48h</div>
              <div className="text-sm opacity-90">Réservation</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-xl">
              <div className="text-3xl font-bold">100%</div>
              <div className="text-sm opacity-90">Qualifiés</div>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🔍 Filtres</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Service
              </label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option value="all">Tous les services</option>
                <option value="1">Photovoltaïque</option>
                <option value="2">Plomberie</option>
                <option value="3">Électricité</option>
                <option value="4">Chauffage</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Département
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option value="all">Tous les départements</option>
                {Array.from({ length: 95 }, (_, i) => {
                  const dept = String(i + 1).padStart(2, '0');
                  return <option key={dept} value={dept}>{dept}</option>;
                })}
              </select>
            </div>
          </div>
        </div>

        {/* Liste Leads */}
        {!leads || leads.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Aucun lead disponible</h3>
            <p className="text-gray-600">
              Modifiez vos filtres ou revenez plus tard. De nouveaux leads arrivent régulièrement !
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {leads?.map((lead: any) => {
              const serviceData = lead.serviceData ? JSON.parse(lead.serviceData) : {};
              const commission = getCommission(lead.totalPrice);

              return (
                <div
                  key={lead.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all border-2 border-gray-200 hover:border-blue-500 overflow-hidden"
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="text-sm opacity-90">Lead #{lead.id}</div>
                        <div className="text-2xl font-bold">{formatPrice(lead.totalPrice)}</div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold">
                        {lead.service?.name || 'Service'}
                      </div>
                    </div>
                    <div className="text-sm opacity-90">
                      Commission : <span className="font-bold">{formatPrice(commission)}</span> (6%)
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6 space-y-3">
                    {/* Localisation */}
                    <div className="flex items-start">
                      <span className="text-2xl mr-3">📍</span>
                      <div>
                        <div className="font-semibold text-gray-800">{lead.city}</div>
                        <div className="text-sm text-gray-600">{lead.postalCode}</div>
                      </div>
                    </div>

                    {/* Détails projet PV */}
                    {serviceData.power && (
                      <div className="flex items-start">
                        <span className="text-2xl mr-3">⚡</span>
                        <div>
                          <div className="font-semibold text-gray-800">
                            {serviceData.power} kWc
                          </div>
                          <div className="text-sm text-gray-600">
                            Production : {serviceData.annualProduction?.toLocaleString('fr-FR')} kWh/an
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Parcours */}
                    <div className="flex items-start">
                      <span className="text-2xl mr-3">
                        {lead.chosenPath === 'express' ? '🚀' : '🐢'}
                      </span>
                      <div>
                        <div className="font-semibold text-gray-800">
                          {lead.chosenPath === 'express' ? 'Parcours Express' : 'Parcours Standard'}
                        </div>
                        <div className="text-sm text-gray-600">
                          {lead.chosenPath === 'express' 
                            ? 'Acompte 30% immédiat, travaux sous 48h'
                            : 'Délai rétractation 14j'}
                        </div>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="flex items-start">
                      <span className="text-2xl mr-3">📅</span>
                      <div>
                        <div className="font-semibold text-gray-800">
                          {new Date(lead.createdAt).toLocaleDateString('fr-FR')}
                        </div>
                        <div className="text-sm text-gray-600">
                          Il y a {Math.floor((Date.now() - new Date(lead.createdAt).getTime()) / (1000 * 60 * 60))}h
                        </div>
                      </div>
                    </div>

                    {/* Statut */}
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          <span className="font-semibold text-green-600">Disponible</span>
                        </div>
                        {lead.chosenPath === 'express' && (
                          <div className="bg-orange-100 text-orange-800 text-xs font-bold px-2 py-1 rounded">
                            PRIORITÉ
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-4 bg-gray-50 border-t border-gray-200">
                    {lead.status === 'reserved' && lead.reservedBy === providerInfo?.id ? (
                      <button
                        onClick={() => setLocation(`/payment/${lead.id}`)}
                        className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold py-3 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
                      >
                        💳 Acheter ce lead ({formatPrice(getCommission(lead.totalPrice))})
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleReserve(lead.id)}
                          disabled={reserveLead.isPending || lead.status !== 'available'}
                          className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white font-bold py-3 rounded-lg hover:from-blue-700 hover:to-green-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {reserveLead.isPending ? '⏳ Réservation...' : '🎯 Réserver ce lead (48h)'}
                        </button>
                        <p className="text-xs text-gray-500 text-center mt-2">
                          Coordonnées client dévoilées après réservation
                        </p>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Info */}
        <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-blue-800 mb-2">ℹ️ Comment ça marche ?</h3>
          <ol className="text-sm text-blue-900 space-y-2">
            <li><strong>1.</strong> Réservez un lead → Vous avez 48h d'exclusivité</li>
            <li><strong>2.</strong> Contactez le client → Coordonnées dévoilées immédiatement</li>
            <li><strong>3.</strong> Présentez votre devis → Conforme au prix affiché</li>
            <li><strong>4.</strong> Client signe → Uploadez le devis signé</li>
            <li><strong>5.</strong> Payez la commission 6% → Lead devient "Vendu"</li>
            <li><strong>6.</strong> Réalisez les travaux → Client satisfait !</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

