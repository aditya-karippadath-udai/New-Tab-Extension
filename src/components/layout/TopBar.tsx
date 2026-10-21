import React from 'react';
import { Settings, Sun, Moon, Sparkles, Bookmark, Zap } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useBookmarks } from '../../context/BookmarkContext';

interface TopBarProps {
  onOpenSettings: () => void;
  onOpenLiveWallpaper: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenSettings, onOpenLiveWallpaper }) => {
  const { settings, effectiveTheme, updateSettings, accentTheme } = useSettings();
  const { setIsManagerOpen, stats } = useBookmarks();

  const toggleTheme = () => {
    const next = effectiveTheme === 'dark' ? 'light' : 'dark';
    updateSettings({ theme: next });
  };

  const isLiveActive = settings.wallpaper.sourceType === 'live';

  return (
    <header className="w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between text-neutral-300">
      {/* Zone 1: Single element brand wordmark */}
      <div className="flex items-center gap-2">
        <img
          src="./icons/Icon.png"
          alt="AuraTab Icon"
          className="w-5 h-5 rounded-md object-cover shadow-xs border border-white/10"
        />
        <span className="font-semibold text-sm tracking-wide text-neutral-100 flex items-center gap-1.5">
          <span>
            {settings.showUserNameInHeader !== false && settings.userName?.trim()
              ? settings.userName.trim()
              : 'AuraTab'}
          </span>
        </span>
        <span className="text-xs text-neutral-400 font-normal hidden sm:inline">
          · Productivity Dashboard
        </span>
      </div>

      {/* Zone 2: Quiet shortcut tips */}
      <div className="hidden md:flex items-center gap-4 text-xs text-neutral-400">
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-white/10 dark:bg-black/30 border border-white/10 font-mono text-[11px] text-neutral-300">
            /
          </kbd>
          <span>Search</span>
        </span>
        <span aria-hidden="true" className="text-neutral-600">·</span>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-white/10 dark:bg-black/30 border border-white/10 font-mono text-[11px] text-neutral-300">
            T
          </kbd>
          <span>Task</span>
        </span>
        <span aria-hidden="true" className="text-neutral-600">·</span>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-white/10 dark:bg-black/30 border border-white/10 font-mono text-[11px] text-neutral-300">
            B
          </kbd>
          <span>Bookmarks</span>
        </span>
      </div>

      {/* Zone 3: Actions */}
      <div className="flex items-center gap-2">
        {/* Live Wallpaper Studio Button */}
        <button
          onClick={onOpenLiveWallpaper}
          title="Open Live Wallpaper Studio (Choose & Import Video Loops)"
          aria-label="Open live wallpaper studio"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50 cursor-pointer ${
            isLiveActive
              ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-neutral-200 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Live Wallpaper</span>
          {isLiveActive ? (
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          ) : (
            <span className="text-[10px] text-neutral-400 hidden lg:inline">FX</span>
          )}
        </button>

        <button
          onClick={() => setIsManagerOpen(true)}
          title="Open Bookmarks Explorer (B)"
          aria-label="Open bookmarks"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-neutral-200 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50 cursor-pointer"
        >
          <Bookmark className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Bookmarks</span>
          <span className="text-[10px] text-neutral-400 font-mono tabular-nums">({stats.totalBookmarks})</span>
        </button>

        <button
          onClick={toggleTheme}
          title={`Switch to ${effectiveTheme === 'dark' ? 'Light' : 'Dark'} mode`}
          aria-label="Toggle theme"
          className="p-2 rounded-xl text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50 cursor-pointer"
        >
          {effectiveTheme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-neutral-800" />
          )}
        </button>

        <button
          onClick={onOpenSettings}
          title="Open Dashboard Settings (Ctrl+,)"
          aria-label="Open settings"
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium text-neutral-200 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50 cursor-pointer"
        >
          <Settings className="w-4 h-4" />
          <span className="hidden sm:inline">Settings</span>
        </button>
      </div>
    </header>
  );
};
