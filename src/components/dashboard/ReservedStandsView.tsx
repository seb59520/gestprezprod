import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, MapPin, Calendar, User, Clock } from 'lucide-react';
import { DisplayStand } from '../../types';
import { formatDateSafely } from '../../utils/dateUtils';

interface ReservedStandsViewProps {
  stands: DisplayStand[];
}

const ReservedStandsView: React.FC<ReservedStandsViewProps> = ({ stands }) => {
  const navigate = useNavigate();
  const reservedStands = stands.filter(stand => stand.isReserved);

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
            Présentoirs Réservés ({reservedStands.length})
          </h1>
        </div>
      </div>

      <div className="grid gap-4">
        {reservedStands.map(stand => (
          <div key={stand.id} className="card p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 text-red-600 rounded-lg">
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

                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    Réservé par: {stand.reservedBy}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Jusqu'au: {formatDateSafely(stand.reservedUntil)}
                  </div>
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

export default ReservedStandsView;