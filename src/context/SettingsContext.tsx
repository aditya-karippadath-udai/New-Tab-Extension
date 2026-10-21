import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { AppSettings, AccentColor, ThemeMode, WallpaperConfig, WidgetConfig } from '../types';
import { getSettings, saveSettings, resetSettings, DEFAULT_SETTINGS } from '../storage/settingsStorage';
import { ACCENT_THEMES, AccentThemeDef } from '../utils/accentThemes';

interface SettingsContextType {
  settings: AppSettings;
  loading: boolean;
  effectiveTheme: 'dark' | 'light';
  accentTheme: AccentThemeDef;
  updateSettings: (updater: Partial<AppSettings> | ((prev: AppSettings) => AppSettings)) => void;
  updateWallpaper: (updater: Partial<WallpaperConfig>) => void;
  updateWidgets: (widgets: WidgetConfig[]) => void;
  resetAllSettings: () => Promise<void>;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Load settings on initial mount
  useEffect(() => {
    let isMounted = true;
    getSettings().then((loaded) => {
      if (isMounted) {
        setSettings(loaded);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync effective dark/light theme
  const [systemIsDark, setSystemIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemIsDark(e.matches);
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, []);

  const effectiveTheme: 'dark' | 'light' = useMemo(() => {
    if (settings.theme === 'system') {
      return systemIsDark ? 'dark' : 'light';
    }
    return settings.theme;
  }, [settings.theme, systemIsDark]);

  // Apply dark or light class & colorScheme to document
  useEffect(() => {
    const root = document.documentElement;
    root.style.colorScheme = effectiveTheme;
    if (effectiveTheme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [effectiveTheme]);

  const updateSettings = (updater: Partial<AppSettings> | ((prev: AppSettings) => AppSettings)) => {
    setSettings((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      saveSettings(next);
      return next;
    });
  };

  const updateWallpaper = (updater: Partial<WallpaperConfig>) => {
    setSettings((prev) => {
      const next: AppSettings = {
        ...prev,
        wallpaper: {
          ...prev.wallpaper,
          ...updater,
        },
      };
      saveSettings(next);
      return next;
    });
  };

  const updateWidgets = (widgets: WidgetConfig[]) => {
    setSettings((prev) => {
      const next = { ...prev, widgets };
      saveSettings(next);
      return next;
    });
  };

  const resetAllSettings = async () => {
    const res = await resetSettings();
    setSettings(res);
  };

  const accentTheme = useMemo(() => {
    return ACCENT_THEMES[settings.accent] || ACCENT_THEMES.blue;
  }, [settings.accent]);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        effectiveTheme,
        accentTheme,
        updateSettings,
        updateWallpaper,
        updateWidgets,
        resetAllSettings,
        isSettingsOpen,
        setIsSettingsOpen,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return ctx;
}
