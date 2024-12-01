import React, { useState } from 'react';
import { Plus, Package, Edit2, Trash2, Search, Wrench } from 'lucide-react';
import SparePartModal from './SparePartModal';

interface SparePart {
  id: string;
  name: string;
  reference: string;
  quantity: number;
  minStock: number;
  supplier: string;
  category: string;
  lastOrderDate?: string;
}

const SpareParts: React.FC = () => {
  const [parts, setParts] = useState<SparePart[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPart, setEditingPart] = useState<SparePart | null>(null);

  const filteredParts = parts.filter(part => 
    part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    part.reference.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setParts(parts.filter(part => part.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec recherche et bouton d'ajout */}
      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="input pl-10"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une pièce
        </button>
      </div>

      {/* Liste des pièces */}
      <div className="grid gap-4">
        {filteredParts.map(part => (
          <div 
            key={part.id}
            className="card p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                    <Package className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">{part.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Réf: {part.reference}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Stock</p>
                    <p className={`font-medium ${
                      part.quantity < part.minStock
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-gray-900 dark:text-gray-100'
                    }`}>
                      {part.quantity} / {part.minStock}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Fournisseur</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{part.supplier}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Catégorie</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{part.category}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setEditingPart(part)}
                  className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(part.id)}
                  className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredParts.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Aucune pièce détachée
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Commencez par ajouter des pièces détachées à votre inventaire
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      {(showAddModal || editingPart) && (
        <SparePartModal
          isOpen={true}
          onClose={() => {
            setShowAddModal(false);
            setEditingPart(null);
          }}
          part={editingPart}
          onSubmit={(data) => {
            if (editingPart) {
              setParts(parts.map(p => p.id === editingPart.id ? { ...p, ...data } : p));
            } else {
              setParts([...parts, { id: crypto.randomUUID(), ...data }]);
            }
            setShowAddModal(false);
            setEditingPart(null);
          }}
        />
      )}
    </div>
  );
};

export default SpareParts;