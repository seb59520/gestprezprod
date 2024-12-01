import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStands } from '../context/StandsContext';
import { useAuth } from '../context/AuthContext';
import { useOrganization } from '../context/OrganizationContext';
import { useTheme } from '../context/ThemeContext';
import { Building2, LayoutDashboard, BarChart2, Settings, Wrench, AlertTriangle } from 'lucide-react';
import StandTableView from './StandTableView';
import StandGalleryView from './StandGalleryView';
import RequestsWidget from './widgets/RequestsWidget';
import LowStockWidget from './widgets/LowStockWidget';
import StatCard from './StatCard';
import ReservationModal from './ReservationModal';
import PosterChangeModal from './PosterChangeModal';
import PublicationAssociationModal from './PublicationAssociationModal';
import MaintenanceModal from './MaintenanceModal';
import StandHistoryModal from './StandHistoryModal';
import ExportButton from './ExportButton';

const Dashboard: React.FC = () => {
  const { stands, publications, availablePosters, getLowStockPublications } = useStands();
  const { currentUser } = useAuth();
  const { currentOrganization } = useOrganization();
  const { userPreferences } = useTheme();
  const [selectedStand, setSelectedStand] = useState<any>(null);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const navigate = useNavigate();

  // Calculate stats using the function
  const stats = {
    total: stands.length,
    reserved: stands.filter(stand => stand.isReserved).length,
    available: stands.filter(stand => !stand.isReserved).length,
    needsMaintenance: stands.filter(stand => {
      const lastMaintenance = stand.maintenanceHistory?.slice(-1)[0];
      if (!lastMaintenance) return true;
      const nextMaintenance = new Date(lastMaintenance.date);
      nextMaintenance.setMonth(nextMaintenance.getMonth() + 3);
      return new Date() > nextMaintenance;
    }).length,
    lowStock: stands.reduce((count, stand) => 
      count + (getLowStockPublications(stand.id).length > 0 ? 1 : 0), 0
    )
  };

  const handleAction = (stand: any, action: string) => {
    setSelectedStand(stand);
    setSelectedAction(action);
  };

  const closeModals = () => {
    setSelectedStand(null);
    setSelectedAction(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Tableau de Bord
        </h1>
        <ExportButton type="multiple" stands={stands} />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Total Présentoirs"
          value={stats.total}
          icon={<LayoutDashboard className="h-6 w-6" />}
          color="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50"
          link="/stands/total"
        />

        <StatCard
          title="Disponibles"
          value={stats.available}
          icon={<Building2 className="h-6 w-6" />}
          color="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/50 dark:to-green-800/50"
          link="/stands/available"
        />

        <StatCard
          title="Réservés"
          value={stats.reserved}
          icon={<BarChart2 className="h-6 w-6" />}
          color="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/50 dark:to-yellow-800/50"
          link="/stands/reserved"
        />

        <StatCard
          title="Maintenance"
          value={stats.needsMaintenance}
          icon={<Wrench className="h-6 w-6" />}
          color="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/50 dark:to-red-800/50"
          link="/stands/maintenance"
        />

        <StatCard
          title="Stock Bas"
          value={stats.lowStock}
          icon={<AlertTriangle className="h-6 w-6" />}
          color="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/50 dark:to-orange-800/50"
          link="/stands/low-stock"
        />
      </div>

      {/* Liste des présentoirs */}
      <div className="space-y-6">
        {userPreferences.viewMode === 'table' ? (
          <StandTableView
            stands={stands}
            publications={publications}
            availablePosters={availablePosters}
            onPosterRequest={handleAction}
            onUpdateStock={handleAction}
            getLowStockPublications={getLowStockPublications}
          />
        ) : (
          <StandGalleryView
            stands={stands}
            publications={publications}
            availablePosters={availablePosters}
            onPosterRequest={handleAction}
            onUpdateStock={handleAction}
            getLowStockPublications={getLowStockPublications}
            onSelectAction={handleAction}
          />
        )}
      </div>

      {/* Modals */}
      {selectedStand && selectedAction === 'reserve' && (
        <ReservationModal
          stand={selectedStand}
          isOpen={true}
          onClose={closeModals}
        />
      )}

      {selectedStand && selectedAction === 'poster' && (
        <PosterChangeModal
          stand={selectedStand}
          isOpen={true}
          onClose={closeModals}
          availablePosters={availablePosters}
        />
      )}

      {selectedStand && selectedAction === 'publications' && (
        <PublicationAssociationModal
          stand={selectedStand}
          isOpen={true}
          onClose={closeModals}
          publications={publications}
        />
      )}

      {selectedStand && selectedAction === 'maintenance' && (
        <MaintenanceModal
          stand={selectedStand}
          type="preventive"
          isOpen={true}
          onClose={closeModals}
        />
      )}

      {selectedStand && selectedAction === 'history' && (
        <StandHistoryModal
          stand={selectedStand}
          isOpen={true}
          onClose={closeModals}
        />
      )}
    </div>
  );
};

export default Dashboard;