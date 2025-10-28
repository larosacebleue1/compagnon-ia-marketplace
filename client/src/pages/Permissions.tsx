import { useState } from 'react';
import { useLocation } from 'wouter';
import {
  Mail,
  Euro,
  ShoppingCart,
  Calendar,
  FolderOpen,
  ArrowLeft,
  Activity,
} from 'lucide-react';

interface PermissionCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  enabled: boolean;
  description: string;
}

export default function Permissions() {
  const [, setLocation] = useLocation();
  
  const [categories, setCategories] = useState<PermissionCategory[]>([
    {
      id: 'emails',
      name: 'E-mails',
      icon: <Mail className="w-12 h-12" />,
      enabled: true,
      description: 'Lire et envoyer des emails',
    },
    {
      id: 'billing',
      name: 'Facturation',
      icon: <Euro className="w-12 h-12" />,
      enabled: false,
      description: 'Créer et envoyer des factures',
    },
    {
      id: 'orders',
      name: 'Commandes',
      icon: <ShoppingCart className="w-12 h-12" />,
      enabled: true,
      description: 'Passer des commandes fournisseurs',
    },
    {
      id: 'calendar',
      name: 'Calendrier',
      icon: <Calendar className="w-12 h-12" />,
      enabled: false,
      description: 'Gérer votre agenda',
    },
    {
      id: 'files',
      name: 'Fichiers',
      icon: <FolderOpen className="w-12 h-12" />,
      enabled: true,
      description: 'Accéder à vos documents',
    },
  ]);

  const toggleCategory = (id: string) => {
    setCategories(categories.map(cat =>
      cat.id === id ? { ...cat, enabled: !cat.enabled } : cat
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => setLocation('/app')}
            className="flex items-center gap-2 text-blue-700 hover:text-blue-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour
          </button>
          <h1 className="text-4xl font-bold text-blue-900 mb-2">
            Gestion des permissions
          </h1>
          <p className="text-gray-600 text-lg">
            Contrôlez ce que UNIALIST peut faire pour vous
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setLocation('/permissions/activity')}
            className="flex items-center gap-2 px-6 py-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
          >
            <Activity className="w-5 h-5 text-blue-700" />
            <span className="font-medium text-gray-700">Journal d'activité</span>
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-blue-200"
              onClick={() => setLocation(`/permissions/${category.id}`)}
            >
              {/* Icon */}
              <div
                className={`mb-4 ${
                  category.enabled
                    ? category.id === 'emails'
                      ? 'text-blue-500'
                      : category.id === 'billing'
                      ? 'text-yellow-500'
                      : category.id === 'orders'
                      ? 'text-green-500'
                      : category.id === 'calendar'
                      ? 'text-red-400'
                      : 'text-cyan-500'
                    : 'text-gray-300'
                }`}
              >
                {category.icon}
              </div>

              {/* Name */}
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {category.name}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4">
                {category.description}
              </p>

              {/* Status and Toggle */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-sm font-medium ${
                    category.enabled ? 'text-green-600' : 'text-gray-400'
                  }`}
                >
                  {category.enabled ? 'Activé' : 'Désactivé'}
                </span>

                {/* Toggle Switch */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCategory(category.id);
                  }}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    category.enabled
                      ? category.id === 'emails'
                        ? 'bg-blue-500'
                        : category.id === 'billing'
                        ? 'bg-yellow-500'
                        : category.id === 'orders'
                        ? 'bg-green-500'
                        : category.id === 'calendar'
                        ? 'bg-red-400'
                        : 'bg-cyan-500'
                      : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      category.enabled ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Emergency Stop */}
        <div className="mt-8 bg-red-50 border-2 border-red-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-red-900 mb-2 flex items-center gap-2">
            🚨 Arrêt d'urgence
          </h3>
          <p className="text-red-700 mb-4">
            En cas de problème, vous pouvez stopper toutes les actions automatiques instantanément.
          </p>
          <button className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors">
            🛑 TOUT ARRÊTER
          </button>
        </div>
      </div>
    </div>
  );
}

