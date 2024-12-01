import React, { useState, useRef } from 'react';
import Modal from './Modal';
import { useAuth } from '../context/AuthContext';
import { useOrganization } from '../context/OrganizationContext';
import { toast } from 'react-hot-toast';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { Upload, Image } from 'lucide-react';
import { POSTER_CATEGORIES } from '../constants/categories';

interface AddPosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (posterName: string) => void;
}

const AddPosterModal: React.FC<AddPosterModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { currentUser } = useAuth();
  const { currentOrganization } = useOrganization();
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    file: null as File | null
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Veuillez sélectionner une image');
        return;
      }

      setFormData({ ...formData, file });
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser || !currentOrganization) {
      toast.error('Vous devez être connecté');
      return;
    }

    if (!formData.name || !formData.category || !formData.file) {
      toast.error('Veuillez remplir tous les champs obligatoires et sélectionner une image');
      return;
    }

    try {
      setLoading(true);

      // Upload image
      const storageRef = ref(storage, `posters/${currentOrganization.id}/${Date.now()}_${formData.file.name}`);
      const uploadResult = await uploadBytes(storageRef, formData.file);
      const imageUrl = await getDownloadURL(uploadResult.ref);

      // Create poster document
      const posterData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        imageUrl,
        storagePath: storageRef.fullPath,
        isActive: true,
        organizationId: currentOrganization.id,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'posters'), posterData);
      
      toast.success('Affiche ajoutée avec succès');
      if (onSuccess) {
        onSuccess(formData.name);
      }
      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      toast.error('Erreur lors de l\'ajout de l\'affiche');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ajouter une nouvelle affiche">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom de l'affiche *
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            className="input"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image *
          </label>
          <div className="mt-1 flex items-center gap-4">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="btn btn-secondary"
            >
              <Upload className="h-4 w-4 mr-2" />
              Choisir une image
            </button>
          </div>
          {previewImage && (
            <div className="mt-4">
              <img
                src={previewImage}
                alt="Aperçu"
                className="max-h-48 rounded-lg object-contain"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Catégorie *
          </label>
          <select
            className="input"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
          >
            <option value="">Sélectionnez une catégorie</option>
            {POSTER_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
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
                Ajout en cours...
              </div>
            ) : (
              'Ajouter'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddPosterModal;