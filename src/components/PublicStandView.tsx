import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { DisplayStand, Publication } from '../types';
import MaintenanceRequestModal from './MaintenanceRequestModal';
import StandHeader from './public/StandHeader';
import CurrentPoster from './public/CurrentPoster';
import PublicationsList from './public/PublicationsList';
import ReservationInfo from './public/ReservationInfo';
import MaintenanceButton from './public/MaintenanceButton';
import LoadingSpinner from './public/LoadingSpinner';
import NotFoundView from './public/NotFoundView';

const PublicStandView: React.FC = () => {
  const { id } = useParams();
  const [stand, setStand] = useState<DisplayStand | null>(null);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMaintenanceRequestModal, setShowMaintenanceRequestModal] = useState(false);

  useEffect(() => {
    const loadStand = async () => {
      if (!id) return;

      try {
        const standDoc = await getDoc(doc(db, 'stands', id));
        if (!standDoc.exists()) {
          toast.error('Présentoir non trouvé');
          return;
        }

        const standData = { id: standDoc.id, ...standDoc.data() } as DisplayStand;
        setStand(standData);

        if (standData.publications?.length > 0) {
          const publicationPromises = standData.publications.map(pub => 
            getDoc(doc(db, 'publications', pub.publicationId))
          );
          const publicationDocs = await Promise.all(publicationPromises);
          const publicationsData = publicationDocs
            .filter(doc => doc.exists())
            .map(doc => ({ id: doc.id, ...doc.data() })) as Publication[];
          setPublications(publicationsData);
        }
      } catch (error) {
        console.error('Error loading stand:', error);
        toast.error('Erreur lors du chargement du présentoir');
      } finally {
        setLoading(false);
      }
    };

    loadStand();
  }, [id]);

  const handleMaintenanceRequest = async (data: { description: string; issues: string }) => {
    if (!stand) return;

    try {
      const standRef = doc(db, 'stands', stand.id);
      await updateDoc(standRef, {
        maintenanceHistory: [
          ...(stand.maintenanceHistory || []),
          {
            id: crypto.randomUUID(),
            type: 'curative',
            date: new Date().toISOString(),
            issues: data.issues,
            description: data.description,
            status: 'pending',
            requestedBy: stand.reservedBy || 'Anonyme'
          }
        ],
        lastUpdated: serverTimestamp()
      });

      toast.success('Demande de maintenance envoyée avec succès');
      setShowMaintenanceRequestModal(false);
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la demande:', error);
      toast.error('Erreur lors de l\'envoi de la demande');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!stand) return <NotFoundView />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="card p-8 bg-white shadow-xl border-2 border-blue-100">
          <div className="space-y-6">
            <StandHeader stand={stand} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CurrentPoster posterName={stand.currentPoster} />

              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Publications disponibles
                </h2>
                <PublicationsList publications={publications} />
              </div>
            </div>

            <ReservationInfo stand={stand} />
            <MaintenanceButton onClick={() => setShowMaintenanceRequestModal(true)} />
          </div>
        </div>
      </div>

      {showMaintenanceRequestModal && (
        <MaintenanceRequestModal
          stand={stand}
          isOpen={showMaintenanceRequestModal}
          onClose={() => setShowMaintenanceRequestModal(false)}
          onSubmit={handleMaintenanceRequest}
        />
      )}
    </div>
  );
};

export default PublicStandView;