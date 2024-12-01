import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, User, FileText, AlertTriangle, BookOpen, Wrench, Calendar, Image, Plus, Building2, History } from 'lucide-react';
import { DisplayStand, Publication, Poster } from '../types';
import { formatDateSafely } from '../utils/dateUtils';
import { useSettings } from '../context/SettingsContext';
import { needsMaintenance } from '../utils/maintenanceUtils';
import { addHistoryRecord } from '../utils/historyUtils';
import { useAuth } from '../context/AuthContext';
import ReservationModal from './ReservationModal';
import PosterChangeModal from './PosterChangeModal';
import PublicationStockModal from './PublicationStockModal';
import MaintenanceModal from './MaintenanceModal';
import PublicationAssociationModal from './PublicationAssociationModal';
import StandHistoryModal from './StandHistoryModal';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { toast } from 'react-hot-toast';
import { predictStock } from '../utils/stockPrediction';
import StockAnalysisPopover from './StockAnalysisPopover';

interface StandTableViewProps {
  stands: DisplayStand[];
  publications: Publication[];
  availablePosters: Poster[];
  onPosterRequest: (standId: string, requestedPoster: string, notes: string) => void;
  onUpdateStock: (standId: string, publicationId: string, quantity: number) => void;
  getLowStockPublications: (standId: string) => any[];
}

