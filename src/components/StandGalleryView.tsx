import React from 'react';
import { DisplayStand, Poster, Publication } from '../types';
import { useSettings } from '../context/SettingsContext';
import { needsMaintenance } from '../utils/maintenanceUtils';
import { getAgeStatus } from '../utils/standUtils';
import StandCard from './gallery/StandCard';

interface StandGalleryViewProps {
  stands: DisplayStand[];
  publications: Publication[];
  availablePosters: Poster[];
  onPosterRequest: (standId: string, requestedPoster: string, notes: string) => void;
  onUpdateStock: (standId: string, publicationId: string, quantity: number) => void;
  getLowStockPublications: (standId: string) => any[];
  onSelectAction: (stand: DisplayStand, action: string) => void;
}

const StandGalleryView: React.FC<StandGalleryViewProps> = ({
  stands,
  availablePosters,
  onSelectAction
}) => {
  const { settings } = useSettings();

  const getStatusColor = (stand: DisplayStand) => {
    if (stand.isReserved) return 'border-red-200 dark:border-red-800';
    const maintenanceStatus = needsMaintenance(stand, settings.maintenance.preventiveIntervalMonths);
    if (maintenanceStatus.needed) {
      return maintenanceStatus.reason === 'curative' 
        ? 'border-red-200 dark:border-red-800' 
        : 'border-yellow-200 dark:border-yellow-800';
    }
    const ageStatus = getAgeStatus(stand.createdAt);
    switch (ageStatus.status) {
      case 'new': return 'border-green-200 dark:border-green-800';
      case 'good': return 'border-blue-200 dark:border-blue-800';
      case 'aging': return 'border-yellow-200 dark:border-yellow-800';
      case 'old': return 'border-red-200 dark:border-red-800';
      default: return 'border-gray-200 dark:border-gray-700';
    }
  };

  // Group stands by status
  const groupedStands = stands.reduce((acc, stand) => {
    const status = stand.isReserved ? 'reserved' : 'available';
    if (!acc[status]) acc[status] = [];
    acc[status].push(stand);
    return acc;
  }, {} as Record<string, DisplayStand[]>);

  return (
    <div className="space-y-8">
      {/* Présentoirs disponibles */}
      {groupedStands.available?.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
            Présentoirs Disponibles ({groupedStands.available.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupedStands.available.map((stand) => (
              <StandCard
                key={stand.id}
                stand={stand}
                availablePosters={availablePosters}
                statusColor={getStatusColor(stand)}
                baseUrl={settings.baseUrl}
                onSelectAction={onSelectAction}
              />
            ))}
          </div>
        </div>
      )}

      {/* Présentoirs réservés */}
      {groupedStands.reserved?.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
            Présentoirs Réservés ({groupedStands.reserved.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupedStands.reserved.map((stand) => (
              <StandCard
                key={stand.id}
                stand={stand}
                availablePosters={availablePosters}
                statusColor={getStatusColor(stand)}
                baseUrl={settings.baseUrl}
                onSelectAction={onSelectAction}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StandGalleryView;