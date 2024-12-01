import React, { createContext, useContext, useState, useEffect } from 'react';
import { preferences, UserPreferences, defaultPreferences } from '../lib/preferences';

interface ThemeContextType {
  userPreferences: UserPreferences;
  updatePreferences: (prefs: Partial<UserPreferences>) => Promise<void>;
  toggleTheme: () => Promise<void>;
  setViewMode: (mode: 'gallery' | 'table') => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(defaultPreferences);

  useEffect(() => {
    const loadPreferences = async () => {
      const prefs = await preferences.getAll();
      setUserPreferences(prefs);
      applyTheme(prefs.theme);
    };
    loadPreferences();
  }, []);

  const applyTheme = (theme: 'light' | 'dark') => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const updatePreferences = async (prefs: Partial<UserPreferences>) => {
    const newPrefs = { ...userPreferences, ...prefs };
    await preferences.saveAll(newPrefs);
    setUserPreferences(newPrefs);
    if (prefs.theme) {
      applyTheme(prefs.theme);
    }
  };

  const toggleTheme = async () => {
    const newTheme = userPreferences.theme === 'light' ? 'dark' : 'light';
    await updatePreferences({ theme: newTheme });
  };

  const setViewMode = async (mode: 'gallery' | 'table') => {
    await updatePreferences({ viewMode: mode });
  };

  return (
    <ThemeContext.Provider value={{ 
      userPreferences, 
      updatePreferences, 
      toggleTheme,
      setViewMode 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};