import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import Modal from './Modal';
import { DisplayStand, Poster, Publication } from '../types';
import { FileText, Plus, Image, AlertTriangle } from 'lucide-react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { addHistoryRecord } from '../utils/historyUtils';
import { useAuth } from '../context/AuthContext';
import { useStands } from '../context/StandsContext';
import PublicationAssociationModal from './PublicationAssociationModal';

interface PosterChangeModalProps {
  stand: DisplayStand;
  isOpen: boolean;
  onClose: () => void;
  availablePosters: Poster[];
}

const PosterChangeModal: React.FC<PosterChangeModalProps> = ({
  stand,
  isOpen,
  onClose,
  availablePosters
}) => {
  const { currentUser } = useAuth();
  const { publications } = useStands();
  const [loading, setLoading] = useState(false);
  const [selectedPoster, setSelectedPoster] = useState('');
  const [showCreatePoster, setShowCreatePoster] = useState(false);
  const [showPublicationModal, setShowPublicationModal] = useState(false);
  const [askForPublications, setAskForPublications] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    if (!selectedPoster) {
      toast.error('Veuillez sélectionner une affiche');
      return;
    }

    try {
      setLoading(true);
      const standRef = doc(db, 'stands', stand.id);
      
      const newHistory = addHistoryRecord(stand, 'poster_change', currentUser.email || 'Utilisateur', {
        action: 'update',
        previousState: stand.currentPoster,
        newState: selectedPoster
      });

      await updateDoc(standRef, {
        currentPoster: selectedPoster,
        lastUpdated: serverTimestamp(),
        history: newHistory
      });

      toast.success('Affiche mise à jour avec succès');
      setAskForPublications(true);
    } catch (error) {
      console.error('Error updating poster:', error);
      toast.error('Erreur lors de la mise à jour de l\'affiche');
    } finally {
      setLoading(false);
    }
  };

  if (askForPublications) {
    return (
      <Modal 
        isOpen={isOpen} 
        onClose={onClose}
        title="Mise à jour des publications"
      >
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-blue-700 mb-2">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium">Souhaitez-vous mettre à jour les publications ?</span>
            </div>
            <p className="text-sm text-blue-600">
              L'affiche a été changée avec succès. Voulez-vous également mettre à jour les publications associées à ce présentoir ?
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Non, terminer
            </button>
            <button
              type="button"
              onClick={() => {
                setAskForPublications(false);
                setShowPublicationModal(true);
              }}
              className="btn btn-primary"
            >
              Oui, gérer les publications
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  if (showPublicationModal) {
    return (
      <PublicationAssociationModal
        stand={stand}
        isOpen={true}
        onClose={onClose}
        publications={publications}
      />
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Changer l'affiche">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Affiche actuelle
          </label>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-center text-gray-600">
              <FileText className="h-5 w-5 mr-2 text-gray-400" />
              <span>{stand.currentPoster || 'Aucune affiche'}</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nouvelle affiche
          </label>
          <div className="space-y-4">
            <select
              className="input"
              value={selectedPoster}
              onChange={(e) => setSelectedPoster(e.target.value)}
              required
            >
              <option value="">Sélectionner une affiche</option>
              {availablePosters.map((poster) => (
                <option key={poster.id} value={poster.name}>
                  {poster.name}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setShowCreatePoster(true)}
              className="w-full btn btn-secondary flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Créer une nouvelle affiche
            </button>
          </div>
        </div>

        {selectedPoster && (
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-4">
              {availablePosters.find(p => p.name === selectedPoster)?.imageUrl ? (
                <img
                  src={availablePosters.find(p => p.name === selectedPoster)?.imageUrl}
                  alt={selectedPoster}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              ) : (
                <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center">
                  <Image className="h-8 w-8 text-gray-400" />
                </div>
              )}
              <div>
                <h4 className="font-medium text-gray-900">{selectedPoster}</h4>
                <p className="text-sm text-gray-600 mt-1">
                  {availablePosters.find(p => p.name === selectedPoster)?.description}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            disabled={loading}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Mise à jour...
              </div>
            ) : (
              'Changer l\'affiche'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default PosterChangeModal;