import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "wayfinder_settings";

const DEFAULTS = {
  arMode: true,
  gpsTracking: true,
  voiceCommands: true,
};

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULTS);
  const [loaded, setLoaded] = useState(false);

  // Load saved settings on first mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          setSettings({ ...DEFAULTS, ...JSON.parse(raw) });
        } catch (_) {}
      }
      setLoaded(true);
    });
  }, []);

  // Save to AsyncStorage whenever settings change
  async function updateSetting(key, value) {
    const next = { ...settings, [key]: value };
    setSettings(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  if (!loaded) return null;

  return (
    <SettingsContext.Provider value={{ settings, updateSetting }}>
      {children}
    </SettingsContext.Provider>
  );
}

// Hook for easy access in any screen
export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside SettingsProvider");
  return ctx;
}
