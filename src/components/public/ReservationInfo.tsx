import React from 'react';
import { User, Calendar } from 'lucide-react';
import { DisplayStand } from '../../types';
import { formatDateSafely } from '../../utils/dateUtils';

interface ReservationInfoProps {
  stand: DisplayStand;
}

const ReservationInfo: React.FC<ReservationInfoProps> = ({ stand }) => {
  if (!stand.isReserved) return null;

  return (
    <div className="p-4 bg-red-50 rounded-lg">
      <div className="flex items-center text-red-700 mb-2">
        <User className="h-5 w-5 mr-2" />
        <span className="font-medium">Réservé par: {stand.reservedBy}</span>
      </div>
      <div className="flex items-center text-red-700">
        <Calendar className="h-5 w-5 mr-2" />
        <span>
          {stand.isPerpetual 
            ? 'Réservation perpétuelle'
            : `Jusqu'au: ${formatDateSafely(stand.reservedUntil)}`
          }
        </span>
      </div>
    </div>
  );
};

export default ReservationInfo;