const StandTableView: React.FC<StandTableViewProps> = ({
  stands,
  publications,
  availablePosters,
  onPosterRequest,
  onUpdateStock,
  getLowStockPublications
}) => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const { currentUser } = useAuth();
  const [selectedStand, setSelectedStand] = useState<DisplayStand | null>(null);
  const [selectedAction, setSelectedAction] = useState<'reserve' | 'poster' | 'stock' | 'maintenance' | 'associate' | 'history' | null>(null);
  const [hoveredPublication, setHoveredPublication] = useState<string | null>(null);

  const handleCancelReservation = async (stand: DisplayStand) => {
    if (!currentUser) return;

    try {
      const standRef = doc(db, 'stands', stand.id);
      const newHistory = addHistoryRecord(stand, 'reservation', currentUser.email || 'Utilisateur', {
        action: 'cancel',
        previousState: {
          reservedBy: stand.reservedBy,
          reservedUntil: stand.reservedUntil
        }
      });

      await updateDoc(standRef, {
        isReserved: false,
        reservedBy: null,
        reservedUntil: null,
        isPerpetual: false,
        lastUpdated: serverTimestamp(),
        history: newHistory
      });

      toast.success('Réservation annulée avec succès');
    } catch (error) {
      console.error('Error canceling reservation:', error);
      toast.error('Erreur lors de l\'annulation de la réservation');
    }
  };

  const closeModals = () => {
    setSelectedStand(null);
    setSelectedAction(null);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Présentoir
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              État
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Affiche
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Publications
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {stands.map((stand) => {
            const lowStockCount = getLowStockPublications(stand.id).length;
            const maintenanceStatus = needsMaintenance(stand, settings.maintenance.preventiveIntervalMonths);
            const standPublications = stand.publications || [];

            return (
              <tr key={stand.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                      {stand.imageUrl ? (
                        <img
                          src={stand.imageUrl}
                          alt={stand.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Building2 className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{stand.name}</div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {stand.location}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col gap-2">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      stand.isReserved
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {stand.isReserved ? 'Réservé' : 'Disponible'}
                    </span>
                    {stand.isReserved && (
                      <div className="text-sm text-gray-500">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {stand.reservedBy}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {stand.isPerpetual ? 'Perpétuel' : `Jusqu'au ${formatDateSafely(stand.reservedUntil)}`}
                        </div>
                      </div>
                    )}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    {stand.currentPoster && availablePosters.find(p => p.name === stand.currentPoster)?.imageUrl ? (
                      <img
                        src={availablePosters.find(p => p.name === stand.currentPoster)?.imageUrl}
                        alt={stand.currentPoster}
                        className="w-12 h-12 rounded object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                        <Image className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                    <div className="text-sm text-gray-900">{stand.currentPoster || 'Aucune affiche'}</div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="space-y-2">
                    {standPublications.map(pub => {
                      const publication = publications.find(p => p.id === pub.publicationId);
                      if (!publication) return null;

                      const prediction = predictStock({
                        ...publication,
                        currentStock: pub.quantity
                      });

                      return (
                        <div 
                          key={pub.publicationId} 
                          className="flex items-center gap-2 relative"
                          onMouseEnter={() => setHoveredPublication(pub.publicationId)}
                          onMouseLeave={() => setHoveredPublication(null)}
                        >
                          <div className="w-8 h-8">
                            {publication.imageUrl ? (
                              <img
                                src={publication.imageUrl}
                                alt={publication.title}
                                className="w-full h-full rounded object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                                <BookOpen className="h-4 w-4 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">
                              {publication.title}
                            </div>
                            <div className="text-xs text-gray-500">
                              Stock: {pub.quantity} / Min: {publication.minStock}
                            </div>
                            {pub.quantity < prediction.restockPoint && (
                              <div className="text-xs text-orange-600">
                                Réappro. recommandée
                              </div>
                            )}
                          </div>
                          {hoveredPublication === pub.publicationId && (
                            <StockAnalysisPopover
                              publication={{
                                ...publication,
                                currentStock: pub.quantity
                              }}
                            />
                          )}
                        </div>
                      );
                    })}
                    {standPublications.length === 0 && (
                      <div className="text-sm text-gray-500">
                        Aucune publication
                      </div>
                    )}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {stand.isReserved ? (
                      <button
                        onClick={() => handleCancelReservation(stand)}
                        className="btn bg-red-100 text-red-700 hover:bg-red-200 py-1 px-2 text-sm"
                      >
                        Annuler
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedStand(stand);
                          setSelectedAction('reserve');
                        }}
                        className="btn bg-green-100 text-green-700 hover:bg-green-200 py-1 px-2 text-sm"
                      >
                        Réserver
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setSelectedStand(stand);
                        setSelectedAction('poster');
                      }}
                      className="btn btn-secondary py-1 px-2 text-sm"
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Affiche
                    </button>

                    <button
                      onClick={() => {
                        setSelectedStand(stand);
                        setSelectedAction('associate');
                      }}
                      className="btn btn-secondary py-1 px-2 text-sm"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Publications
                    </button>

                    <button
                      onClick={() => {
                        setSelectedStand(stand);
                        setSelectedAction('maintenance');
                      }}
                      className={`btn ${
                        maintenanceStatus.needed
                          ? maintenanceStatus.reason === 'curative'
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                          : 'btn-secondary'
                      } py-1 px-2 text-sm`}
                    >
                      <Wrench className="h-4 w-4 mr-1" />
                      {maintenanceStatus.needed 
                        ? maintenanceStatus.reason === 'curative'
                          ? 'Urgent'
                          : 'Maintenance'
                        : 'Entretien'
                      }
                    </button>

                    <button
                      onClick={() => {
                        setSelectedStand(stand);
                        setSelectedAction('history');
                      }}
                      className="btn btn-secondary py-1 px-2 text-sm"
                      title="Historique"
                    >
                      <History className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {selectedStand && selectedAction === 'reserve' && (
        <ReservationModal
          stand={selectedStand}
          isOpen={true}
          onClose={closeModals}
        />
      )}

      {selectedStand && selectedAction === 'poster' && (
        <PosterChangeModal
          stand={selectedStand}
          isOpen={true}
          onClose={closeModals}
          availablePosters={availablePosters}
        />
      )}

      {selectedStand && selectedAction === 'stock' && (
        <PublicationStockModal
          stand={selectedStand}
          isOpen={true}
          onClose={closeModals}
          publications={publications}
        />
      )}

      {selectedStand && selectedAction === 'maintenance' && (
        <MaintenanceModal
          stand={selectedStand}
          type={maintenanceStatus.reason === 'curative' ? 'curative' : 'preventive'}
          isOpen={true}
          onClose={closeModals}
        />
      )}

      {selectedStand && selectedAction === 'associate' && (
        <PublicationAssociationModal
          stand={selectedStand}
          isOpen={true}
          onClose={closeModals}
          publications={publications}
        />
      )}

      {selectedStand && selectedAction === 'history' && (
        <StandHistoryModal
          stand={selectedStand}
          isOpen={true}
          onClose={closeModals}
        />
      )}
    </div>
  );
};

export default StandTableView;