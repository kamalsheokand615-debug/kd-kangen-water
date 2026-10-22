import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, SiteSettings, HeroContent } from '../utils/api';

interface SettingsContextType {
  settings: SiteSettings;
  hero: HeroContent | null;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [hero, setHero] = useState<HeroContent | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshSettings = async () => {
    try {
      const [settingsRes, heroRes] = await Promise.all([
        api.get<SiteSettings>('/settings'),
        api.get<HeroContent>('/hero').catch(() => ({ data: null })),
      ]);
      setSettings(settingsRes.data);
      setHero(heroRes.data);
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refreshSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, hero, loading, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
}