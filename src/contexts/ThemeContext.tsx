import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'light' | 'dark' | 'ocean' | 'sunset' | 'forest' | 'royal' | 'cyber' | 'lavender' | 'autumn' | 'midnight';

interface Settings {
  theme: Theme;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  allowAnalytics: boolean;
  shareUsageData: boolean;
}

interface ThemeContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  saveSettings: () => void;
  resetSettings: () => void;
}

const defaultSettings: Settings = {
  theme: 'light',
  emailNotifications: true,
  pushNotifications: true,
  smsNotifications: false,
  allowAnalytics: true,
  shareUsageData: false,
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('app-settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const saveSettings = () => {
    localStorage.setItem('app-settings', JSON.stringify(settings));
    // Show a brief success message (you could enhance this with a toast)
    console.log('Settings saved successfully!');
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('app-settings');
  };

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    root.className = `theme-${settings.theme}`;
  }, [settings.theme]);

  return (
    <ThemeContext.Provider value={{ settings, updateSettings, saveSettings, resetSettings }}>
      {children}
    </ThemeContext.Provider>
  );
};