import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import Modal from './Modal';
import { DisplayStand } from '../types';
import { Wrench, AlertTriangle } from 'lucide-react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useStands } from '../context/StandsContext';

interface MaintenanceRequestModalProps {
  stand: DisplayStand;
  isOpen: boolean;
  onClose: () => void;
}

const MaintenanceRequestModal: React.FC<MaintenanceRequestModalProps> = ({
  stand,
  isOpen,
  onClose
}) => {
  const { setStands } = useStands();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    issues: '',
    urgency: 'normal' as 'low' | 'normal' | 'high'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.description || !formData.issues) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      setLoading(true);
      const standRef = doc(db, 'stands', stand.id);
      
      const maintenanceData = {
        id: crypto.randomUUID(),
        type: 'curative',
        date: new Date().toISOString(),
        requestedBy: 'Emprunteur', // À remplacer par l'utilisateur connecté
        description: formData.description,
        issues: formData.issues,
        urgency: formData.urgency,
        status: 'pending'
      };

      await updateDoc(standRef, {
        maintenanceHistory: [
          ...(stand.maintenanceHistory || []),
          maintenanceData
        ],
        lastUpdated: serverTimestamp()
      });

      // Mettre à jour l'état local
      setStands(prevStands => 
        prevStands.map(s => {
          if (s.id === stand.id) {
            return {
              ...s,
              maintenanceHistory: [
                ...(s.maintenanceHistory || []),
                maintenanceData
              ],
              lastUpdated: new Date().toISOString()
            };
          }
          return s;
        })
      );

      toast.success('Demande de maintenance envoyée avec succès');
      onClose();
    } catch (error) {
      console.error('Error submitting maintenance request:', error);
      toast.error('Erreur lors de l\'envoi de la demande');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title="Demande de maintenance"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
          <div className="flex items-center gap-2 text-yellow-700 mb-2">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-medium">Maintenance curative</span>
          </div>
          <p className="text-sm text-yellow-600">
            Utilisez ce formulaire pour signaler un problème nécessitant une intervention.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description du problème *
          </label>
          <textarea
            className="input"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            rows={3}
            placeholder="Décrivez le problème rencontré"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Actions déjà tentées *
          </label>
          <textarea
            className="input"
            value={formData.issues}
            onChange={(e) => setFormData({ ...formData, issues: e.target.value })}
            required
            rows={3}
            placeholder="Décrivez les actions que vous avez déjà tentées"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Niveau d'urgence
          </label>
          <select
            className="input"
            value={formData.urgency}
            onChange={(e) => setFormData({ 
              ...formData, 
              urgency: e.target.value as 'low' | 'normal' | 'high'
            })}
          >
            <option value="low">Faible - Peut attendre</option>
            <option value="normal">Normal - À traiter dès que possible</option>
            <option value="high">Urgent - Nécessite une intervention rapide</option>
          </select>
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
                Envoi en cours...
              </div>
            ) : (
              'Envoyer la demande'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default MaintenanceRequestModal;