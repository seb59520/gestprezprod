import React from 'react';
import { Building2, MapPin } from 'lucide-react';
import { DisplayStand, Poster } from '../../types';
import { QRCodeSVG } from 'qrcode.react';
import StandInfo from './StandInfo';
import StandPublications from './StandPublications';
import StandActions from './StandActions';

interface StandCardProps {
  stand: DisplayStand;
  availablePosters: Poster[];
  statusColor: string;
  baseUrl: string;
  onSelectAction: (stand: DisplayStand, action: string) => void;
}

const StandCard: React.FC<StandCardProps> = ({
  stand,
  availablePosters,
  statusColor,
  baseUrl,
  onSelectAction
}) => {
  return (
    <div className={`card p-6 hover:shadow-lg transition-all duration-200 border-2 ${statusColor}`}>
      <div className="space-y-4">
        {/* En-tête avec poster et QR code */}
        <div className="flex items-start gap-4">
          <div className="flex gap-4">
            <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
              {stand.currentPoster && availablePosters.find(p => p.name === stand.currentPoster)?.imageUrl ? (
                <img
                  src={availablePosters.find(p => p.name === stand.currentPoster)?.imageUrl}
                  alt={stand.currentPoster}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Building2 className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                </div>
              )}
            </div>
            <div className="w-24 h-24 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <QRCodeSVG
                value={`${baseUrl}${stand.id}`}
                size={80}
                level="H"
                includeMargin={true}
              />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{stand.name}</h3>
            <div className="flex items-center text-gray-600 dark:text-gray-400 mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              {stand.location}
            </div>
            <StandInfo stand={stand} />
          </div>
        </div>

        {/* Publications */}
        <StandPublications stand={stand} />

        {/* Actions */}
        <StandActions 
          stand={stand} 
          onSelectAction={onSelectAction}
        />
      </div>
    </div>
  );
};

export default StandCard;