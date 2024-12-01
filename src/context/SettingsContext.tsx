import React, { createContext, useContext, useState, useEffect } from 'react';
import { OrganizationSettings } from '../types';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { useOrganization } from './OrganizationContext';

interface SettingsContextType {
  settings: OrganizationSettings;
  updateSettings: (newSettings: Partial<OrganizationSettings>) => Promise<void>;
}

const defaultSettings: OrganizationSettings = {
  baseUrl: window.location.origin + '/stand/',
  maxReservationDays: 30,
  minAdvanceHours: 24,
  emailNotifications: {
    newReservation: true,
    posterRequest: true,
    maintenance: true
  },
  maintenance: {
    preventiveIntervalMonths: 3,
    emailNotifications: true
  }
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentOrganization } = useOrganization();
  const [settings, setSettings] = useState<OrganizationSettings>(defaultSettings);

  useEffect(() => {
    if (!currentOrganization?.id) return;

    const unsubscribe = onSnapshot(
      doc(db, 'organizations', currentOrganization.id),
      (doc) => {
        if (doc.exists()) {
          const orgData = doc.data();
          setSettings(orgData.settings || defaultSettings);
        }
      },
      (error) => {
        console.error('Error fetching settings:', error);
      }
    );

    return () => unsubscribe();
  }, [currentOrganization?.id]);

  const updateSettings = async (newSettings: Partial<OrganizationSettings>) => {
    if (!currentOrganization?.id) return;

    try {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);

      await doc(db, 'organizations', currentOrganization.id).update({
        settings: updatedSettings
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};