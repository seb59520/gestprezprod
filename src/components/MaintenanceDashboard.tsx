import React, { useState } from 'react';
import { useStands } from '../context/StandsContext';
import { useSettings } from '../context/SettingsContext';
import { Wrench, AlertTriangle, Clock, TrendingUp, Package } from 'lucide-react';
import MaintenanceSchedule from './maintenance/MaintenanceSchedule';
import MaintenanceRequestList from './maintenance/MaintenanceRequestList';
import MaintenanceStats from './maintenance/MaintenanceStats';
import SpareParts from './maintenance/SpareParts';

const MaintenanceDashboard: React.FC = () => {
  const { stands } = useStands();
  const { settings } = useSettings();
  const [activeTab, setActiveTab] = useState<'schedule' | 'requests' | 'parts' | 'stats'>('schedule');

  // Get pending maintenance requests
  const pendingRequests = stands.flatMap(stand => 
    (stand.maintenanceHistory || [])
      .filter(m => m.status === 'pending')
      .map(m => ({ ...m, standId: stand.id, standName: stand.name }))
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Gestion de la Maintenance
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gérez les maintenances préventives et curatives de vos présentoirs
        </p>
      </div>

      {/* Navigation des onglets */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'schedule'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Planning
            </div>
          </button>

          <button
            onClick={() => setActiveTab('requests')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'requests'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Demandes ({pendingRequests.length})
            </div>
          </button>

          <button
            onClick={() => setActiveTab('parts')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'parts'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Pièces détachées
            </div>
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'stats'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Statistiques
            </div>
          </button>
        </nav>
      </div>

      {/* Contenu des onglets */}
      <div className="mt-6">
        {activeTab === 'schedule' && (
          <MaintenanceSchedule 
            stands={stands}
            settings={settings}
          />
        )}

        {activeTab === 'requests' && (
          <MaintenanceRequestList 
            requests={pendingRequests}
            stands={stands}
          />
        )}

        {activeTab === 'parts' && (
          <SpareParts />
        )}

        {activeTab === 'stats' && (
          <MaintenanceStats 
            stands={stands}
          />
        )}
      </div>
    </div>
  );
};

export default MaintenanceDashboard;