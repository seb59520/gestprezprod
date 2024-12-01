import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import Modal from './Modal';
import { DisplayStand, Publication } from '../types';
import { BookOpen, AlertTriangle } from 'lucide-react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useStands } from '../context/StandsContext';
import { predictStock } from '../utils/stockPrediction';

interface PublicationStockModalProps {
  stand: DisplayStand;
  isOpen: boolean;
  onClose: () => void;
  publications: Publication[];
}

const PublicationStockModal: React.FC<PublicationStockModalProps> = ({
  stand,
  isOpen,
  onClose,
  publications
}) => {
  const { setStands } = useStands();
  const [loading, setLoading] = useState(false);
  const [stocks, setStocks] = useState<Record<string, number>>(
    Object.fromEntries(
      (stand.publications || []).map(pub => [pub.publicationId, pub.quantity])
    )
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const standRef = doc(db, 'stands', stand.id);
      
      const updatedPublications = Object.entries(stocks).map(([id, quantity]) => ({
        publicationId: id,
        quantity,
        lastUpdated: new Date().toISOString()
      }));

      await updateDoc(standRef, {
        publications: updatedPublications,
        lastUpdated: serverTimestamp()
      });

      // Update local state
      setStands(prevStands => 
        prevStands.map(s => {
          if (s.id === stand.id) {
            return {
              ...s,
              publications: updatedPublications,
              lastUpdated: new Date().toISOString()
            };
          }
          return s;
        })
      );

      toast.success('Stocks mis à jour avec succès');
      onClose();
    } catch (error) {
      console.error('Error updating stocks:', error);
      toast.error('Erreur lors de la mise à jour des stocks');
    } finally {
      setLoading(false);
    }
  };

  const standPublications = stand.publications || [];
  const associatedPublications = standPublications
    .map(pub => {
      const publication = publications.find(p => p.id === pub.publicationId);
      return publication ? {
        ...publication,
        currentStock: pub.quantity
      } : null;
    })
    .filter(Boolean);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Gestion des stocks">
      <form onSubmit={handleSubmit} className="space-y-6">
        {associatedPublications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Aucune publication n'est associée à ce présentoir
          </div>
        ) : (
          <div className="space-y-4">
            {associatedPublications.map((publication: any) => {
              const prediction = predictStock(publication);
              const isLowStock = publication.currentStock < prediction.restockPoint;

              return (
                <div key={publication.id} className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      {publication.imageUrl ? (
                        <img
                          src={publication.imageUrl}
                          alt={publication.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <BookOpen className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900">{publication.title}</h3>
                        {isLowStock && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Stock bas
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-500 mt-1">{publication.description}</p>
                      
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Quantité en stock
                        </label>
                        <div className="mt-1 flex items-center gap-3">
                          <input
                            type="number"
                            min="0"
                            className="input w-24"
                            value={stocks[publication.id] || 0}
                            onChange={(e) => setStocks({
                              ...stocks,
                              [publication.id]: parseInt(e.target.value) || 0
                            })}
                          />
                          <div className="text-sm text-gray-500">
                            <span className="font-medium">Min: {publication.minStock}</span>
                            {isLowStock && (
                              <span className="ml-2 text-orange-600">
                                • Réappro. recommandée: {prediction.restockPoint - publication.currentStock}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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
            disabled={loading || associatedPublications.length === 0}
          >
            {loading ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Mise à jour...
              </div>
            ) : (
              'Mettre à jour les stocks'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default PublicationStockModal;