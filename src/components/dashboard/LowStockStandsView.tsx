import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, MapPin, AlertTriangle, BookOpen } from 'lucide-react';
import { DisplayStand, Publication } from '../../types';

interface LowStockStandsViewProps {
  stands: DisplayStand[];
  publications: Publication[];
  getLowStockPublications: (standId: string) => any[];
}

const LowStockStandsView: React.FC<LowStockStandsViewProps> = ({ 
  stands, 
  publications,
  getLowStockPublications 
}) => {
  const navigate = useNavigate();
  const lowStockStands = stands.filter(stand => getLowStockPublications(stand.id).length > 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="btn btn-secondary"
          >
            <ArrowLeft className="h-5 w-5" />
            Retour
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Stock Bas ({lowStockStands.length})
          </h1>
        </div>
      </div>

      <div className="grid gap-4">
        {lowStockStands.map(stand => {
          const lowStockPublications = getLowStockPublications(stand.id);
          
          return (
            <div key={stand.id} className="card p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {stand.name}
                      </h3>
                      <div className="flex items-center text-gray-600 mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {stand.location}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {lowStockPublications.map((pub, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between bg-orange-50 rounded-lg p-3"
                      >
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-orange-500" />
                          <span className="text-sm font-medium text-gray-900">
                            {pub.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                          <span className="text-sm text-orange-600">
                            {pub.current}/{pub.required}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/admin/stand/${stand.id}`)}
                  className="btn btn-secondary py-1.5 px-3"
                >
                  Détails
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LowStockStandsView;