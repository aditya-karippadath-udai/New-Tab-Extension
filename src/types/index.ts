export type ThemeMode = 'dark' | 'light' | 'system';

export type AccentColor = 
  | 'blue'     // Electric Blue
  | 'cyan'     // Neon Cyan
  | 'purple'   // Cyber Violet
  | 'emerald'  // Fresh Mint/Emerald
  | 'amber'    // Warm Amber
  | 'rose';    // Crimson Rose

export type ClockStyle = 'digital' | 'minimal' | 'large';
export type ClockType = 'digital' | 'analog';

export type LayoutDensity = 'compact' | 'comfortable' | 'spacious';

export type SearchEngineId = 'google' | 'duckduckgo' | 'bing' | 'brave' | 'ecosia';

export interface SearchEngine {
  id: SearchEngineId;
  name: string;
  url: string; // e.g. "https://www.google.com/search?q="
  placeholder: string;
  iconName: string;
}

export type WallpaperSourceType = 'builtin' | 'url' | 'upload' | 'gradient' | 'live';

export type LiveWallpaperType =
  | 'aurora'
  | 'starfield'
  | 'particles'
  | 'matrix'
  | 'waves'
  | 'gradientMesh'
  | 'video';

export type LiveWallpaperColorScheme =
  | 'cyan'
  | 'cyber'
  | 'violet'
  | 'emerald'
  | 'fire'
  | 'monochrome';

export interface LiveWallpaperConfig {
  type: LiveWallpaperType;
  speed: number; // 0.3 - 2.5 (1 is normal)
  interactive: boolean; // responds to mouse movement
  colorScheme: LiveWallpaperColorScheme;
  videoUrl?: string; // Direct video URL or blob URL
  videoId?: string; // Stored in IndexedDB for custom video files
  videoName?: string; // Display name of imported live wallpaper
}

export type WallpaperCategory = 
  | 'Abstract' 
  | 'Dark' 
  | 'Nature' 
  | 'Mountains' 
  | 'Space' 
  | 'Minimal' 
  | 'Cyberpunk';

export interface BuiltinWallpaper {
  id: string;
  title: string;
  category: WallpaperCategory;
  url: string;
  thumbnailUrl?: string;
  gradient?: string;
}

export interface WallpaperConfig {
  sourceType: WallpaperSourceType;
  selectedBuiltinId: string;
  customUrl: string;
  uploadedImageId?: string; // stored in IndexedDB
  uploadedImageData?: string; // fallback base64
  gradient: string;
  brightness: number; // 30 - 120 (percent)
  blur: number; // 0 - 25 (px)
  overlayOpacity: number; // 0 - 90 (percent)
  backgroundPosition: string; // 'center', 'top', 'bottom'
  backgroundSize: 'cover' | 'contain';
  animatedEffect: boolean; // gentle starry drift effect
  liveWallpaper?: LiveWallpaperConfig;
}

export type WidgetType = 'clock' | 'search' | 'favorites' | 'tasks' | 'calendar' | 'notes' | 'bookmarks' | 'focus';

export type WidgetSize = 'small' | 'medium' | 'large';

export interface WidgetConfig {
  id: WidgetType;
  name: string;
  enabled: boolean;
  size: WidgetSize;
  order: number;
}

export type TaskPriority = 'none' | 'low' | 'medium' | 'high';

export interface TaskItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  completedAt?: number;
  priority: TaskPriority;
  dueDate?: string; // YYYY-MM-DD
}

export interface FavoriteItem {
  id: string;
  title: string;
  url: string;
  customIcon?: string;
  order: number;
}

export type EventCategory = 'milestone' | 'birthday' | 'deadline' | 'meeting' | 'holiday' | 'special';

export interface EventItem {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:MM
  category?: EventCategory;
  color?: string; // e.g. 'cyan', 'blue', 'purple', 'emerald', 'amber', 'rose'
  description?: string;
  createdAt: number;
}

export interface AppSettings {
  theme: ThemeMode;
  accent: AccentColor;
  density: LayoutDensity;
  
  // Clock & Profile
  clockType: ClockType; // 'digital' | 'analog'
  timeFormat24: boolean;
  showSeconds: boolean;
  showDate: boolean;
  showGreeting: boolean;
  userName: string;
  showUserNameInHeader?: boolean;
  clockStyle: ClockStyle;

  // Search
  defaultSearchEngine: SearchEngineId;
  openSearchInNewTab: boolean;
  showSearchSuggestions: boolean;

  // Favorites
  openFavoritesInNewTab: boolean;

  // Tasks
  defaultTaskFilter: 'all' | 'active' | 'completed' | 'today';
  showTaskProgress: boolean;

  // Wallpaper
  wallpaper: WallpaperConfig;

  // Widgets configuration
  widgets: WidgetConfig[];

  // Quick notes (bonus widget)
  quickNotes: string;

  // Bookmarks widget configuration
  bookmarkWidget?: import('./bookmark').BookmarkWidgetConfig;
}

export * from './bookmark';
