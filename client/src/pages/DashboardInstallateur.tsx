/**
 * DASHBOARD INSTALLATEUR
 * 
 * Vue d'ensemble pour les installateurs :
 * - Stats clés (leads réservés, achetés, CA total)
 * - Leads réservés (en attente paiement)
 * - Leads achetés (coordonnées clients visibles)
 * - Historique achats
 */

import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Loader2, 
  LogOut, 
  TrendingUp, 
  ShoppingCart, 
  Clock, 
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Euro,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

export default function DashboardInstallateur() {
  const [, setLocation] = useLocation();
  const [providerInfo, setProviderInfo] = useState<any>(null);

  // Vérifier authentification
  useEffect(() => {
    const token = localStorage.getItem('provider_token');
    if (!token) {
      toast.error('Vous devez être connecté');
      setLocation('/login-installateur');
      return;
    }
  }, []);

  // Récupérer infos provider
  const token = localStorage.getItem('provider_token') || '';
  const { data: provider, isLoading: loadingProvider } = trpc.providersAuth.me.useQuery(
    { token },
    { enabled: !!token }
  );

  useEffect(() => {
    if (provider) {
      setProviderInfo(provider);
    }
  }, [provider]);

  // Récupérer leads réservés
  const { data: reservedLeads, isLoading: loadingReserved, refetch: refetchReserved } = trpc.leads.getProviderReservedLeads.useQuery(
    undefined,
    { enabled: !!providerInfo }
  );

  // Récupérer leads achetés
  const { data: purchasedLeads, isLoading: loadingPurchased, refetch: refetchPurchased } = trpc.leads.getProviderPurchasedLeads.useQuery(
    undefined,
    { enabled: !!providerInfo }
  );

  const handleLogout = () => {
    localStorage.removeItem('provider_token');
    toast.success('Déconnexion réussie');
    setLocation('/login-installateur');
  };

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numPrice);
  };

  const getCommission = (totalPrice: number | string) => {
    const price = typeof totalPrice === 'string' ? parseFloat(totalPrice) : totalPrice;
    return price * 0.06;
  };

  if (loadingProvider) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-700">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!providerInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Erreur de chargement</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Calculer stats
  const totalReserved = reservedLeads?.length || 0;
  const totalPurchased = purchasedLeads?.length || 0;
  const totalSpent = parseFloat(providerInfo.totalSpent || '0');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {providerInfo.companyName}
              </h1>
              <p className="text-sm text-gray-600">
                {providerInfo.contactEmail}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setLocation('/marketplace')}
                variant="outline"
              >
                Marketplace
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Leads réservés */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Leads réservés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{totalReserved}</div>
              <p className="text-xs text-gray-500 mt-1">En attente paiement</p>
            </CardContent>
          </Card>

          {/* Leads achetés */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Leads achetés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{totalPurchased}</div>
              <p className="text-xs text-gray-500 mt-1">Coordonnées disponibles</p>
            </CardContent>
          </Card>

          {/* CA total */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Investissement total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {formatPrice(totalSpent)}
              </div>
              <p className="text-xs text-gray-500 mt-1">Commissions payées</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="reserved" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="reserved">
              Leads réservés ({totalReserved})
            </TabsTrigger>
            <TabsTrigger value="purchased">
              Leads achetés ({totalPurchased})
            </TabsTrigger>
          </TabsList>

          {/* Leads réservés */}
          <TabsContent value="reserved">
            {loadingReserved ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Chargement...</p>
              </div>
            ) : !reservedLeads || reservedLeads.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Aucun lead réservé
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Allez sur la marketplace pour réserver des leads
                  </p>
                  <Button onClick={() => setLocation('/marketplace')}>
                    Voir la marketplace
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {reservedLeads.map((lead: any) => {
                  const commission = getCommission(lead.estimatedAmount);
                  const expiresAt = new Date(lead.reservedUntil);
                  const hoursLeft = Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60)));

                  return (
                    <Card key={lead.id} className="border-2 border-orange-200">
                      <CardHeader className="bg-orange-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">Lead #{lead.id}</CardTitle>
                            <CardDescription>{lead.clientCity} ({lead.clientPostalCode})</CardDescription>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-orange-600">
                              {formatPrice(commission)}
                            </div>
                            <div className="text-xs text-gray-600">Commission 6%</div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4 space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Euro className="h-4 w-4 text-gray-500" />
                          <span className="font-semibold">Projet :</span>
                          <span>{formatPrice(lead.estimatedAmount)}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="font-semibold">Expire dans :</span>
                          <span className={hoursLeft < 6 ? 'text-red-600 font-bold' : 'text-gray-700'}>
                            {hoursLeft}h
                          </span>
                        </div>

                        <div className="pt-3 border-t">
                          <Button
                            onClick={() => setLocation(`/payment/${lead.id}`)}
                            className="w-full bg-gradient-to-r from-green-600 to-blue-600"
                            size="lg"
                          >
                            <CreditCard className="mr-2 h-5 w-5" />
                            Acheter maintenant ({formatPrice(commission)})
                          </Button>
                        </div>

                        {hoursLeft < 6 && (
                          <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription className="text-xs">
                              Attention ! Votre réservation expire bientôt
                            </AlertDescription>
                          </Alert>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Leads achetés */}
          <TabsContent value="purchased">
            {loadingPurchased ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Chargement...</p>
              </div>
            ) : !purchasedLeads || purchasedLeads.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Aucun lead acheté
                  </h3>
                  <p className="text-gray-600">
                    Vos leads achetés apparaîtront ici
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {purchasedLeads.map((lead: any) => {
                  const commission = getCommission(lead.estimatedAmount);

                  return (
                    <Card key={lead.id} className="border-2 border-green-200">
                      <CardHeader className="bg-green-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">Lead #{lead.id}</CardTitle>
                            <CardDescription>
                              Acheté le {new Date(lead.convertedAt).toLocaleDateString('fr-FR')}
                            </CardDescription>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-600">
                              {formatPrice(commission)}
                            </div>
                            <div className="text-xs text-gray-600">Payé</div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4 space-y-3">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                          <h4 className="font-semibold text-gray-900 mb-3">Coordonnées client :</h4>
                          
                          <div className="flex items-start gap-2 text-sm">
                            <span className="font-semibold min-w-[80px]">Nom :</span>
                            <span>{lead.clientFirstName} {lead.clientLastName}</span>
                          </div>

                          <div className="flex items-start gap-2 text-sm">
                            <Phone className="h-4 w-4 text-blue-600 mt-0.5" />
                            <span className="font-semibold min-w-[80px]">Téléphone :</span>
                            <a href={`tel:${lead.clientPhone}`} className="text-blue-600 hover:underline">
                              {lead.clientPhone}
                            </a>
                          </div>

                          <div className="flex items-start gap-2 text-sm">
                            <Mail className="h-4 w-4 text-blue-600 mt-0.5" />
                            <span className="font-semibold min-w-[80px]">Email :</span>
                            <a href={`mailto:${lead.clientEmail}`} className="text-blue-600 hover:underline">
                              {lead.clientEmail}
                            </a>
                          </div>

                          <div className="flex items-start gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-blue-600 mt-0.5" />
                            <span className="font-semibold min-w-[80px]">Adresse :</span>
                            <span>
                              {lead.clientAddress}<br />
                              {lead.clientPostalCode} {lead.clientCity}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <Euro className="h-4 w-4 text-gray-500" />
                          <span className="font-semibold">Projet :</span>
                          <span>{formatPrice(lead.estimatedAmount)}</span>
                        </div>

                        <div className="pt-3 border-t flex gap-2">
                          <Button
                            onClick={() => window.location.href = `tel:${lead.clientPhone}`}
                            className="flex-1"
                            variant="outline"
                          >
                            <Phone className="mr-2 h-4 w-4" />
                            Appeler
                          </Button>
                          <Button
                            onClick={() => window.location.href = `mailto:${lead.clientEmail}`}
                            className="flex-1"
                            variant="outline"
                          >
                            <Mail className="mr-2 h-4 w-4" />
                            Email
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

