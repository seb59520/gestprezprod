import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, MapPin, Calendar, Wrench, AlertTriangle } from 'lucide-react';
import { DisplayStand } from '../../types';
import { formatDateSafely } from '../../utils/dateUtils';
import { addMonths, isBefore } from 'date-fns';

interface MaintenanceStandsViewProps {
  stands: DisplayStand[];
}

const MaintenanceStandsView: React.FC<MaintenanceStandsViewProps> = ({ stands }) => {
  const navigate = useNavigate();
  
  const needsMaintenance = (stand: DisplayStand) => {
    const lastMaintenance = stand.maintenanceHistory?.slice(-1)[0];
    if (!lastMaintenance) return true;
    
    const nextMaintenance = addMonths(new Date(lastMaintenance.date), 3);
    return isBefore(nextMaintenance, new Date());
  };

  const maintenanceStands = stands.filter(needsMaintenance);

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
            Maintenance Requise ({maintenanceStands.length})
          </h1>
        </div>
      </div>

      <div className="grid gap-4">
        {maintenanceStands.map(stand => (
          <div key={stand.id} className="card p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">
                    <Wrench className="h-5 w-5" />
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

                <div className="space-y-1 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    Dernière maintenance: {
                      stand.maintenanceHistory?.length 
                        ? formatDateSafely(stand.maintenanceHistory.slice(-1)[0].date)
                        : 'Jamais'
                    }
                  </div>
                  <div className="flex items-center text-yellow-600">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Maintenance préventive requise
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

export default MaintenanceStandsView;