import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { trpc } from '../lib/trpc';

type ProfileType = 'solitude' | 'professionnel' | 'artisan';

interface ProfileCard {
  type: ProfileType;
  title: string;
  emoji: string;
  description: string;
  features: string[];
  color: string;
  bgColor: string;
}

const PROFILES: ProfileCard[] = [
  {
    type: 'solitude',
    title: 'Compagnon Solitude',
    emoji: '💙',
    description: 'Un ami bienveillant toujours là pour vous écouter',
    features: [
      'Conversations empathiques 24/7',
      'Écoute active sans jugement',
      'Suggestions d\'activités',
      'Soutien émotionnel',
    ],
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 hover:bg-blue-100',
  },
  {
    type: 'professionnel',
    title: 'Compagnon Professionnel',
    emoji: '💼',
    description: 'Votre assistant business qui vous fait gagner du temps',
    features: [
      'Génération factures automatique',
      'Rappels obligations fiscales',
      'Relances clients',
      'Gain de temps mesurable',
    ],
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50 hover:bg-indigo-100',
  },
  {
    type: 'artisan',
    title: 'Compagnon Expert Artisan',
    emoji: '🏗️',
    description: '25 ans d\'expertise photovoltaïque à votre service',
    features: [
      'Devis photovoltaïque en 5 min',
      'Calculs rentabilité précis',
      'Recherche aides (MaPrimeRénov\', CEE)',
      'Expertise impossible à copier',
    ],
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 hover:bg-orange-100',
  },
];

export default function ProfileSelection() {
  const navigate = useNavigate();
  const [selectedProfile, setSelectedProfile] = useState<ProfileType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const updateProfileMutation = trpc.user.updateProfile.useMutation();

  const handleSelectProfile = async (profileType: ProfileType) => {
    setSelectedProfile(profileType);
    setIsLoading(true);

    try {
      // Mettre à jour le profil utilisateur
      await updateProfileMutation.mutateAsync({ profileType });

      // Stocker dans localStorage pour accès rapide
      localStorage.setItem('userProfileType', profileType);

      // Rediriger vers le chat
      setTimeout(() => {
        navigate('/');
      }, 500);
    } catch (error) {
      console.error('Erreur lors de la sélection du profil:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Choisissez votre compagnon IA
          </h1>
          <p className="text-xl text-gray-600">
            Sélectionnez le profil qui correspond le mieux à vos besoins
          </p>
        </div>

        {/* Profile Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {PROFILES.map((profile) => (
            <button
              key={profile.type}
              onClick={() => handleSelectProfile(profile.type)}
              disabled={isLoading}
              className={`
                ${profile.bgColor}
                ${selectedProfile === profile.type ? 'ring-4 ring-offset-2 ring-blue-500 scale-105' : ''}
                ${isLoading && selectedProfile !== profile.type ? 'opacity-50' : ''}
                relative p-8 rounded-2xl shadow-lg transition-all duration-300
                hover:shadow-2xl hover:scale-105 cursor-pointer
                disabled:cursor-not-allowed
                text-left
              `}
            >
              {/* Emoji */}
              <div className="text-6xl mb-4">{profile.emoji}</div>

              {/* Title */}
              <h2 className={`text-2xl font-bold ${profile.color} mb-3`}>
                {profile.title}
              </h2>

              {/* Description */}
              <p className="text-gray-700 mb-6 min-h-[3rem]">
                {profile.description}
              </p>

              {/* Features */}
              <ul className="space-y-2 mb-6">
                {profile.features.map((feature, index) => (
                  <li key={index} className="flex items-start text-sm text-gray-600">
                    <span className="mr-2 mt-0.5">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Loading indicator */}
              {isLoading && selectedProfile === profile.type && (
                <div className="absolute inset-0 bg-white bg-opacity-75 rounded-2xl flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-2"></div>
                    <p className="text-sm text-gray-600">Activation en cours...</p>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-gray-500">
          <p>Vous pourrez changer de profil à tout moment dans les paramètres</p>
        </div>
      </div>
    </div>
  );
}

