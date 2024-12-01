import React, { useState } from 'react';
import { format, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'react-hot-toast';
import Modal from './Modal';
import { DisplayStand } from '../types';
import { validateReservationPeriod } from '../utils/reservationUtils';
import { doc, updateDoc, serverTimestamp, arrayUnion } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useStands } from '../context/StandsContext';
import { Calendar, User, Clock, InfinityIcon } from 'lucide-react';

interface ReservationModalProps {
  stand: DisplayStand;
  isOpen: boolean;
  onClose: () => void;
}

const ReservationModal: React.FC<ReservationModalProps> = ({
  stand,
  isOpen,
  onClose,
}) => {
  const { setStands } = useStands();
  const tomorrow = addDays(new Date(), 1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    startDate: format(tomorrow, 'yyyy-MM-dd'),
    endDate: format(addDays(tomorrow, 7), 'yyyy-MM-dd'),
    isPerpetual: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.name.trim().length < 2) {
      toast.error('Le nom doit contenir au moins 2 caractères');
      return;
    }

    const startDate = new Date(formData.startDate);
    if (!formData.isPerpetual) {
      const endDate = new Date(formData.endDate);
      const validationError = validateReservationPeriod(startDate, endDate);
      if (validationError) {
        toast.error(validationError);
        return;
      }
    }

    try {
      setLoading(true);
      const standRef = doc(db, 'stands', stand.id);
      
      const reservationData = {
        reservedBy: formData.name,
        startDate: startDate.toISOString(),
        endDate: formData.isPerpetual ? null : new Date(formData.endDate).toISOString(),
        isPerpetual: formData.isPerpetual,
        createdAt: new Date().toISOString()
      };

      await updateDoc(standRef, {
        isReserved: true,
        reservedBy: formData.name,
        reservedUntil: formData.isPerpetual ? null : new Date(formData.endDate).toISOString(),
        isPerpetual: formData.isPerpetual,
        lastUpdated: serverTimestamp(),
        reservationHistory: arrayUnion(reservationData)
      });

      // Mettre à jour l'état local
      setStands(prevStands => 
        prevStands.map(s => {
          if (s.id === stand.id) {
            return {
              ...s,
              isReserved: true,
              reservedBy: formData.name,
              reservedUntil: formData.isPerpetual ? null : new Date(formData.endDate).toISOString(),
              isPerpetual: formData.isPerpetual,
              lastUpdated: new Date().toISOString(),
              reservationHistory: [...(s.reservationHistory || []), reservationData]
            };
          }
          return s;
        })
      );

      toast.success('Présentoir réservé avec succès');
      onClose();
    } catch (error) {
      console.error('Error making reservation:', error);
      toast.error('Erreur lors de la réservation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Réserver ${stand.name}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Votre nom
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              required
              minLength={2}
              className="input pl-10"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Entrez votre nom"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            id="isPerpetual"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            checked={formData.isPerpetual}
            onChange={(e) => setFormData({ ...formData, isPerpetual: e.target.checked })}
          />
          <label htmlFor="isPerpetual" className="flex items-center gap-2 text-sm text-gray-700">
            <InfinityIcon className="h-4 w-4" />
            Prêt perpétuel
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de début
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                required
                min={format(tomorrow, 'yyyy-MM-dd')}
                className="input pl-10"
                value={formData.startDate}
                onChange={(e) => setFormData({
                  ...formData,
                  startDate: e.target.value,
                  endDate: format(addDays(new Date(e.target.value), 7), 'yyyy-MM-dd')
                })}
              />
            </div>
          </div>

          {!formData.isPerpetual && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de fin
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  required={!formData.isPerpetual}
                  min={formData.startDate}
                  className="input pl-10"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>
          )}
        </div>

        <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-700">
          <ul className="space-y-1">
            {!formData.isPerpetual && (
              <li>• Durée maximale de réservation : 30 jours</li>
            )}
            <li>• La réservation commence le lendemain</li>
            <li>• L'historique des réservations est conservé</li>
            {formData.isPerpetual && (
              <li>• Le prêt perpétuel n'a pas de date de fin</li>
            )}
          </ul>
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
                Réservation en cours...
              </div>
            ) : (
              'Réserver'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ReservationModal;