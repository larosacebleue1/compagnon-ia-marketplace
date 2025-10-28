import { useState } from 'react';
import { useLocation, useParams } from 'wouter';
import { ArrowLeft, Save } from 'lucide-react';

type PermissionLevel = 'never' | 'suggest' | 'automatic';

interface PermissionSetting {
  id: string;
  name: string;
  level: PermissionLevel;
  description: string;
}

export default function PermissionDetail() {
  const [, setLocation] = useLocation();
  const { category } = useParams();
  
  const [settings, setSettings] = useState<PermissionSetting[]>([
    {
      id: 'send_emails',
      name: 'Envoyer des e-mails',
      level: 'automatic',
      description: 'Permet à UNIALIST d\'envoyer des emails en votre nom',
    },
    {
      id: 'read_emails',
      name: 'Lire mes e-mails',
      level: 'suggest',
      description: 'Accès à votre boîte de réception pour contextualiser les réponses',
    },
    {
      id: 'draft_emails',
      name: 'Créer des brouillons',
      level: 'automatic',
      description: 'Préparer des brouillons d\'emails que vous pourrez valider',
    },
  ]);

  const [notificationLevel, setNotificationLevel] = useState(75);
  const [feedbackLevel, setFeedbackLevel] = useState(60);
  const [emailLimit, setEmailLimit] = useState(5);
  const [receiveOffers, setReceiveOffers] = useState(true);

  const updateLevel = (id: string, level: PermissionLevel) => {
    setSettings(settings.map(s =>
      s.id === id ? { ...s, level } : s
    ));
  };

  const handleSave = () => {
    // TODO: Save to backend
    alert('Paramètres sauvegardés !');
    setLocation('/permissions');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => setLocation('/permissions')}
            className="flex items-center gap-2 text-blue-700 hover:text-blue-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour aux permissions
          </button>
          <h1 className="text-4xl font-bold text-blue-900 mb-2">
            Paramètres des autorisations
          </h1>
          <p className="text-gray-600 text-lg capitalize">
            Configuration pour : {category || 'emails'}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-xl">
          {/* Permission Settings */}
          {settings.map((setting) => (
            <div key={setting.id} className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {setting.name}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {setting.description}
              </p>

              {/* Level Selector */}
              <div className="flex gap-4">
                <button
                  onClick={() => updateLevel(setting.id, 'never')}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                    setting.level === 'never'
                      ? 'bg-gray-200 text-gray-900 ring-2 ring-gray-400'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Jamais
                </button>
                <button
                  onClick={() => updateLevel(setting.id, 'suggest')}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                    setting.level === 'suggest'
                      ? 'bg-yellow-100 text-yellow-900 ring-2 ring-yellow-400'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Suggérer
                </button>
                <button
                  onClick={() => updateLevel(setting.id, 'automatic')}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                    setting.level === 'automatic'
                      ? 'bg-blue-100 text-blue-900 ring-2 ring-blue-400'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Automatique
                </button>
              </div>
            </div>
          ))}

          <div className="border-t border-gray-200 my-8"></div>

          {/* Notification Slider */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Notifications importantes
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Niveau de notifications pour les actions importantes
            </p>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="100"
                value={notificationLevel}
                onChange={(e) => setNotificationLevel(parseInt(e.target.value))}
                className="flex-1 h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className="text-lg font-bold text-blue-700 w-12 text-right">
                {notificationLevel}%
              </span>
            </div>
          </div>

          {/* Feedback Slider */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Feedback utilisateur
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Fréquence des demandes de feedback
            </p>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="100"
                value={feedbackLevel}
                onChange={(e) => setFeedbackLevel(parseInt(e.target.value))}
                className="flex-1 h-2 bg-green-200 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
              <span className="text-lg font-bold text-green-700 w-12 text-right">
                {feedbackLevel}%
              </span>
            </div>
          </div>

          {/* Checkbox */}
          <div className="mb-8">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={receiveOffers}
                onChange={(e) => setReceiveOffers(e.target.checked)}
                className="w-6 h-6 rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
              />
              <div>
                <span className="text-lg font-bold text-gray-800">
                  Offres et promotions
                </span>
                <p className="text-sm text-gray-600">
                  Recevoir des offres spéciales et des nouveautés
                </p>
              </div>
            </label>
          </div>

          {/* Email Limit */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              E-mails par semaine
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Nombre maximum d'emails automatiques par semaine
            </p>
            <div className="flex items-center gap-4">
              <input
                type="number"
                min="0"
                max="50"
                value={emailLimit}
                onChange={(e) => setEmailLimit(parseInt(e.target.value))}
                className="w-24 px-4 py-2 text-lg font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              />
              <span className="text-gray-600">maximum</span>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              onClick={() => setLocation('/permissions')}
              className="px-6 py-3 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              <Save className="w-5 h-5" />
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

