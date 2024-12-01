import React, { useState } from 'react';
import Modal from './Modal';
import { useAuth } from '../context/AuthContext';
import { useOrganization } from '../context/OrganizationContext';
import { useStands } from '../context/StandsContext';
import { toast } from 'react-hot-toast';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Plus, Image } from 'lucide-react';
import AddPosterModal from './AddPosterModal';
import { format } from 'date-fns';

interface AddStandModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddStandModal: React.FC<AddStandModalProps> = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const { currentOrganization } = useOrganization();
  const { availablePosters } = useStands();
  const [loading, setLoading] = useState(false);
  const [showAddPoster, setShowAddPoster] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    currentPoster: '',
    installationDate: format(new Date(), 'yyyy-MM-dd')
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser || !currentOrganization) {
      toast.error('Vous devez être connecté');
      return;
    }

    if (formData.name.trim().length < 2) {
      toast.error('Le nom doit contenir au moins 2 caractères');
      return;
    }

    try {
      setLoading(true);

      await addDoc(collection(db, 'stands'), {
        ...formData,
        organizationId: currentOrganization.id,
        createdAt: new Date(formData.installationDate).toISOString(),
        lastUpdated: serverTimestamp(),
        isReserved: false,
        maintenanceHistory: [],
        publications: [],
        posterRequests: [],
        reservationHistory: []
      });

      toast.success('Présentoir ajouté avec succès');
      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      toast.error('Erreur lors de l\'ajout du présentoir');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Ajouter un nouveau présentoir">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom du présentoir *
            </label>
            <input
              type="text"
              className="input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              minLength={2}
              placeholder="Ex: Présentoir Hall Principal"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Localisation *
            </label>
            <input
              type="text"
              className="input"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
              placeholder="Ex: Hall d'entrée"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de mise en service *
            </label>
            <input
              type="date"
              className="input"
              value={formData.installationDate}
              onChange={(e) => setFormData({ ...formData, installationDate: e.target.value })}
              required
              max={format(new Date(), 'yyyy-MM-dd')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Affiche actuelle
            </label>
            <div className="space-y-2">
              <select
                className="input"
                value={formData.currentPoster}
                onChange={(e) => setFormData({ ...formData, currentPoster: e.target.value })}
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
                onClick={() => setShowAddPoster(true)}
                className="w-full btn btn-secondary flex items-center justify-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Ajouter une nouvelle affiche
              </button>
            </div>
          </div>

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
                  Ajout en cours...
                </div>
              ) : (
                'Ajouter le présentoir'
              )}
            </button>
          </div>
        </form>
      </Modal>

      {showAddPoster && (
        <AddPosterModal
          isOpen={showAddPoster}
          onClose={() => setShowAddPoster(false)}
          onSuccess={(posterName) => {
            setFormData({ ...formData, currentPoster: posterName });
            setShowAddPoster(false);
          }}
        />
      )}
    </>
  );
};

export default AddStandModal;