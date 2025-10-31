/**
 * PAGE PAIEMENT STRIPE
 * 
 * Permet à un installateur de payer la commission pour acheter un lead
 */

import { useState, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle2, AlertCircle, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

// Initialiser Stripe avec la clé publique
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_...');

/**
 * Formulaire de paiement Stripe
 */
function CheckoutForm({ leadId, amount, onSuccess }: { leadId: number; amount: number; onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const confirmPaymentMutation = trpc.stripePayment.confirmPayment.useMutation({
    onSuccess: (data) => {
      toast.success('Paiement confirmé !');
      onSuccess();
    },
    onError: (error) => {
      toast.error('Erreur lors de la confirmation : ' + error.message);
      setIsProcessing(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      // Confirmer le paiement avec Stripe
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/marketplace`,
        },
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message || 'Une erreur est survenue');
        setIsProcessing(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Confirmer le paiement côté serveur
        confirmPaymentMutation.mutate({
          leadId,
          paymentIntentId: paymentIntent.id,
        });
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Une erreur est survenue');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Montant à payer :</span>
          <span className="text-2xl font-bold text-blue-600">
            {new Intl.NumberFormat('fr-FR', {
              style: 'currency',
              currency: 'EUR',
            }).format(amount)}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Commission ORIASOL 6% (au lieu de 15% ailleurs)
        </p>
      </div>

      <PaymentElement />

      <Button
        type="submit"
        className="w-full"
        disabled={!stripe || isProcessing}
        size="lg"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Traitement en cours...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-5 w-5" />
            Payer {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount)}
          </>
        )}
      </Button>

      <p className="text-xs text-center text-gray-500">
        Paiement sécurisé par Stripe • Vos données bancaires ne sont jamais stockées
      </p>
    </form>
  );
}

/**
 * Page principale de paiement
 */
export default function PaymentPage() {
  const [, params] = useRoute('/payment/:leadId');
  const [, setLocation] = useLocation();
  const leadId = params?.leadId ? parseInt(params.leadId) : 0;

  const [clientSecret, setClientSecret] = useState('');
  const [amount, setAmount] = useState(0);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [purchasedLead, setPurchasedLead] = useState<any>(null);

  // Créer le PaymentIntent
  const createPaymentMutation = trpc.stripePayment.createPaymentIntent.useMutation({
    onSuccess: (data) => {
      setClientSecret(data.clientSecret || '');
      setAmount(data.amount);
    },
    onError: (err) => {
      toast.error('Erreur : ' + err.message);
    },
  });
  
  const isLoading = createPaymentMutation.isPending;
  const error = createPaymentMutation.error;

  useEffect(() => {
    if (leadId > 0 && !paymentSuccess && !clientSecret) {
      createPaymentMutation.mutate({ leadId });
    }
  }, [leadId, paymentSuccess, clientSecret]);

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
    
    // Récupérer les infos du lead acheté
    // (sera fait via confirmPayment mutation)
    setTimeout(() => {
      setLocation('/marketplace');
    }, 3000);
  };

  if (!leadId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Lead invalide</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-700">Préparation du paiement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-red-600">Erreur</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
            <Button
              onClick={() => setLocation('/marketplace')}
              variant="outline"
              className="w-full mt-4"
            >
              Retour à la marketplace
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-center text-2xl">Paiement réussi !</CardTitle>
            <CardDescription className="text-center">
              Vous pouvez maintenant contacter le client
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 text-center">
                  Les coordonnées complètes du client sont maintenant disponibles dans votre dashboard.
                </p>
              </div>
              <Button
                onClick={() => setLocation('/marketplace')}
                className="w-full"
              >
                Retour à la marketplace
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Finaliser l'achat du lead
          </h1>
          <p className="text-gray-600">
            Lead #{leadId} • Paiement sécurisé par Stripe
          </p>
        </div>

        {/* Formulaire de paiement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Informations de paiement
            </CardTitle>
            <CardDescription>
              Payez en toute sécurité avec Stripe
            </CardDescription>
          </CardHeader>
          <CardContent>
            {clientSecret && (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: 'stripe',
                    variables: {
                      colorPrimary: '#2563eb',
                    },
                  },
                }}
              >
                <CheckoutForm
                  leadId={leadId}
                  amount={amount}
                  onSuccess={handlePaymentSuccess}
                />
              </Elements>
            )}
          </CardContent>
        </Card>

        {/* Avantages */}
        <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Pourquoi ORIASOL ?</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span><strong>6% de commission</strong> au lieu de 15% sur les autres plateformes</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span><strong>Leads qualifiés</strong> avec prix accepté par le client</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span><strong>Paiement sécurisé</strong> uniquement après confirmation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

