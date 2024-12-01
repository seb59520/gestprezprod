import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import Modal from './Modal';
import { DisplayStand, Publication } from '../types';
import { BookOpen, Plus, X } from 'lucide-react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useStands } from '../context/StandsContext';

interface PublicationAssociationModalProps {
  stand: DisplayStand;
  isOpen: boolean;
  onClose: () => void;
  publications: Publication[];
}

const PublicationAssociationModal: React.FC<PublicationAssociationModalProps> = ({
  stand,
  isOpen,
  onClose,
  publications
}) => {
  const { setStands } = useStands();
  const [loading, setLoading] = useState(false);
  const [selectedPublications, setSelectedPublications] = useState<Record<string, number>>(
    Object.fromEntries(
      (stand.publications || []).map(pub => [pub.publicationId, pub.quantity])
    )
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const standRef = doc(db, 'stands', stand.id);
      
      const updatedPublications = Object.entries(selectedPublications).map(([id, quantity]) => ({
        publicationId: id,
        quantity,
        lastUpdated: new Date().toISOString()
      }));

      await updateDoc(standRef, {
        publications: updatedPublications,
        lastUpdated: serverTimestamp()
      });

      // Mise à jour de l'état local
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

      toast.success('Publications associées avec succès');
      onClose();
    } catch (error) {
      console.error('Error associating publications:', error);
      toast.error('Erreur lors de l\'association des publications');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Gérer les publications">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {publications.map(publication => {
            const isSelected = publication.id in selectedPublications;
            
            return (
              <div 
                key={publication.id} 
                className={`p-4 rounded-lg border-2 transition-colors ${
                  isSelected ? 'border-blue-200 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-4">
                  {publication.imageUrl ? (
                    <img 
                      src={publication.imageUrl} 
                      alt={publication.title}
                      className="w-16 h-16 rounded object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                      <BookOpen className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{publication.title}</h3>
                    <p className="text-sm text-gray-500">{publication.description}</p>
                    
                    <div className="mt-2 flex items-center gap-4">
                      {isSelected ? (
                        <>
                          <input
                            type="number"
                            min="0"
                            className="input w-24"
                            value={selectedPublications[publication.id]}
                            onChange={(e) => setSelectedPublications(prev => ({
                              ...prev,
                              [publication.id]: parseInt(e.target.value) || 0
                            }))}
                          />
                          <button
                            type="button"
                            onClick={() => setSelectedPublications(prev => {
                              const { [publication.id]: _, ...rest } = prev;
                              return rest;
                            })}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setSelectedPublications(prev => ({
                            ...prev,
                            [publication.id]: 0
                          }))}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Plus className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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

export default PublicationAssociationModal;