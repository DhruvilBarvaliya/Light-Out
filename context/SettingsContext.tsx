import React, { createContext, useContext, useMemo, useState } from 'react';

export interface Settings {
  musicEnabled: boolean;
  soundEnabled: boolean;
}

interface SettingsContextValue extends Settings {
  setMusicEnabled: (enabled: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
}

const defaultSettings: Settings = {
  musicEnabled: true,
  soundEnabled: true,
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [musicEnabled, setMusicEnabled] = useState(defaultSettings.musicEnabled);
  const [soundEnabled, setSoundEnabled] = useState(defaultSettings.soundEnabled);

  const value = useMemo(
    () => ({
      musicEnabled,
      soundEnabled,
      setMusicEnabled,
      setSoundEnabled,
    }),
    [musicEnabled, soundEnabled]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }

  return context;
}
