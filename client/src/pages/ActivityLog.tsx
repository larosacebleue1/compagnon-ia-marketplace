import { useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, Filter, Download } from 'lucide-react';

type ActionStatus = 'approved' | 'rejected' | 'automatic';

interface ActivityItem {
  id: string;
  time: string;
  status: ActionStatus;
  action: string;
  details: string;
}

export default function ActivityLog() {
  const [, setLocation] = useLocation();
  
  const [filter, setFilter] = useState<'all' | ActionStatus>('all');
  
  const [activities] = useState<ActivityItem[]>([
    {
      id: '1',
      time: '15:32',
      status: 'approved',
      action: 'Facture créée',
      details: 'Facture n°2024-0548 pour M. Dupont (140.40€)',
    },
    {
      id: '2',
      time: '14:16',
      status: 'rejected',
      action: 'Commande refusée',
      details: 'Commande de 10 plaquettes de frein chez Autodis (420€)',
    },
    {
      id: '3',
      time: '11:57',
      status: 'automatic',
      action: 'Email envoyé',
      details: 'Facture envoyée à M. Martin (martin@example.com)',
    },
    {
      id: '4',
      time: '10:44',
      status: 'approved',
      action: 'RDV créé',
      details: 'Rendez-vous avec Mme Leblanc - Jeudi 14h',
    },
    {
      id: '5',
      time: '09:20',
      status: 'automatic',
      action: 'Relance impayé',
      details: 'Email de relance envoyé à M. Dubois (facture en retard de 15 jours)',
    },
    {
      id: '6',
      time: '08:45',
      status: 'approved',
      action: 'Devis généré',
      details: 'Devis n°2024-0125 pour réparation Peugeot 308',
    },
  ]);

  const filteredActivities = filter === 'all'
    ? activities
    : activities.filter(a => a.status === filter);

  const getStatusBadge = (status: ActionStatus) => {
    switch (status) {
      case 'approved':
        return (
          <span className="px-3 py-1 bg-blue-100 text-blue-900 rounded-full text-sm font-medium">
            APPROUVÉE
          </span>
        );
      case 'rejected':
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-900 rounded-full text-sm font-medium">
            REJETÉE
          </span>
        );
      case 'automatic':
        return (
          <span className="px-3 py-1 bg-green-100 text-green-900 rounded-full text-sm font-medium">
            AUTOMATIQUE
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 p-6">
      <div className="max-w-5xl mx-auto">
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
            Journal d'activité
          </h1>
          <p className="text-gray-600 text-lg">
            Historique de toutes les actions effectuées par UNIALIST
          </p>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-xl p-4 shadow-md mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Toutes les actions
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'approved'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Approuvées
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'rejected'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Rejetées
            </button>
            <button
              onClick={() => setFilter('automatic')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'automatic'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Automatiques
            </button>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Download className="w-4 h-4" />
            Exporter
          </button>
        </div>

        {/* Activity Timeline */}
        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <div className="space-y-6">
            {filteredActivities.map((activity, index) => (
              <div key={activity.id} className="flex gap-6">
                {/* Time */}
                <div className="w-16 text-right">
                  <span className="text-lg font-bold text-gray-700">
                    {activity.time}
                  </span>
                </div>

                {/* Timeline */}
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                  {index < filteredActivities.length - 1 && (
                    <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-8">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusBadge(activity.status)}
                    <h3 className="text-lg font-bold text-gray-800">
                      {activity.action}
                    </h3>
                  </div>
                  <p className="text-gray-600">
                    {activity.details}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {filteredActivities.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                Aucune activité trouvée pour ce filtre
              </p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
            <div className="text-3xl font-bold text-blue-700">
              {activities.filter(a => a.status === 'approved').length}
            </div>
            <div className="text-sm text-blue-600 font-medium">
              Actions approuvées
            </div>
          </div>
          <div className="bg-yellow-50 rounded-xl p-4 border-2 border-yellow-200">
            <div className="text-3xl font-bold text-yellow-700">
              {activities.filter(a => a.status === 'rejected').length}
            </div>
            <div className="text-sm text-yellow-600 font-medium">
              Actions rejetées
            </div>
          </div>
          <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
            <div className="text-3xl font-bold text-green-700">
              {activities.filter(a => a.status === 'automatic').length}
            </div>
            <div className="text-sm text-green-600 font-medium">
              Actions automatiques
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

