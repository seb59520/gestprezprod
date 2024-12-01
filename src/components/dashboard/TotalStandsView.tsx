import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, MapPin, Calendar } from 'lucide-react';
import { DisplayStand } from '../../types';
import { formatDateSafely } from '../../utils/dateUtils';
import { getStandAge, getAgeStatus } from '../../utils/standUtils';

interface TotalStandsViewProps {
  stands: DisplayStand[];
}

const TotalStandsView: React.FC<TotalStandsViewProps> = ({ stands }) => {
  const navigate = useNavigate();

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
            Tous les Présentoirs ({stands.length})
          </h1>
        </div>
      </div>

      <div className="grid gap-4">
        {stands.map(stand => {
          const age = getStandAge(stand.createdAt);
          const status = getAgeStatus(stand.createdAt);
          
          return (
            <div key={stand.id} className="card p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
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

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Installation: {formatDateSafely(stand.createdAt)}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      status.status === 'old'
                        ? 'bg-red-100 text-red-700'
                        : status.status === 'aging'
                        ? 'bg-yellow-100 text-yellow-700'
                        : status.status === 'good'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {age}
                    </span>
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

export default TotalStandsView;