import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { DisplayStand } from '../../types';
import HelpTooltip from '../HelpTooltip';
import StockPredictionTooltip from '../StockPredictionTooltip';
import { useStands } from '../../context/StandsContext';

interface StandPublicationsProps {
  stand: DisplayStand;
}

const StandPublications: React.FC<StandPublicationsProps> = ({ stand }) => {
  const { publications } = useStands();
  const [hoveredPublication, setHoveredPublication] = useState<string | null>(null);

  if (!stand.publications?.length) return null;

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Publications</h4>
      {stand.publications.map(pub => {
        const publication = publications.find(p => p.id === pub.publicationId);
        if (!publication) return null;
        
        return (
          <div 
            key={pub.publicationId} 
            className="relative flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            onMouseEnter={() => setHoveredPublication(pub.publicationId)}
            onMouseLeave={() => setHoveredPublication(null)}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {publication.title}
              </span>
              <HelpTooltip
                title="Stock"
                content={
                  <div className="space-y-2">
                    <p>Niveau de stock actuel par rapport au minimum requis.</p>
                    <p>• Stock minimum : {publication.minStock}</p>
                    <p>• Stock actuel : {pub.quantity}</p>
                  </div>
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${
                pub.quantity < publication.minStock
                  ? 'text-orange-600 dark:text-orange-400'
                  : 'text-gray-900 dark:text-gray-100'
              }`}>
                {pub.quantity} / {publication.minStock}
              </span>
              {pub.quantity < publication.minStock && (
                <AlertTriangle className="h-4 w-4 text-orange-500" />
              )}
            </div>
            
            {hoveredPublication === pub.publicationId && (
              <StockPredictionTooltip
                publication={{
                  ...publication,
                  currentStock: pub.quantity
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StandPublications;