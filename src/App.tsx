import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AuthGuard from './components/AuthGuard';
import Login from './components/Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Statistics from './components/Statistics';
import Settings from './components/Settings';
import GuidedTour from './components/GuidedTour';
import Unauthorized from './components/Unauthorized';
import PublicStandView from './components/PublicStandView';
import HelpPage from './components/HelpPage';
import MaintenanceDashboard from './components/MaintenanceDashboard';
import GeneralSettings from './components/settings/GeneralSettings';
import BannerSettings from './components/settings/BannerSettings';
import PosterSettings from './components/settings/PosterSettings';
import PublicationSettings from './components/settings/PublicationSettings';
import StandSettings from './components/settings/StandSettings';
import MaintenanceSettings from './components/settings/MaintenanceSettings';
import NotificationSettings from './components/settings/NotificationSettings';
import UserProfileSettings from './components/settings/UserProfileSettings';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
        
        <Routes>
          {/* Routes publiques */}
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/stand/:id" element={<PublicStandView />} />
          <Route path="/help" element={<HelpPage />} />
          
          {/* Routes protégées */}
          <Route element={<AuthGuard><Layout /></AuthGuard>}>
            <Route index element={<Dashboard />} />
            <Route path="statistics" element={<Statistics />} />
            <Route path="maintenance" element={<MaintenanceDashboard />} />
            
            {/* Routes des paramètres */}
            <Route path="settings" element={<Settings />}>
              <Route path="general" element={<GeneralSettings />} />
              <Route path="banners" element={<BannerSettings />} />
              <Route path="stands" element={<StandSettings />} />
              <Route path="posters" element={<PosterSettings />} />
              <Route path="publications" element={<PublicationSettings />} />
              <Route path="maintenance" element={<MaintenanceSettings />} />
              <Route path="notifications" element={<NotificationSettings />} />
              <Route path="profile" element={<UserProfileSettings />} />
            </Route>
          </Route>
        </Routes>

        {/* Composant de visite guidée */}
        <GuidedTour />
      </div>
    </Router>
  );
};

export default App;