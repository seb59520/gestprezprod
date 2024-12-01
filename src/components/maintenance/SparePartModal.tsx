import React, { useState } from 'react';
import Modal from '../Modal';
import { Package } from 'lucide-react';

interface SparePartModalProps {
  isOpen: boolean;
  onClose: () => void;
  part?: any;
  onSubmit: (data: any) => void;
}

const SparePartModal: React.FC<SparePartModalProps> = ({
  isOpen,
  onClose,
  part,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    name: part?.name || '',
    reference: part?.reference || '',
    quantity: part?.quantity || 0,
    minStock: part?.minStock || 1,
    supplier: part?.supplier || '',
    category: part?.category || '',
    notes: part?.notes || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={part ? "Modifier une pièce détachée" : "Ajouter une pièce détachée"}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nom de la pièce *
          </label>
          <input
            type="text"
            className="input"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Référence *
          </label>
          <input
            type="text"
            className="input"
            value={formData.reference}
            onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Quantité en stock *
            </label>
            <input
              type="number"
              min="0"
              className="input"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Stock minimum *
            </label>
            <input
              type="number"
              min="1"
              className="input"
              value={formData.minStock}
              onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value) })}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Fournisseur *
          </label>
          <input
            type="text"
            className="input"
            value={formData.supplier}
            onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Catégorie *
          </label>
          <select
            className="input"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
          >
            <option value="">Sélectionner une catégorie</option>
            <option value="mechanical">Mécanique</option>
            <option value="electrical">Électrique</option>
            <option value="electronic">Électronique</option>
            <option value="structural">Structure</option>
            <option value="other">Autre</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Notes
          </label>
          <textarea
            className="input"
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Informations complémentaires..."
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="btn btn-primary"
          >
            {part ? 'Mettre à jour' : 'Ajouter'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default SparePartModal;