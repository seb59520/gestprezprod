import React, { useState, useEffect } from 'react';
import { useOrganization } from '../../context/OrganizationContext';
import { Flag, Plus, X, Edit2 } from 'lucide-react';
import Banner from '../Banner';
import { onSnapshot, orderBy, query } from 'firebase/firestore';
import { Banner as BannerType, getBannersRef, createBanner, updateBanner, deleteBanner } from '../../lib/banner';

const defaultFormData = {
  type: 'info' as const,
  title: '',
  message: '',
  isActive: true,
  startDate: '',
  endDate: ''
};

const BannerSettings = () => {
  const { currentOrganization } = useOrganization();
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState<string | null>(null);
  const [formData, setFormData] = useState(defaultFormData);
  const [banners, setBanners] = useState<BannerType[]>([]);

  useEffect(() => {
    if (!currentOrganization?.id) return;

    const bannersRef = getBannersRef(currentOrganization.id);
    const bannersQuery = query(bannersRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(bannersQuery, (snapshot) => {
      const bannersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BannerType[];
      setBanners(bannersData);
    });

    return () => unsubscribe();
  }, [currentOrganization?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOrganization?.id) return;

    try {
      setLoading(true);

      if (editingBanner) {
        await updateBanner(currentOrganization.id, editingBanner, formData);
      } else {
        await createBanner(currentOrganization.id, formData);
      }

      setShowAddForm(false);
      setEditingBanner(null);
      setFormData(defaultFormData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (banner: BannerType) => {
    setFormData({
      type: banner.type,
      title: banner.title,
      message: banner.message,
      isActive: banner.isActive,
      startDate: banner.startDate || '',
      endDate: banner.endDate || ''
    });
    setEditingBanner(banner.id);
    setShowAddForm(true);
  };

  const handleDelete = async (bannerId: string) => {
    if (!currentOrganization?.id) return;
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette bannière ?')) return;

    try {
      await deleteBanner(currentOrganization.id, bannerId);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Banner
        type="info"
        title="Gestion des bannières"
        message="Configurez les bannières d'information qui s'afficheront dans votre application."
      />

      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Flag className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Bannières</h2>
              <p className="text-sm text-gray-600">Gérez vos bannières d'information</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une bannière
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleSubmit} className="mb-8 space-y-4 border-b border-gray-200 pb-8">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titre
                </label>
                <input
                  type="text"
                  className="input"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  className="input"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                >
                  <option value="info">Information</option>
                  <option value="success">Succès</option>
                  <option value="warning">Avertissement</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                className="input"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de début
                </label>
                <input
                  type="date"
                  className="input"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de fin
                </label>
                <input
                  type="date"
                  className="input"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="h-4 w-4 text-blue-600 rounded border-gray-300"
              />
              <label htmlFor="isActive" className="text-sm text-gray-700">
                Bannière active
              </label>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingBanner(null);
                  setFormData(defaultFormData);
                }}
                className="btn btn-secondary"
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
                    {editingBanner ? 'Mise à jour...' : 'Ajout...'}
                  </div>
                ) : (
                  editingBanner ? 'Mettre à jour' : 'Ajouter'
                )}
              </button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className={`p-4 rounded-lg border ${
                banner.isActive ? 'bg-white' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      banner.type === 'success'
                        ? 'bg-green-100 text-green-700'
                        : banner.type === 'warning'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {banner.type === 'success' ? 'Succès' : banner.type === 'warning' ? 'Avertissement' : 'Information'}
                    </span>
                    {!banner.isActive && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                        Inactive
                      </span>
                    )}
                  </div>
                  <h3 className="font-medium text-gray-900">{banner.title}</h3>
                  <p className="text-sm text-gray-600">{banner.message}</p>
                  {(banner.startDate || banner.endDate) && (
                    <p className="text-xs text-gray-500">
                      {banner.startDate && `Du ${banner.startDate}`}
                      {banner.endDate && ` au ${banner.endDate}`}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(banner)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BannerSettings;