import React from 'react';
import { User, Clock } from 'lucide-react';
import { DisplayStand } from '../../types';
import { formatDateSafely } from '../../utils/dateUtils';

interface StandInfoProps {
  stand: DisplayStand;
}

const StandInfo: React.FC<StandInfoProps> = ({ stand }) => {
  return (
    <div className="mt-2">
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
        stand.isReserved
          ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
          : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
      }`}>
        {stand.isReserved ? 'Réservé' : 'Disponible'}
      </span>

      {stand.isReserved && (
        <div className="flex flex-col gap-1 mt-2">
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <User className="h-4 w-4 mr-1" />
            {stand.reservedBy}
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Clock className="h-4 w-4 mr-1" />
            {stand.isPerpetual ? 'Réservation perpétuelle' : `Jusqu'au ${formatDateSafely(stand.reservedUntil)}`}
          </div>
        </div>
      )}
    </div>
  );
};

export default StandInfo;