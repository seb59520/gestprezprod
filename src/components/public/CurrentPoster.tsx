import React from 'react';
import { Image } from 'lucide-react';

interface CurrentPosterProps {
  posterName?: string;
}

const CurrentPoster: React.FC<CurrentPosterProps> = ({ posterName }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">
        Affiche actuelle
      </h2>
      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
        {posterName ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
            {posterName}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Image className="h-12 w-12 text-gray-400" />
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentPoster;