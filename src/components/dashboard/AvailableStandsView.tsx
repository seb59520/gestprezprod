import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, MapPin, Calendar } from 'lucide-react';
import { DisplayStand } from '../../types';
import { formatDateSafely } from '../../utils/dateUtils';

interface AvailableStandsViewProps {
  stands: DisplayStand[];
}

const AvailableStandsView: React.FC<AvailableStandsViewProps> = ({ stands }) => {
  const navigate = useNavigate();
  const availableStands = stands.filter(stand => !stand.isReserved);

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
            Présentoirs Disponibles ({availableStands.length})
          </h1>
        </div>
      </div>

      <div className="grid gap-4">
        {availableStands.map(stand => (
          <div key={stand.id} className="card p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 text-green-600 rounded-lg">
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

                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-1" />
                  Installation: {formatDateSafely(stand.createdAt)}
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
        ))}
      </div>
    </div>
  );
};

export default AvailableStandsView;