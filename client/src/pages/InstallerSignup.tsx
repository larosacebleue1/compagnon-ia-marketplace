import { useState } from 'react';
import { useLocation } from 'wouter';

export default function InstallerSignup() {
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCharte, setShowCharte] = useState(false);
  const [charteAccepted, setCharteAccepted] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>(['photovoltaique']);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);

  const services = [
    { id: 'photovoltaique', label: 'Installation Photovoltaïque', commission: '6% (690€ pour 11,500€)' },
    { id: 'plomberie', label: 'Plomberie', commission: '50€ fixe' },
    { id: 'electricite', label: 'Électricité', commission: '80€ fixe' },
    { id: 'chauffage', label: 'Chauffage / Climatisation', commission: '100€ fixe' },
  ];

  const departements = [
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

  const formesJuridiques = [
    'SARL', 'SAS', 'SASU', 'EURL', 'SA', 'SNC', 'EI', 'Auto-entrepreneur',
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!charteAccepted) {
      alert('⚠️ Vous devez accepter la Charte Qualité pour continuer.');
      return;
    }

    if (selectedServices.length === 0) {
      alert('⚠️ Sélectionnez au moins un service.');
      return;
    }

    if (selectedDepartments.length === 0) {
      alert('⚠️ Sélectionnez au moins un département d\'intervention.');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      
      // Validation description (500 caractères min)
      const description = formData.get('description') as string;
      if (description.length < 500) {
        alert('⚠️ La description de votre activité doit contenir au moins 500 caractères.');
        setIsSubmitting(false);
        return;
      }

      const providerData = {
        // Entreprise
        companyName: formData.get('companyName') as string,
        siret: formData.get('siret') as string,
        formeJuridique: formData.get('formeJuridique') as string,
        capital: parseFloat(formData.get('capital') as string),
        dateCreation: formData.get('dateCreation') as string,
        effectif: parseInt(formData.get('effectif') as string),
        caAnnuel: parseFloat(formData.get('caAnnuel') as string),
        numeroTVA: formData.get('numeroTVA') as string,
        siteWeb: formData.get('siteWeb') as string,
        anneesExperience: parseInt(formData.get('anneesExperience') as string),
        
        // Contact
        contactName: formData.get('contactName') as string,
        contactEmail: formData.get('contactEmail') as string,
        contactPhone: formData.get('contactPhone') as string,
        password: formData.get('password') as string,
        
        // Adresse
        address: formData.get('address') as string,
        city: formData.get('city') as string,
        postalCode: formData.get('postalCode') as string,
        
        // Services et zones
        services: selectedServices,
        serviceDepartments: selectedDepartments,
        
        // Présentation
        description: description,
        specialites: formData.get('specialites') as string,
        references: formData.get('references') as string,
        
        // Certifications
        certifications: formData.get('certifications') as string,
        
        // Documents (TODO: Upload S3)
        // documentKbis, documentAssuranceDecennale, etc.
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

      alert('✅ ' + (result.result?.data?.message || 'Inscription envoyée avec succès ! Nous validons votre dossier sous 48-72h.'));
      setLocation('/');
    } catch (error: any) {
      console.error('Error creating provider:', error);
      alert('❌ Erreur lors de l\'inscription. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
            Rejoignez la Marketplace Compagnon IA
          </h1>
          <p className="text-xl text-gray-700 mb-6">
            Recevez des leads qualifiés <span className="font-bold text-green-600">60% moins cher</span> que le marché
          </p>
          
          {/* Arguments */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-4 rounded-xl shadow-lg border-2 border-green-500">
              <div className="text-3xl font-bold text-green-600">6%</div>
              <div className="text-sm text-gray-600">Au lieu de 15%</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-lg border-2 border-blue-500">
              <div className="text-3xl font-bold text-blue-600">690€</div>
              <div className="text-sm text-gray-600">Lead 6kWc (11,500€)</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-lg border-2 border-orange-500">
              <div className="text-3xl font-bold text-orange-600">-1,035€</div>
              <div className="text-sm text-gray-600">Économisés par lead</div>
            </div>
          </div>

          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-4 mb-8">
            <p className="text-sm font-semibold text-yellow-800">
              ⚠️ <strong>EXIGENCES QUALITÉ STRICTES</strong> : Nous validons manuellement chaque installateur (48-72h).
              Documents obligatoires, certifications, assurances, charte qualité.
            </p>
          </div>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-8 space-y-8">
          
          {/* Section 1 : Informations Entreprise */}
          <div className="border-l-4 border-blue-500 pl-6">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">📋 Informations Entreprise</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Raison sociale * <span className="text-red-500">●</span>
                </label>
                <input
                  type="text"
                  name="companyName"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="SARL SOLEIL ENERGIE"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  SIRET (14 chiffres) * <span className="text-red-500">●</span>
                </label>
                <input
                  type="text"
                  name="siret"
                  required
                  pattern="[0-9]{14}"
                  maxLength={14}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="12345678901234"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Forme juridique * <span className="text-red-500">●</span>
                </label>
                <select
                  name="formeJuridique"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Sélectionnez</option>
                  {formesJuridiques.map(forme => (
                    <option key={forme} value={forme}>{forme}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Capital social (€) * <span className="text-red-500">●</span>
                </label>
                <input
                  type="number"
                  name="capital"
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="10000"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date de création * <span className="text-red-500">●</span>
                </label>
                <input
                  type="date"
                  name="dateCreation"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Effectif (nombre salariés) * <span className="text-red-500">●</span>
                </label>
                <input
                  type="number"
                  name="effectif"
                  required
                  min="1"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="5"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  CA annuel (€) * <span className="text-red-500">●</span>
                </label>
                <input
                  type="number"
                  name="caAnnuel"
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="500000"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  N° TVA intracommunautaire
                </label>
                <input
                  type="text"
                  name="numeroTVA"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="FR12345678901"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Site web
                </label>
                <input
                  type="url"
                  name="siteWeb"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="https://www.votre-site.fr"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Années d'expérience * <span className="text-red-500">●</span>
                </label>
                <input
                  type="number"
                  name="anneesExperience"
                  required
                  min="0"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="10"
                />
              </div>
            </div>
          </div>

          {/* Section 2 : Contact */}
          <div className="border-l-4 border-green-500 pl-6">
            <h2 className="text-2xl font-bold text-green-600 mb-4">👤 Contact</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nom du contact * <span className="text-red-500">●</span>
                </label>
                <input
                  type="text"
                  name="contactName"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                  placeholder="Jean Dupont"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email * <span className="text-red-500">●</span>
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                  placeholder="contact@entreprise.fr"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Téléphone * <span className="text-red-500">●</span>
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                  placeholder="06 12 34 56 78"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mot de passe * <span className="text-red-500">●</span>
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  minLength={8}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                  placeholder="Minimum 8 caractères"
                />
                <p className="text-xs text-gray-500 mt-1">Pour accéder à la marketplace ORIASOL</p>
              </div>
            </div>
          </div>

          {/* Section 3 : Adresse */}
          <div className="border-l-4 border-purple-500 pl-6">
            <h2 className="text-2xl font-bold text-purple-600 mb-4">📍 Adresse</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Adresse complète * <span className="text-red-500">●</span>
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                  placeholder="123 Rue de la République"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ville * <span className="text-red-500">●</span>
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                  placeholder="Marseille"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Code postal * <span className="text-red-500">●</span>
                </label>
                <input
                  type="text"
                  name="postalCode"
                  required
                  pattern="[0-9]{5}"
                  maxLength={5}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                  placeholder="13001"
                />
              </div>
            </div>
          </div>

          {/* Section 4 : Services */}
          <div className="border-l-4 border-orange-500 pl-6">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">🔧 Services proposés *</h2>
            
            <div className="grid md:grid-cols-2 gap-3">
              {services.map(service => (
                <label
                  key={service.id}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedServices.includes(service.id)
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-300 hover:border-orange-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedServices.includes(service.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedServices([...selectedServices, service.id]);
                      } else {
                        setSelectedServices(selectedServices.filter(s => s !== service.id));
                      }
                    }}
                    className="w-5 h-5 text-orange-600"
                  />
                  <div className="ml-3">
                    <div className="font-semibold text-gray-800">{service.label}</div>
                    <div className="text-sm text-gray-600">{service.commission}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Section 5 : Départements */}
          <div className="border-l-4 border-pink-500 pl-6">
            <h2 className="text-2xl font-bold text-pink-600 mb-4">🗺️ Départements d'intervention *</h2>
            <p className="text-sm text-gray-600 mb-4">
              Sélectionnez les départements où vous intervenez (minimum 1)
            </p>
            
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
              {departements.map(dept => (
                <button
                  key={dept}
                  type="button"
                  onClick={() => {
                    if (selectedDepartments.includes(dept)) {
                      setSelectedDepartments(selectedDepartments.filter(d => d !== dept));
                    } else {
                      setSelectedDepartments([...selectedDepartments, dept]);
                    }
                  }}
                  className={`px-3 py-2 rounded-lg font-semibold transition-all ${
                    selectedDepartments.includes(dept)
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-pink-100'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {selectedDepartments.length} département(s) sélectionné(s)
            </p>
          </div>

          {/* Section 6 : Présentation */}
          <div className="border-l-4 border-indigo-500 pl-6">
            <h2 className="text-2xl font-bold text-indigo-600 mb-4">📝 Présentation de votre activité</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description complète * (minimum 500 caractères) <span className="text-red-500">●</span>
                </label>
                <textarea
                  name="description"
                  required
                  minLength={500}
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                  placeholder="Présentez votre entreprise, votre expertise, vos valeurs, vos réalisations..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimum 500 caractères pour une présentation complète
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Spécialités / Points forts
                </label>
                <textarea
                  name="specialites"
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                  placeholder="Ex: Installations résidentielles haut de gamme, SAV 7j/7, garantie 25 ans..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Références clients (optionnel)
                </label>
                <textarea
                  name="references"
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                  placeholder="Ex: 500+ installations réalisées, note 4.8/5 sur Google, partenaire EDF ENR..."
                />
              </div>
            </div>
          </div>

          {/* Section 7 : Certifications */}
          <div className="border-l-4 border-yellow-500 pl-6">
            <h2 className="text-2xl font-bold text-yellow-600 mb-4">🏆 Certifications *</h2>
            <p className="text-sm text-gray-600 mb-4">
              Listez vos certifications (RGE, Qualibat, QualiPV, etc.)
            </p>
            
            <textarea
              name="certifications"
              required
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none"
              placeholder="Ex: RGE QualiPV, Qualibat 5911, Habilitation électrique BR..."
            />
          </div>

          {/* Section 8 : Documents */}
          <div className="border-l-4 border-red-500 pl-6">
            <h2 className="text-2xl font-bold text-red-600 mb-4">📎 Documents obligatoires</h2>
            <p className="text-sm text-gray-600 mb-4">
              ⚠️ <strong>Upload de documents à venir</strong> : Vous recevrez un email avec un lien sécurisé pour uploader vos documents après validation initiale.
            </p>
            
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-red-800 mb-2">Documents requis :</p>
              <ul className="text-sm text-red-700 space-y-1">
                <li>✓ Kbis (moins de 3 mois)</li>
                <li>✓ Assurance décennale (en cours de validité)</li>
                <li>✓ Assurance RC Pro (en cours de validité)</li>
                <li>✓ Certificats de certifications (RGE, Qualibat, etc.)</li>
                <li>✓ Attestation URSSAF (moins de 6 mois)</li>
              </ul>
            </div>
          </div>

          {/* Section 9 : Charte Qualité */}
          <div className="border-l-4 border-teal-500 pl-6">
            <h2 className="text-2xl font-bold text-teal-600 mb-4">📜 Charte Qualité Compagnon IA *</h2>
            
            <div className="bg-teal-50 border-2 border-teal-200 rounded-lg p-6 mb-4">
              <h3 className="font-bold text-teal-800 mb-3">En rejoignant Compagnon IA, je m'engage à :</h3>
              
              <div className="space-y-3 text-sm text-teal-900">
                <div>
                  <p className="font-semibold">✅ QUALITÉ</p>
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• Respecter les normes en vigueur (NF C 15-100, DTU, etc.)</li>
                    <li>• Utiliser du matériel certifié avec garanties constructeur</li>
                    <li>• Fournir un devis détaillé conforme au prix grille</li>
                    <li>• Réaliser les travaux dans les délais convenus</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold">✅ TRANSPARENCE</p>
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• Informer le client de tout surcoût AVANT travaux</li>
                    <li>• Expliquer clairement les travaux réalisés</li>
                    <li>• Fournir tous les documents administratifs</li>
                    <li>• Respecter le délai de rétractation légal (14j)</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold">✅ SERVICE CLIENT</p>
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• Répondre au client sous 24h maximum</li>
                    <li>• Être joignable pendant et après travaux</li>
                    <li>• Assurer le SAV et garanties</li>
                    <li>• Traiter les réclamations avec professionnalisme</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold">✅ ÉTHIQUE</p>
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• Ne pas démarcher le client en dehors de la plateforme</li>
                    <li>• Respecter la confidentialité des données client</li>
                    <li>• Ne pas sous-traiter sans accord préalable</li>
                    <li>• Signaler tout problème à Compagnon IA</li>
                  </ul>
                </div>

                <div className="bg-white p-3 rounded-lg border border-teal-300 mt-4">
                  <p className="font-semibold text-red-600">❌ SANCTIONS</p>
                  <ul className="ml-4 mt-1 space-y-1 text-red-700">
                    <li>• 1er manquement : Avertissement</li>
                    <li>• 2e manquement : Suspension 30 jours</li>
                    <li>• 3e manquement : Exclusion définitive</li>
                  </ul>
                </div>
              </div>
            </div>

            <label className="flex items-start p-4 border-2 border-teal-500 rounded-lg cursor-pointer bg-white">
              <input
                type="checkbox"
                checked={charteAccepted}
                onChange={(e) => setCharteAccepted(e.target.checked)}
                className="w-5 h-5 text-teal-600 mt-1"
                required
              />
              <span className="ml-3 text-sm font-semibold text-gray-800">
                J'ai lu et j'accepte la Charte Qualité Compagnon IA. Je m'engage à respecter tous les engagements listés ci-dessus. <span className="text-red-500">*</span>
              </span>
            </label>
          </div>

          {/* Bouton Submit */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting || !charteAccepted}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                isSubmitting || !charteAccepted
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-green-600 text-white hover:from-blue-700 hover:to-green-700 shadow-lg hover:shadow-xl'
              }`}
            >
              {isSubmitting ? '⏳ Envoi en cours...' : '✅ Envoyer ma candidature'}
            </button>
            
            <p className="text-xs text-gray-500 text-center mt-4">
              En soumettant ce formulaire, vous acceptez que vos données soient traitées pour validation de votre candidature.
              Délai de réponse : 48-72h.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

