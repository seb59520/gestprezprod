import React, { useState } from 'react';
import Modal from '../Modal';
import { Wrench, AlertTriangle } from 'lucide-react';
import { DisplayStand } from '../../types';
import { addMaintenance } from '../../services/maintenanceService';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

interface MaintenanceRequestModalProps {
  stand: DisplayStand;
  type: 'preventive' | 'curative';
  isOpen: boolean;
  onClose: () => void;
}

const MaintenanceRequestModal: React.FC<MaintenanceRequestModalProps> = ({
  stand,
  type,
  isOpen,
  onClose
}) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    issues: '',
    resolution: '',
    sparePartsUsed: [] as string[],
    nextMaintenanceDate: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error('Vous devez être connecté');
      return;
    }

    if (!formData.description || (type === 'curative' && !formData.issues)) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      setLoading(true);

      await addMaintenance(stand, {
        type,
        date: new Date().toISOString(),
        description: formData.description,
        issues: type === 'curative' ? formData.issues : undefined,
        resolution: formData.resolution || undefined,
        sparePartsUsed: formData.sparePartsUsed.length > 0 ? formData.sparePartsUsed : undefined,
        nextMaintenanceDate: formData.nextMaintenanceDate || undefined,
        notes: formData.notes || undefined,
        status: 'completed',
        performedBy: currentUser.email || 'Technicien'
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

  // Rest of the component remains the same...
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title={`Maintenance ${type === 'preventive' ? 'préventive' : 'curative'}`}
    >
      {/* Form JSX remains the same */}
    </Modal>
  );
};

export default MaintenanceRequestModal;