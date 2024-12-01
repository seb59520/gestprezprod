import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import Modal from './Modal';
import { DisplayStand } from '../types';
import { Wrench, AlertTriangle, User, FileText } from 'lucide-react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { addHistoryRecord } from '../utils/historyUtils';
import { useAuth } from '../context/AuthContext';

interface MaintenanceModalProps {
  stand: DisplayStand;
  type: 'preventive' | 'curative';
  isOpen: boolean;
  onClose: () => void;
}

const MaintenanceModal: React.FC<MaintenanceModalProps> = ({
  stand,
  type,
  isOpen,
  onClose
}) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    technicianName: '',
    description: '',
    issues: '',
    resolution: '',
    canBeReserved: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    if (!formData.technicianName || !formData.description) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      setLoading(true);
      const standRef = doc(db, 'stands', stand.id);
      
      const maintenanceData = {
        id: crypto.randomUUID(),
        type,
        date: new Date().toISOString(),
        performedBy: formData.technicianName,
        description: formData.description,
        issues: type === 'curative' ? formData.issues : undefined,
        resolution: type === 'curative' ? formData.resolution : undefined,
        status: 'completed',
        canBeReserved: formData.canBeReserved
      };

      const newHistory = addHistoryRecord(stand, 'maintenance', currentUser.email || 'Utilisateur', {
        type,
        description: formData.description
      });

      await updateDoc(standRef, {
        maintenanceHistory: [...(stand.maintenanceHistory || []), maintenanceData],
        lastMaintenance: new Date().toISOString(),
        isAvailableForReservation: formData.canBeReserved,
        lastUpdated: serverTimestamp(),
        history: newHistory
      });

      toast.success('Maintenance enregistrée avec succès');
      onClose();
    } catch (error) {
      console.error('Error submitting maintenance:', error);
      toast.error('Erreur lors de l\'enregistrement de la maintenance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nouvelle maintenance">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className={`p-4 rounded-lg ${
          type === 'preventive' 
            ? 'bg-blue-50 border border-blue-100'
            : 'bg-yellow-50 border border-yellow-100'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            {type === 'preventive' ? (
              <Wrench className="h-5 w-5 text-blue-600" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            )}
            <span className={`font-medium ${
              type === 'preventive' ? 'text-blue-700' : 'text-yellow-700'
            }`}>
              Maintenance {type === 'preventive' ? 'préventive' : 'curative'}
            </span>
          </div>
          <p className={`text-sm ${
            type === 'preventive' ? 'text-blue-600' : 'text-yellow-600'
          }`}>
            {type === 'preventive'
              ? 'Maintenance planifiée pour assurer le bon fonctionnement'
              : 'Intervention suite à un problème signalé'
            }
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom du technicien *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="input pl-10"
              value={formData.technicianName}
              onChange={(e) => setFormData({ ...formData, technicianName: e.target.value })}
              required
              placeholder="Nom du technicien"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description des opérations *
          </label>
          <div className="relative">
            <div className="absolute top-3 left-3 pointer-events-none">
              <FileText className="h-5 w-5 text-gray-400" />
            </div>
            <textarea
              className="input pl-10"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={3}
              placeholder="Décrivez les opérations effectuées"
            />
          </div>
        </div>

        {type === 'curative' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Problèmes constatés *
              </label>
              <textarea
                className="input"
                value={formData.issues}
                onChange={(e) => setFormData({ ...formData, issues: e.target.value })}
                required
                rows={3}
                placeholder="Décrivez les problèmes identifiés"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Solutions apportées *
              </label>
              <textarea
                className="input"
                value={formData.resolution}
                onChange={(e) => setFormData({ ...formData, resolution: e.target.value })}
                required
                rows={3}
                placeholder="Décrivez les solutions mises en place"
              />
            </div>
          </>
        )}

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="canBeReserved"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            checked={formData.canBeReserved}
            onChange={(e) => setFormData({ ...formData, canBeReserved: e.target.checked })}
          />
          <label htmlFor="canBeReserved" className="text-sm text-gray-700">
            Le présentoir peut être réservé après la maintenance
          </label>
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
                Enregistrement...
              </div>
            ) : (
              'Enregistrer'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default MaintenanceModal;