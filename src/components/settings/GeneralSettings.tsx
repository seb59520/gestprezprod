import React, { useState, useEffect } from 'react';
import { useOrganization } from '../../context/OrganizationContext';
import { toast } from 'react-hot-toast';
import { Building2, Globe, Users, MapPin, Link } from 'lucide-react';
import Banner from '../Banner';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const GeneralSettings = () => {
  const { currentOrganization, setCurrentOrganization } = useOrganization();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: currentOrganization?.name || '',
    domain: currentOrganization?.domain || '',
    assembly: {
      name: currentOrganization?.assembly?.name || '',
      address: currentOrganization?.assembly?.address || '',
      city: currentOrganization?.assembly?.city || '',
      postalCode: currentOrganization?.assembly?.postalCode || '',
      country: currentOrganization?.assembly?.country || 'France',
      email: currentOrganization?.assembly?.email || '',
      phone: currentOrganization?.assembly?.phone || '',
      coordinates: {
        lat: currentOrganization?.assembly?.coordinates?.lat || '',
        lng: currentOrganization?.assembly?.coordinates?.lng || ''
      }
    },
    settings: {
      baseUrl: currentOrganization?.settings?.baseUrl || window.location.origin + '/stand/',
      maxReservationDays: currentOrganization?.settings?.maxReservationDays || 30,
      minAdvanceHours: currentOrganization?.settings?.minAdvanceHours || 24,
      emailNotifications: currentOrganization?.settings?.emailNotifications || {
        newReservation: true,
        posterRequest: true,
        maintenance: true
      }
    }
  });

  useEffect(() => {
    if (currentOrganization) {
      setFormData(prev => ({
        ...prev,
        name: currentOrganization.name,
        domain: currentOrganization.domain,
        assembly: currentOrganization.assembly || prev.assembly,
        settings: {
          ...prev.settings,
          ...currentOrganization.settings
        }
      }));
    }
  }, [currentOrganization]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOrganization?.id) return;

    try {
      setLoading(true);
      
      const orgRef = doc(db, 'organizations', currentOrganization.id);
      await updateDoc(orgRef, {
        name: formData.name,
        domain: formData.domain,
        assembly: formData.assembly,
        settings: {
          ...currentOrganization.settings,
          ...formData.settings
        }
      });

      setCurrentOrganization({
        ...currentOrganization,
        ...formData,
        settings: {
          ...currentOrganization.settings,
          ...formData.settings
        }
      });

      toast.success('Organisation mise à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Banner
        type="info"
        title="Paramètres généraux"
        message="Configurez les informations générales de votre organisation et de l'assemblée."
      />

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Base URL Settings */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Link className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                URL de base des présentoirs
              </h2>
              <p className="text-gray-600 text-sm">
                URL utilisée pour générer les liens publics des présentoirs
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL de base
              </label>
              <input
                type="url"
                className="input"
                value={formData.settings.baseUrl}
                onChange={(e) => setFormData({
                  ...formData,
                  settings: {
                    ...formData.settings,
                    baseUrl: e.target.value
                  }
                })}
                placeholder="https://votre-domaine.com/stand/"
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                Cette URL sera utilisée comme base pour tous les liens de présentoirs
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Exemple de lien</h3>
              <p className="text-sm text-blue-600">
                {formData.settings.baseUrl}123-abc
              </p>
            </div>
          </div>
        </div>

        {/* Organisation Info */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Informations de l'organisation
              </h2>
              <p className="text-gray-600 text-sm">
                Informations générales de votre organisation
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom de l'organisation
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
                Domaine
              </label>
              <input
                type="text"
                className="input"
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                required
              />
            </div>
          </div>
        </div>

        {/* Assembly Info */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Informations de l'assemblée
              </h2>
              <p className="text-gray-600 text-sm">
                Configurez les informations de votre assemblée
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de l'assemblée
                </label>
                <input
                  type="text"
                  className="input"
                  value={formData.assembly.name}
                  onChange={(e) => setFormData({
                    ...formData,
                    assembly: { ...formData.assembly, name: e.target.value }
                  })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="input"
                  value={formData.assembly.email}
                  onChange={(e) => setFormData({
                    ...formData,
                    assembly: { ...formData.assembly, email: e.target.value }
                  })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adresse
              </label>
              <input
                type="text"
                className="input"
                value={formData.assembly.address}
                onChange={(e) => setFormData({
                  ...formData,
                  assembly: { ...formData.assembly, address: e.target.value }
                })}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ville
                </label>
                <input
                  type="text"
                  className="input"
                  value={formData.assembly.city}
                  onChange={(e) => setFormData({
                    ...formData,
                    assembly: { ...formData.assembly, city: e.target.value }
                  })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Code postal
                </label>
                <input
                  type="text"
                  className="input"
                  value={formData.assembly.postalCode}
                  onChange={(e) => setFormData({
                    ...formData,
                    assembly: { ...formData.assembly, postalCode: e.target.value }
                  })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pays
                </label>
                <input
                  type="text"
                  className="input"
                  value={formData.assembly.country}
                  onChange={(e) => setFormData({
                    ...formData,
                    assembly: { ...formData.assembly, country: e.target.value }
                  })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone
                </label>
                <input
                  type="tel"
                  className="input"
                  value={formData.assembly.phone}
                  onChange={(e) => setFormData({
                    ...formData,
                    assembly: { ...formData.assembly, phone: e.target.value }
                  })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Latitude
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={formData.assembly.coordinates.lat}
                    onChange={(e) => setFormData({
                      ...formData,
                      assembly: {
                        ...formData.assembly,
                        coordinates: {
                          ...formData.assembly.coordinates,
                          lat: e.target.value
                        }
                      }
                    })}
                    placeholder="Ex: 48.8566"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Longitude
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={formData.assembly.coordinates.lng}
                    onChange={(e) => setFormData({
                      ...formData,
                      assembly: {
                        ...formData.assembly,
                        coordinates: {
                          ...formData.assembly.coordinates,
                          lng: e.target.value
                        }
                      }
                    })}
                    placeholder="Ex: 2.3522"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Mise à jour...' : 'Enregistrer les modifications'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GeneralSettings;