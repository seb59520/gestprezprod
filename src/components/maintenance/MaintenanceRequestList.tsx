import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { AlertTriangle, CheckCircle, XCircle, Wrench, Clock } from 'lucide-react';
import { DisplayStand } from '../../types';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { toast } from 'react-hot-toast';

interface MaintenanceRequestListProps {
  requests: any[];
  stands: DisplayStand[];
}

const MaintenanceRequestList: React.FC<MaintenanceRequestListProps> = ({ requests, stands }) => {
  const handleApprove = async (requestId: string, standId: string) => {
    try {
      const stand = stands.find(s => s.id === standId);
      if (!stand) return;

      const standRef = doc(db, 'stands', standId);
      await updateDoc(standRef, {
        maintenanceHistory: stand.maintenanceHistory?.map(m => 
          m.id === requestId
            ? { ...m, status: 'approved', completedAt: new Date().toISOString() }
            : m
        ),
        lastUpdated: serverTimestamp()
      });

      toast.success('Demande approuvée');
    } catch (error) {
      console.error('Error approving request:', error);
      toast.error('Erreur lors de l\'approbation');
    }
  };

  const handleReject = async (requestId: string, standId: string) => {
    try {
      const stand = stands.find(s => s.id === standId);
      if (!stand) return;

      const standRef = doc(db, 'stands', standId);
      await updateDoc(standRef, {
        maintenanceHistory: stand.maintenanceHistory?.map(m => 
          m.id === requestId
            ? { ...m, status: 'rejected', completedAt: new Date().toISOString() }
            : m
        ),
        lastUpdated: serverTimestamp()
      });

      toast.success('Demande rejetée');
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error('Erreur lors du rejet');
    }
  };

  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Aucune demande en attente
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Les nouvelles demandes de maintenance apparaîtront ici
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <div key={request.id} className="card p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-lg">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    {request.standName}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <Clock className="h-4 w-4 mr-1" />
                    {format(new Date(request.date), 'PPP', { locale: fr })}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {request.description}
                </p>
                {request.issues && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    <strong>Problèmes :</strong> {request.issues}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleApprove(request.id, request.standId)}
                className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                title="Approuver"
              >
                <CheckCircle className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleReject(request.id, request.standId)}
                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                title="Rejeter"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MaintenanceRequestList;