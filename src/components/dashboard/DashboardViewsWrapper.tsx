import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useStands } from '../../context/StandsContext';
import TotalStandsView from './TotalStandsView';
import AvailableStandsView from './AvailableStandsView';
import ReservedStandsView from './ReservedStandsView';
import MaintenanceStandsView from './MaintenanceStandsView';
import LowStockStandsView from './LowStockStandsView';

const DashboardViewsWrapper: React.FC = () => {
  const { stands, publications, getLowStockPublications } = useStands();

  return (
    <Routes>
      <Route path="total" element={<TotalStandsView stands={stands} />} />
      <Route path="available" element={<AvailableStandsView stands={stands} />} />
      <Route path="reserved" element={<ReservedStandsView stands={stands} />} />
      <Route path="maintenance" element={<MaintenanceStandsView stands={stands} />} />
      <Route 
        path="low-stock" 
        element={
          <LowStockStandsView
            stands={stands}
            publications={publications}
            getLowStockPublications={getLowStockPublications}
          />
        } 
      />
    </Routes>
  );
};

export default DashboardViewsWrapper;