import React from 'react';
import { BookOpen } from 'lucide-react';
import { Publication } from '../../types';

interface PublicationsListProps {
  publications: Publication[];
}

const PublicationsList: React.FC<PublicationsListProps> = ({ publications }) => {
  if (publications.length === 0) {
    return (
      <p className="text-gray-500 text-center py-4">
        Aucune publication disponible
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {publications.map((publication) => (
        <div key={publication.id} className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            {publication.imageUrl ? (
              <img 
                src={publication.imageUrl} 
                alt={publication.title}
                className="w-16 h-16 rounded object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-gray-400" />
              </div>
            )}
            <div>
              <h3 className="font-medium text-gray-900">{publication.title}</h3>
              {publication.description && (
                <p className="text-sm text-gray-600 mt-1">{publication.description}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PublicationsList;