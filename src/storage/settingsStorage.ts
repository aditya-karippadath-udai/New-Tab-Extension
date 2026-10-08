import { AppSettings, WidgetConfig } from '../types';
import { getStorageItem, setStorageItem } from './browserStorage';

export const DEFAULT_WIDGETS: WidgetConfig[] = [
  { id: 'search', name: 'Search', enabled: true, size: 'large', order: 0 },
  { id: 'clock', name: 'Digital Clock', enabled: true, size: 'large', order: 1 },
  { id: 'calendar', name: 'Calendar', enabled: true, size: 'medium', order: 2 },
  { id: 'tasks', name: 'Tasks & To-Do', enabled: true, size: 'medium', order: 3 },
  { id: 'favorites', name: 'Favourite Pages', enabled: true, size: 'large', order: 4 },
  { id: 'bookmarks', name: 'Bookmarks Explorer', enabled: true, size: 'large', order: 5 },
  { id: 'notes', name: 'Quick Notes', enabled: false, size: 'medium', order: 6 },
];

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  accent: 'blue',
  density: 'comfortable',

  clockType: 'digital',
  timeFormat24: false,
  showSeconds: false,
  showDate: true,
  showGreeting: true,
  userName: 'Aditya',
  showUserNameInHeader: true,
  clockStyle: 'digital',

  defaultSearchEngine: 'google',
  openSearchInNewTab: false,
  showSearchSuggestions: true,

  openFavoritesInNewTab: true,

  defaultTaskFilter: 'all',
  showTaskProgress: true,

  wallpaper: {
    sourceType: 'builtin',
    selectedBuiltinId: 'cosmic_nebula',
    customUrl: '',
    gradient: 'radial-gradient(circle at 50% 20%, #171d2b 0%, #090c14 60%, #030408 100%)',
    brightness: 90,
    blur: 0,
    overlayOpacity: 35,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    animatedEffect: true,
  },

  widgets: DEFAULT_WIDGETS,

  quickNotes: '💡 Quick notes / scratchpad — automatically saved to browser storage.',

  bookmarkWidget: {
    displayMode: 'tree',
    maxItems: 8,
  },
};

const SETTINGS_KEY = 'auratab_settings';

export async function getSettings(): Promise<AppSettings> {
  const loaded = await getStorageItem<Partial<AppSettings>>(SETTINGS_KEY, {});
  return {
    ...DEFAULT_SETTINGS,
    ...loaded,
    wallpaper: {
      ...DEFAULT_SETTINGS.wallpaper,
      ...(loaded.wallpaper || {}),
    },
    widgets: (() => {
      if (!loaded.widgets || loaded.widgets.length === 0) return DEFAULT_SETTINGS.widgets;
      const existingIds = new Set(loaded.widgets.map((w) => w.id));
      const missingDefaults = DEFAULT_SETTINGS.widgets.filter((w) => !existingIds.has(w.id));
      return [...loaded.widgets, ...missingDefaults];
    })(),
  };
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  await setStorageItem(SETTINGS_KEY, settings);
}

export async function resetSettings(): Promise<AppSettings> {
  await setStorageItem(SETTINGS_KEY, DEFAULT_SETTINGS);
  return DEFAULT_SETTINGS;
}
