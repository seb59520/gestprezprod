import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStands } from '../context/StandsContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { MapPin, Calendar, Clock, User, FileText, AlertTriangle, BookOpen, ArrowLeft } from 'lucide-react';
import Modal from './Modal';
import { toast } from 'react-hot-toast';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { getStandAge, getAgeStatus } from '../utils/standUtils';
import ExportButton from './ExportButton';

const StandDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { stands } = useStands();
  const [showInstallDateModal, setShowInstallDateModal] = useState(false);
  const [installDate, setInstallDate] = useState('');

  const stand = stands.find(s => s.id === id);

  if (!stand) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="card p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Présentoir non trouvé
          </h2>
          <p className="text-gray-600 mb-6">
            Le présentoir demandé n'existe pas ou n'est plus disponible.
          </p>
          <button
            onClick={() => navigate('/')}
            className="btn btn-primary inline-flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au tableau de bord
          </button>
        </div>
      </div>
    );
  }

  const age = getStandAge(stand.createdAt);
  const ageStatus = getAgeStatus(stand.createdAt);

  const handleUpdateInstallDate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, 'stands', stand.id), {
        createdAt: new Date(installDate).toISOString()
      });
      toast.success('Date d\'installation mise à jour');
      setShowInstallDateModal(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-900 mb-4 inline-flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au tableau de bord
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{stand.name}</h1>
          <p className="text-gray-600 mt-1 flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            {stand.location}
          </p>
        </div>
        <ExportButton type="single" stand={stand} />
      </div>

      {/* ... (reste du code) */}
    </div>
  );
};

export default StandDetailPage;