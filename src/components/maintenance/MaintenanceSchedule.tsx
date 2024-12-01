import React, { useState } from 'react';
import { format, addMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Clock, AlertTriangle, CheckCircle, Wrench, Settings } from 'lucide-react';
import { DisplayStand } from '../../types';
import { needsMaintenance } from '../../utils/maintenanceUtils';
import MaintenanceModal from '../MaintenanceModal';
import HelpTooltip from '../HelpTooltip';

interface MaintenanceScheduleProps {
  stands: DisplayStand[];
  settings: any;
}

const MaintenanceSchedule: React.FC<MaintenanceScheduleProps> = ({ stands, settings }) => {
  const [selectedStand, setSelectedStand] = useState<DisplayStand | null>(null);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);

  // Group stands by maintenance status
  const groupedStands = stands.reduce((acc, stand) => {
    const maintenanceStatus = needsMaintenance(stand, settings.maintenance.preventiveIntervalMonths);
    const status = maintenanceStatus.needed 
      ? maintenanceStatus.reason === 'curative' ? 'urgent' : 'due'
      : 'upcoming';
    
    if (!acc[status]) acc[status] = [];
    acc[status].push(stand);
    return acc;
  }, {} as Record<string, DisplayStand[]>);

  const getNextMaintenanceDate = (stand: DisplayStand) => {
    const lastMaintenance = stand.maintenanceHistory?.slice(-1)[0];
    if (!lastMaintenance) return new Date();
    return addMonths(new Date(lastMaintenance.date), settings.maintenance.preventiveIntervalMonths);
  };

  return (
    <div className="space-y-8">
      {/* Maintenances urgentes */}
      {groupedStands.urgent?.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">
              Maintenances Urgentes
            </h2>
            <HelpTooltip
              title="Maintenances Urgentes"
              content="Présentoirs nécessitant une intervention curative immédiate"
            />
          </div>
          <div className="grid gap-4">
            {groupedStands.urgent.map(stand => (
              <div key={stand.id} className="card p-4 border-2 border-red-200 dark:border-red-800">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">{stand.name}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span>Maintenance curative requise</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedStand(stand);
                      setShowMaintenanceModal(true);
                    }}
                    className="btn bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50"
                  >
                    <Wrench className="h-4 w-4 mr-1" />
                    Intervenir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Maintenances à effectuer */}
      {groupedStands.due?.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-semibold text-yellow-600 dark:text-yellow-400">
              Maintenances à Effectuer
            </h2>
            <HelpTooltip
              title="Maintenances Planifiées"
              content="Présentoirs dont la maintenance préventive est due selon le planning"
            />
          </div>
          <div className="grid gap-4">
            {groupedStands.due.map(stand => (
              <div key={stand.id} className="card p-4 border-2 border-yellow-200 dark:border-yellow-800">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">{stand.name}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Maintenance prévue le {format(getNextMaintenanceDate(stand), 'PPP', { locale: fr })}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedStand(stand);
                      setShowMaintenanceModal(true);
                    }}
                    className="btn bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/50"
                  >
                    <Wrench className="h-4 w-4 mr-1" />
                    Effectuer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Maintenances à venir */}
      {groupedStands.upcoming?.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Prochaines Maintenances
            </h2>
            <HelpTooltip
              title="Prochaines Maintenances"
              content="Planning des futures maintenances préventives"
            />
          </div>
          <div className="grid gap-4">
            {groupedStands.upcoming.map(stand => (
              <div key={stand.id} className="card p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">{stand.name}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Prochaine maintenance le {format(getNextMaintenanceDate(stand), 'PPP', { locale: fr })}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedStand(stand);
                      setShowMaintenanceModal(true);
                    }}
                    className="btn btn-secondary"
                  >
                    <Settings className="h-4 w-4 mr-1" />
                    Planifier
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de maintenance */}
      {selectedStand && showMaintenanceModal && (
        <MaintenanceModal
          stand={selectedStand}
          type={groupedStands.urgent?.includes(selectedStand) ? 'curative' : 'preventive'}
          isOpen={showMaintenanceModal}
          onClose={() => {
            setSelectedStand(null);
            setShowMaintenanceModal(false);
          }}
        />
      )}
    </div>
  );
};

export default MaintenanceSchedule;