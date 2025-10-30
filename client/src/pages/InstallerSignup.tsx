import { useState } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '../lib/trpc';

// Composants UI simples inline
const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-2xl shadow-xl ${className}`}>{children}</div>
);

const Input = ({ className = '', ...props }: any) => (
  <input
    className={`w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-all ${className}`}
    {...props}
  />
);

const Label = ({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) => (
  <label htmlFor={htmlFor} className="block text-sm font-semibold text-gray-700 mb-2">
    {children}
  </label>
);

const Button = ({ children, className = '', disabled = false, ...props }: any) => (
  <button
    disabled={disabled}
    className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${
      disabled
        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
        : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
    } ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default function InstallerSignup() {
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>(['photovoltaique']);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);

  const services = [
    { id: 'photovoltaique', name: 'Photovoltaïque', icon: '🌞' },
    { id: 'plomberie', name: 'Plomberie', icon: '🔧' },
    { id: 'electricite', name: 'Électricité', icon: '⚡' },
    { id: 'chauffage', name: 'Chauffage', icon: '🔥' },
  ];

  const departments = [
    '01', '02', '03', '04', '05', '06', '07', '08', '09', '10',
    '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
    '21', '22', '23', '24', '25', '26', '27', '28', '29', '30',
    '31', '32', '33', '34', '35', '36', '37', '38', '39', '40',
    '41', '42', '43', '44', '45', '46', '47', '48', '49', '50',
    '51', '52', '53', '54', '55', '56', '57', '58', '59', '60',
    '61', '62', '63', '64', '65', '66', '67', '68', '69', '70',
    '71', '72', '73', '74', '75', '76', '77', '78', '79', '80',
    '81', '82', '83', '84', '85', '86', '87', '88', '89', '90',
    '91', '92', '93', '94', '95',
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    try {
      const providerData = {
        companyName: formData.get('companyName') as string,
        siret: formData.get('siret') as string,
        contactName: formData.get('contactName') as string,
        contactEmail: formData.get('contactEmail') as string,
        contactPhone: formData.get('contactPhone') as string,
        address: formData.get('address') as string,
        city: formData.get('city') as string,
        postalCode: formData.get('postalCode') as string,
        serviceDepartments: selectedDepartments,
        services: selectedServices,
        certifications: formData.get('certifications') as string,
        description: formData.get('description') as string,
      };

      // Appeler API createProvider
      const response = await fetch('/api/trpc/leads.createProvider', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(providerData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'inscription');
      }

      const result = await response.json();

      alert('✅ ' + (result.result?.data?.message || 'Inscription envoyée avec succès !'));
      setLocation('/');
    } catch (error: any) {
      console.error('Error creating provider:', error);
      alert('❌ Erreur lors de l\'inscription. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black text-gray-900 mb-4">
            🔨 Rejoignez la Marketplace
          </h1>
          <p className="text-xl text-gray-700 mb-6">
            Recevez des leads qualifiés <strong className="text-blue-600">60% moins cher</strong> que le marché
          </p>
          <div className="flex justify-center gap-8 text-center">
            <div>
              <div className="text-4xl font-black text-blue-600">6%</div>
              <div className="text-sm text-gray-600">Commission</div>
            </div>
            <div>
              <div className="text-4xl font-black text-green-600">690€</div>
              <div className="text-sm text-gray-600">Lead 6kWc</div>
            </div>
            <div>
              <div className="text-4xl font-black text-purple-600">1,035€</div>
              <div className="text-sm text-gray-600">Économisés vs marché</div>
            </div>
          </div>
        </div>

        {/* Avantages */}
        <Card className="p-6 mb-8 bg-gradient-to-r from-blue-50 to-purple-50">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🎯 Pourquoi nous rejoindre ?</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">✅</div>
              <div>
                <strong>Leads ultra-qualifiés</strong>
                <p className="text-sm text-gray-600">Clients déjà engagés sur le prix</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-3xl">💰</div>
              <div>
                <strong>Paiement au résultat</strong>
                <p className="text-sm text-gray-600">Uniquement si devis signé</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-3xl">📈</div>
              <div>
                <strong>Volume régulier</strong>
                <p className="text-sm text-gray-600">Nouveaux leads chaque jour</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-3xl">🏆</div>
              <div>
                <strong>Prix transparents</strong>
                <p className="text-sm text-gray-600">Pas de négociation, prix fixes</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Formulaire */}
        <Card className="p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">📝 Inscription</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Entreprise */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">🏢 Votre entreprise</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="companyName">Nom de l'entreprise *</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    required
                    placeholder="SAS Soleil Énergie"
                  />
                </div>
                <div>
                  <Label htmlFor="siret">SIRET *</Label>
                  <Input
                    id="siret"
                    name="siret"
                    required
                    placeholder="123 456 789 00012"
                    pattern="[0-9]{14}"
                    title="14 chiffres"
                  />
                </div>
                <div>
                  <Label htmlFor="certifications">Certifications</Label>
                  <Input
                    id="certifications"
                    name="certifications"
                    placeholder="RGE, Qualibat, QualiPV..."
                  />
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">👤 Votre contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="contactName">Nom du contact *</Label>
                  <Input
                    id="contactName"
                    name="contactName"
                    required
                    placeholder="Jean Dupont"
                  />
                </div>
                <div>
                  <Label htmlFor="contactEmail">Email *</Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    required
                    placeholder="contact@soleil-energie.fr"
                  />
                </div>
                <div>
                  <Label htmlFor="contactPhone">Téléphone *</Label>
                  <Input
                    id="contactPhone"
                    name="contactPhone"
                    type="tel"
                    required
                    placeholder="06 12 34 56 78"
                  />
                </div>
              </div>
            </div>

            {/* Adresse */}
            <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">📍 Adresse</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="address">Adresse *</Label>
                  <Input
                    id="address"
                    name="address"
                    required
                    placeholder="123 Avenue du Soleil"
                  />
                </div>
                <div>
                  <Label htmlFor="city">Ville *</Label>
                  <Input
                    id="city"
                    name="city"
                    required
                    placeholder="Marseille"
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode">Code postal *</Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    required
                    placeholder="13001"
                    pattern="[0-9]{5}"
                    title="5 chiffres"
                  />
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">🔧 Services proposés *</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {services.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => {
                      if (selectedServices.includes(service.id)) {
                        setSelectedServices(selectedServices.filter((s) => s !== service.id));
                      } else {
                        setSelectedServices([...selectedServices, service.id]);
                      }
                    }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedServices.includes(service.id)
                        ? 'bg-blue-600 text-white border-blue-700'
                        : 'bg-white border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    <div className="text-3xl mb-2">{service.icon}</div>
                    <div className="text-sm font-semibold">{service.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Zones */}
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">🗺️ Zones d'intervention *</h3>
              <p className="text-sm text-gray-600 mb-4">Sélectionnez les départements où vous intervenez</p>
              <div className="grid grid-cols-5 md:grid-cols-10 gap-2 max-h-64 overflow-y-auto p-2">
                {departments.map((dept) => (
                  <button
                    key={dept}
                    type="button"
                    onClick={() => {
                      if (selectedDepartments.includes(dept)) {
                        setSelectedDepartments(selectedDepartments.filter((d) => d !== dept));
                      } else {
                        setSelectedDepartments([...selectedDepartments, dept]);
                      }
                    }}
                    className={`p-2 rounded-lg border-2 font-bold transition-all ${
                      selectedDepartments.includes(dept)
                        ? 'bg-blue-600 text-white border-blue-700'
                        : 'bg-white border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {selectedDepartments.length} département(s) sélectionné(s)
              </p>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Présentation de votre entreprise</Label>
              <textarea
                id="description"
                name="description"
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-all"
                placeholder="Présentez votre entreprise, vos spécialités, vos atouts..."
              />
            </div>

            {/* CGU */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="acceptTerms"
                required
                className="mt-1 w-5 h-5"
              />
              <label htmlFor="acceptTerms" className="text-sm text-gray-700">
                J'accepte les <a href="/cgu" className="text-blue-600 underline">conditions générales d'utilisation</a> et la <a href="/cgv" className="text-blue-600 underline">politique de commission (6%)</a>
              </label>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isSubmitting || selectedServices.length === 0 || selectedDepartments.length === 0}
              className="w-full"
            >
              {isSubmitting ? '⏳ Envoi en cours...' : '🚀 Envoyer mon inscription'}
            </Button>

            <p className="text-center text-sm text-gray-600">
              Votre dossier sera validé sous 48h. Vous recevrez un email de confirmation avec vos identifiants d'accès à la marketplace.
            </p>
          </form>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Des questions ? <a href="mailto:support@compagnon-ia.fr" className="text-blue-600 underline">Contactez-nous</a></p>
        </div>
      </div>
    </div>
  );
}

