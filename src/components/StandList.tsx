import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { DisplayStand, Publication, Poster } from '../types';
import { MapPin, Clock, User, FileText, AlertTriangle, BookOpen, ExternalLink, Wrench, Calendar, Image, Plus } from 'lucide-react';
import ReservationModal from './ReservationModal';
import PosterRequestModal from './PosterRequestModal';
import PublicationStockModal from './PublicationStockModal';
import PublicationRequestModal from './PublicationRequestModal';
import MaintenanceModal from './MaintenanceModal';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { toast } from 'react-hot-toast';

interface StandListProps {
  stands: DisplayStand[];
  onReserve: (standId: string, data: any) => void;
  onCancelReservation: (standId: string) => void;
  onPosterRequest: (standId: string, requestedPoster: string, notes: string) => void;
  onUpdateStock: (standId: string, publicationId: string, quantity: number) => void;
  availablePosters: Poster[];
  publications: Publication[];
  hoveredStandId: string | null;
  setHoveredStandId: (id: string | null) => void;
  getLowStockPublications: (standId: string) => any[];
}

const StandList: React.FC<StandListProps> = ({
  stands,
  onReserve,
  onCancelReservation,
  onPosterRequest,
  onUpdateStock,
  availablePosters,
  publications,
  hoveredStandId,
  setHoveredStandId,
  getLowStockPublications
}) => {
  const [selectedStand, setSelectedStand] = useState<DisplayStand | null>(null);
  const [posterRequestStand, setPosterRequestStand] = useState<DisplayStand | null>(null);
  const [stockModalStand, setStockModalStand] = useState<DisplayStand | null>(null);
  const [maintenanceModalStand, setMaintenanceModalStand] = useState<any>(null);
  const [publicationModalStand, setPublicationModalStand] = useState<DisplayStand | null>(null);

  const handleCancelReservation = async (standId: string) => {
    try {
      const standRef = doc(db, 'stands', standId);
      await updateDoc(standRef, {
        isReserved: false,
        reservedBy: null,
        reservedUntil: null,
        lastUpdated: serverTimestamp()
      });

      toast.success('Réservation annulée avec succès');
      onCancelReservation(standId);
    } catch (error) {
      console.error('Error canceling reservation:', error);
      toast.error('Erreur lors de l\'annulation de la réservation');
    }
  };

  return (
    <div className="card overflow-hidden bg-gradient-to-br from-white to-gray-50">
      {/* Rest of the component implementation */}
    </div>
  );
};

export default StandList;