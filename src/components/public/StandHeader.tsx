import React from 'react';
import { MapPin } from 'lucide-react';
import { DisplayStand } from '../../types';

interface StandHeaderProps {
  stand: DisplayStand;
}

const StandHeader: React.FC<StandHeaderProps> = ({ stand }) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{stand.name}</h1>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            stand.isReserved 
              ? 'bg-red-100 text-red-700' 
              : 'bg-green-100 text-green-700'
          }`}>
            {stand.isReserved ? 'Réservé' : 'Disponible'}
          </span>
        </div>
      </div>

      <div className="flex items-center text-gray-600 gap-2">
        <MapPin className="h-5 w-5 text-blue-500" />
        <span className="text-lg">{stand.location}</span>
      </div>
    </>
  );
};

export default StandHeader;