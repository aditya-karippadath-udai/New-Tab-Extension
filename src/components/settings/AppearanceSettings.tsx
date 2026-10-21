import React, { useRef, useState } from 'react';
import {
  Palette,
  Image,
  Upload,
  Link,
  Sparkles,
  Sliders,
  Check,
  RefreshCw,
  Eye,
  User,
  Activity,
  Orbit,
  Terminal,
  Waves,
  Droplets,
  Zap,
  Video,
  Film,
  Trash2,
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { BUILTIN_WALLPAPERS } from '../../utils/builtinWallpapers';
import { ACCENT_THEMES } from '../../utils/accentThemes';
import {
  AccentColor,
  ThemeMode,
  WallpaperCategory,
  LiveWallpaperType,
  LiveWallpaperColorScheme,
} from '../../types';
import { storeUploadedWallpaper, storeUploadedLiveVideo } from '../../storage/wallpaperStorage';

const LIVE_PRESETS: {
  id: LiveWallpaperType;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
}[] = [
  {
    id: 'aurora',
    title: 'Aurora Borealis',
    description: 'Luminous undulating northern light waves',
    icon: Sparkles,
    gradient: 'from-cyan-500/30 via-emerald-500/20 to-blue-600/30',
  },
  {
    id: 'starfield',
    title: 'Hyperspace Starfield',
    description: '3D perspective cosmic warp & stellar drift',
    icon: Orbit,
    gradient: 'from-blue-600/30 via-indigo-500/20 to-purple-600/30',
  },
  {
    id: 'particles',
    title: 'Constellation Mesh',
    description: 'Interactive node particles with cursor gravity',
    icon: Activity,
    gradient: 'from-cyan-500/30 via-teal-500/20 to-sky-600/30',
  },
  {
    id: 'matrix',
    title: 'Matrix Digital Rain',
    description: 'Cyberpunk falling code cascade & glowing drops',
    icon: Terminal,
    gradient: 'from-emerald-600/30 via-green-500/20 to-cyan-700/30',
  },
  {
    id: 'waves',
    title: 'Synthwave Horizon',
    description: 'Neon retro-futuristic perspective ocean grid',
    icon: Waves,
    gradient: 'from-pink-600/30 via-purple-600/20 to-cyan-600/30',
  },
  {
    id: 'gradientMesh',
    title: 'Fluid Gradient Mesh',
    description: 'Organic morphing living lava color blobs',
    icon: Droplets,
    gradient: 'from-violet-600/30 via-fuchsia-500/20 to-cyan-500/30',
  },
];

const COLOR_SCHEMES: { id: LiveWallpaperColorScheme; label: string; dot: string }[] = [
  { id: 'cyan', label: 'Cyan & Blue', dot: 'bg-gradient-to-r from-cyan-400 to-blue-500' },
  { id: 'cyber', label: 'Cyberpunk', dot: 'bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400' },
  { id: 'violet', label: 'Violet Nebula', dot: 'bg-gradient-to-r from-purple-500 to-indigo-500' },
  { id: 'emerald', label: 'Emerald Jade', dot: 'bg-gradient-to-r from-emerald-400 to-teal-500' },
  { id: 'fire', label: 'Solar Fire', dot: 'bg-gradient-to-r from-amber-400 to-red-500' },
  { id: 'monochrome', label: 'Monochrome', dot: 'bg-gradient-to-r from-slate-200 to-slate-400' },
];

const CURATED_LIVE_VIDEOS: {
  id: string;
  title: string;
  description: string;
  url: string;
  gradient: string;
}[] = [
  {
    id: 'cyber_rain',
    title: 'Cyber City Rain',
    description: 'Moody neon metropolis with dynamic night rain',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-driving-through-a-futuristic-city-at-night-42289-large.mp4',
    gradient: 'from-blue-700/40 via-cyan-600/30 to-purple-800/40',
  },
  {
    id: 'space_flight',
    title: 'Interstellar Nebula',
    description: 'Drifting through deep cosmic gas & starlight',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-flying-through-space-stars-and-nebula-42407-large.mp4',
    gradient: 'from-purple-800/40 via-indigo-700/30 to-pink-700/40',
  },
  {
    id: 'sunset_waves',
    title: 'Coastal Twilight Waves',
    description: 'Rhythmic rolling ocean surf under purple sunset',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-waves-coming-to-the-beach-5016-large.mp4',
    gradient: 'from-amber-600/40 via-pink-600/30 to-indigo-800/40',
  },
];

const CATEGORIES: WallpaperCategory[] = [
  'Space',
  'Mountains',
  'Nature',
  'Cyberpunk',
  'Dark',
  'Abstract',
  'Minimal',
];

export const AppearanceSettings: React.FC = () => {
  const { settings, updateSettings, updateWallpaper, accentTheme } = useSettings();
  const { wallpaper } = settings;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [activeCategory, setActiveCategory] = useState<WallpaperCategory>('Space');
  const [urlInput, setUrlInput] = useState(wallpaper.customUrl || '');
  const [liveVideoUrlInput, setLiveVideoUrlInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [wallpaperMode, setWallpaperMode] = useState<'live' | 'static'>(
    wallpaper.sourceType === 'live' ? 'live' : 'static'
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { id, previewUrl } = await storeUploadedWallpaper(file);
      updateWallpaper({
        sourceType: 'upload',
        uploadedImageId: id,
        uploadedImageData: previewUrl,
      });
    } catch (err) {
      console.error('File upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingVideo(true);
    try {
      const { id, previewUrl, name } = await storeUploadedLiveVideo(file);
      updateWallpaper({
        sourceType: 'live',
        liveWallpaper: {
          type: 'video',
          videoId: id,
          videoUrl: previewUrl,
          videoName: name,
          speed: wallpaper.liveWallpaper?.speed ?? 1,
          interactive: false,
          colorScheme: wallpaper.liveWallpaper?.colorScheme ?? 'cyan',
        },
      });
    } catch (err) {
      console.error('Video upload error:', err);
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleApplyLiveVideoUrl = () => {
    const trimmed = liveVideoUrlInput.trim();
    if (!trimmed) return;

    updateWallpaper({
      sourceType: 'live',
      liveWallpaper: {
        type: 'video',
        videoUrl: trimmed,
        videoName: trimmed.split('/').pop()?.split('?')[0] || 'Custom Video URL',
        speed: wallpaper.liveWallpaper?.speed ?? 1,
        interactive: false,
        colorScheme: wallpaper.liveWallpaper?.colorScheme ?? 'cyan',
      },
    });
    setLiveVideoUrlInput('');
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) return;
    updateWallpaper({
      sourceType: 'url',
      customUrl: urlInput.trim(),
    });
  };

  const filteredWallpapers = BUILTIN_WALLPAPERS.filter(
    (w) => w.category === activeCategory
  );

  return (
    <div className="space-y-6 text-xs text-neutral-300">
      {/* 1. User Name & Header Display */}
      <section className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
        <h4 className="text-xs font-semibold text-neutral-200 uppercase tracking-wider flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-cyan-400" />
          <span>User Name & Header Display</span>
        </h4>

        <div>
          <label className="block text-xs font-medium text-neutral-300 mb-1.5">
            Your Name / Header Title
          </label>
          <input
            type="text"
            value={settings.userName || ''}
            onChange={(e) => updateSettings({ userName: e.target.value })}
            placeholder="Enter your name (e.g. Aditya)"
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-neutral-100 placeholder:text-neutral-500 outline-none focus:border-white/30 transition-all"
          />
          <p className="text-[11px] text-neutral-400 mt-1">
            Displayed in the top bar header and used for greetings.
          </p>
        </div>

        <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 cursor-pointer">
          <div>
            <div className="font-medium text-neutral-200">Show Name in Header</div>
            <div className="text-[11px] text-neutral-400">
              Display "{settings.userName?.trim() || 'Your Name'}" in place of "AuraTab"
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.showUserNameInHeader !== false}
            onChange={(e) => updateSettings({ showUserNameInHeader: e.target.checked })}
            className="w-4 h-4 rounded accent-cyan-500 cursor-pointer"
          />
        </label>
      </section>

      {/* 2. Theme Mode */}
      <section>
        <h4 className="text-xs font-semibold text-neutral-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-cyan-400" />
          <span>Interface Theme</span>
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {(['dark', 'light', 'system'] as ThemeMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => updateSettings({ theme: mode })}
              className={`py-2 px-3 rounded-xl border text-center capitalize transition-all font-medium ${
                settings.theme === mode
                  ? `${accentTheme.bgActive} border-cyan-500/50`
                  : 'bg-white/5 border-white/10 hover:bg-white/10 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </section>

      {/* 2. Accent Color */}
      <section>
        <h4 className="text-xs font-semibold text-neutral-200 uppercase tracking-wider mb-2">
          Accent Color
        </h4>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {(Object.keys(ACCENT_THEMES) as AccentColor[]).map((col) => {
            const def = ACCENT_THEMES[col];
            const isSelected = settings.accent === col;
            return (
              <button
                key={col}
                onClick={() => updateSettings({ accent: col })}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                  isSelected
                    ? 'border-white/30 bg-white/10 ring-2 ring-white/20'
                    : 'border-white/5 bg-white/5 hover:bg-white/10'
                }`}
              >
                <span className={`w-5 h-5 rounded-full ${def.dotColor} mb-1 shadow-sm flex items-center justify-center`}>
                  {isSelected && <Check className="w-3 h-3 text-neutral-950 stroke-3" />}
                </span>
                <span className="text-[10px] text-neutral-400 capitalize">{col}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Layout Density */}
      <section>
        <h4 className="text-xs font-semibold text-neutral-200 uppercase tracking-wider mb-2">
          Layout Density
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {(['compact', 'comfortable', 'spacious'] as const).map((density) => (
            <button
              key={density}
              onClick={() => updateSettings({ density })}
              className={`py-2 px-3 rounded-xl border text-center capitalize transition-all font-medium ${
                settings.density === density
                  ? `${accentTheme.bgActive}`
                  : 'bg-white/5 border-white/10 hover:bg-white/10 text-neutral-400'
              }`}
            >
              {density}
            </button>
          ))}
        </div>
      </section>

      {/* 4. Wallpaper Selection */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold text-neutral-200 uppercase tracking-wider flex items-center gap-1.5">
            <Image className="w-3.5 h-3.5 text-cyan-400" />
            <span>Wallpaper Studio</span>
          </h4>
          <span className="text-[10px] font-mono text-cyan-400">
            {wallpaper.sourceType === 'live' ? '⚡ Live Canvas Active' : '🖼️ Still Wallpaper'}
          </span>
        </div>

        {/* Mode Switcher: Live FX vs Still Wallpapers */}
        <div className="flex items-center p-1 rounded-xl bg-black/30 border border-white/10 gap-1 text-xs">
          <button
            onClick={() => {
              setWallpaperMode('live');
              if (wallpaper.sourceType !== 'live') {
                updateWallpaper({
                  sourceType: 'live',
                  liveWallpaper: wallpaper.liveWallpaper || {
                    type: 'aurora',
                    speed: 1,
                    interactive: true,
                    colorScheme: 'cyan',
                  },
                });
              }
            }}
            className={`flex-1 py-1.5 px-3 rounded-lg font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              wallpaperMode === 'live' || wallpaper.sourceType === 'live'
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30 font-semibold shadow-xs'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Live Wallpapers (Active FX)</span>
          </button>

          <button
            onClick={() => {
              setWallpaperMode('static');
              if (wallpaper.sourceType === 'live') {
                updateWallpaper({
                  sourceType: 'builtin',
                  selectedBuiltinId: wallpaper.selectedBuiltinId || 'cosmic_nebula',
                });
              }
            }}
            className={`flex-1 py-1.5 px-3 rounded-lg font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              wallpaperMode === 'static' && wallpaper.sourceType !== 'live'
                ? `${accentTheme.bgActive} text-white font-semibold shadow-xs`
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Image className="w-3.5 h-3.5" />
            <span>Still Wallpapers</span>
          </button>
        </div>

        {/* LIVE WALLPAPERS PANEL */}
        {(wallpaperMode === 'live' || wallpaper.sourceType === 'live') ? (
          <div className="space-y-4 pt-1">
            {/* 1. Custom Video Live Wallpaper Importer */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-medium text-xs text-neutral-200">
                  <Film className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Import Custom Live Wallpaper</span>
                </div>
                <span className="text-[10px] text-neutral-400">MP4, WebM, GIF, or Video URL</span>
              </div>

              {/* Active custom video banner */}
              {wallpaper.sourceType === 'live' && wallpaper.liveWallpaper?.type === 'video' && (
                <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shrink-0">
                      <Video className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-cyan-200 truncate">
                        {wallpaper.liveWallpaper.videoName || 'Custom Video Wallpaper'}
                      </div>
                      <div className="text-[10px] text-cyan-400/80">Active Playing on Background</div>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      updateWallpaper({
                        sourceType: 'live',
                        liveWallpaper: {
                          type: 'aurora',
                          speed: 1,
                          interactive: true,
                          colorScheme: 'cyan',
                        },
                      })
                    }
                    title="Switch back to Canvas Engine"
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-300 hover:bg-white/10 transition-colors cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Upload file + URL input */}
              <div className="space-y-2">
                <input
                  type="file"
                  ref={videoInputRef}
                  onChange={handleVideoUpload}
                  accept="video/mp4,video/webm,video/ogg,video/quicktime,video/x-matroska,image/gif"
                  className="hidden"
                />

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => videoInputRef.current?.click()}
                    disabled={uploadingVideo}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-neutral-200 transition-colors cursor-pointer text-xs font-medium"
                  >
                    <Upload className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{uploadingVideo ? 'Importing Video...' : 'Upload Video File (.mp4, .webm, .gif)'}</span>
                  </button>
                </div>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={liveVideoUrlInput}
                      onChange={(e) => setLiveVideoUrlInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleApplyLiveVideoUrl();
                      }}
                      placeholder="Or paste direct video/live wallpaper URL..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-neutral-200 placeholder:text-neutral-500 outline-none focus:border-white/30 font-mono"
                    />
                    <Link className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-2" />
                  </div>
                  <button
                    onClick={handleApplyLiveVideoUrl}
                    className={`px-3 py-1.5 rounded-xl font-medium text-white cursor-pointer ${accentTheme.buttonClass}`}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Curated Live Video Loops */}
            <div className="pt-1">
              <div className="text-[11px] font-medium text-neutral-400 mb-2 flex items-center justify-between">
                <span>Curated Cinematic Video Loops</span>
                <span className="text-[10px] text-neutral-500">Looping MP4</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {CURATED_LIVE_VIDEOS.map((vid) => {
                  const isSelected =
                    wallpaper.sourceType === 'live' &&
                    wallpaper.liveWallpaper?.type === 'video' &&
                    wallpaper.liveWallpaper?.videoUrl === vid.url;

                  return (
                    <button
                      key={vid.id}
                      onClick={() =>
                        updateWallpaper({
                          sourceType: 'live',
                          liveWallpaper: {
                            type: 'video',
                            videoUrl: vid.url,
                            videoName: vid.title,
                            speed: wallpaper.liveWallpaper?.speed ?? 1,
                            interactive: false,
                            colorScheme: wallpaper.liveWallpaper?.colorScheme ?? 'cyan',
                          },
                        })
                      }
                      className={`group relative p-3 rounded-xl border text-left transition-all overflow-hidden flex flex-col justify-between min-h-[90px] cursor-pointer ${
                        isSelected
                          ? 'border-cyan-400 ring-2 ring-cyan-500/40 bg-white/10 shadow-md shadow-cyan-950/40'
                          : 'border-white/10 hover:border-white/25 bg-white/5 hover:bg-white/[0.08]'
                      }`}
                    >
                      <div className={`absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-gradient-to-br ${vid.gradient} blur-xl pointer-events-none opacity-40 group-hover:opacity-70 transition-opacity`} />
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="p-1 rounded-lg bg-black/40 border border-white/10 text-cyan-400">
                            <Video className="w-3.5 h-3.5" />
                          </div>
                          {isSelected && (
                            <span className="p-0.5 rounded-full bg-cyan-500 text-black">
                              <Check className="w-2.5 h-2.5 stroke-3" />
                            </span>
                          )}
                        </div>
                        <div className="font-semibold text-xs text-neutral-200">{vid.title}</div>
                      </div>
                      <div className="text-[10px] text-neutral-400 line-clamp-1 mt-1">{vid.description}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Dynamic Canvas FX Engines */}
            <div className="pt-1">
              <div className="text-[11px] font-medium text-neutral-400 flex items-center justify-between mb-2">
                <span>Dynamic Canvas FX Engines (60 FPS)</span>
                <span className="text-[10px] text-neutral-500 font-mono">Zero CPU when hidden</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {LIVE_PRESETS.map((preset) => {
                const isSelected =
                  wallpaper.sourceType === 'live' &&
                  (wallpaper.liveWallpaper?.type === preset.id || (!wallpaper.liveWallpaper && preset.id === 'aurora'));
                const IconComp = preset.icon;

                return (
                  <button
                    key={preset.id}
                    onClick={() =>
                      updateWallpaper({
                        sourceType: 'live',
                        liveWallpaper: {
                          type: preset.id,
                          speed: wallpaper.liveWallpaper?.speed ?? 1,
                          interactive: wallpaper.liveWallpaper?.interactive ?? true,
                          colorScheme: wallpaper.liveWallpaper?.colorScheme ?? 'cyan',
                        },
                      })
                    }
                    className={`group relative p-3 rounded-xl border text-left transition-all overflow-hidden flex flex-col justify-between min-h-[96px] cursor-pointer ${
                      isSelected
                        ? 'border-cyan-400 ring-2 ring-cyan-500/40 bg-white/10 shadow-md shadow-cyan-950/40'
                        : 'border-white/10 hover:border-white/25 bg-white/5 hover:bg-white/[0.08]'
                    }`}
                  >
                    <div className={`absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-gradient-to-br ${preset.gradient} blur-xl pointer-events-none opacity-40 group-hover:opacity-70 transition-opacity`} />
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="p-1.5 rounded-lg bg-black/40 border border-white/10 text-cyan-400">
                          <IconComp className="w-3.5 h-3.5" />
                        </div>
                        {isSelected && (
                          <span className="p-0.5 rounded-full bg-cyan-500 text-black">
                            <Check className="w-2.5 h-2.5 stroke-3" />
                          </span>
                        )}
                      </div>
                      <div className="font-semibold text-xs text-neutral-200">{preset.title}</div>
                    </div>
                    <div className="text-[10px] text-neutral-400 line-clamp-1 mt-1">{preset.description}</div>
                  </button>
                );
              })}
            </div>
            </div>

            {/* Live Wallpaper Fine-Tuning Controls */}
            <div className="p-3 rounded-xl bg-black/20 border border-white/10 space-y-3 mt-2">
              {/* Speed selector */}
              <div>
                <div className="flex justify-between text-xs text-neutral-300 mb-1.5">
                  <span>Motion Speed</span>
                  <span className="font-mono text-cyan-400 text-[11px]">
                    {wallpaper.liveWallpaper?.speed === 0.5 ? '0.5x Slow' : wallpaper.liveWallpaper?.speed === 1.5 ? '1.5x Brisk' : wallpaper.liveWallpaper?.speed === 2 ? '2.0x Hyper' : '1.0x Normal'}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 text-xs">
                  {[0.5, 1, 1.5, 2].map((spd) => (
                    <button
                      key={spd}
                      onClick={() =>
                        updateWallpaper({
                          liveWallpaper: {
                            type: wallpaper.liveWallpaper?.type || 'aurora',
                            speed: spd,
                            interactive: wallpaper.liveWallpaper?.interactive ?? true,
                            colorScheme: wallpaper.liveWallpaper?.colorScheme || 'cyan',
                          },
                        })
                      }
                      className={`py-1 rounded-lg border text-center font-mono text-[11px] transition-colors cursor-pointer ${
                        (wallpaper.liveWallpaper?.speed ?? 1) === spd
                          ? `${accentTheme.bgActive} border-cyan-400 text-white font-semibold`
                          : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Palette Selector */}
              <div>
                <div className="text-xs text-neutral-300 mb-1.5">Live Color Theme</div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                  {COLOR_SCHEMES.map((scheme) => {
                    const isCur = (wallpaper.liveWallpaper?.colorScheme ?? 'cyan') === scheme.id;
                    return (
                      <button
                        key={scheme.id}
                        onClick={() =>
                          updateWallpaper({
                            liveWallpaper: {
                              type: wallpaper.liveWallpaper?.type || 'aurora',
                              speed: wallpaper.liveWallpaper?.speed ?? 1,
                              interactive: wallpaper.liveWallpaper?.interactive ?? true,
                              colorScheme: scheme.id,
                            },
                          })
                        }
                        className={`flex flex-col items-center justify-center p-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                          isCur
                            ? 'border-white/30 bg-white/10 ring-1 ring-white/30'
                            : 'border-white/5 bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <span className={`w-4 h-4 rounded-full ${scheme.dot} mb-1 shadow-xs`} />
                        <span className="text-[9px] text-neutral-300 truncate w-full">{scheme.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Interactive Cursor Checkbox */}
              <div className="flex items-center justify-between pt-1 border-t border-white/5">
                <div>
                  <div className="text-xs font-medium text-neutral-200">Interactive Cursor Reaction</div>
                  <div className="text-[10px] text-neutral-400">Mouse parallax, gravity & particle deflection</div>
                </div>
                <input
                  type="checkbox"
                  checked={wallpaper.liveWallpaper?.interactive ?? true}
                  onChange={(e) =>
                    updateWallpaper({
                      liveWallpaper: {
                        type: wallpaper.liveWallpaper?.type || 'aurora',
                        speed: wallpaper.liveWallpaper?.speed ?? 1,
                        interactive: e.target.checked,
                        colorScheme: wallpaper.liveWallpaper?.colorScheme || 'cyan',
                      },
                    })
                  }
                  className="w-4 h-4 rounded accent-cyan-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        ) : (
          /* STILL WALLPAPERS PANEL */
          <div className="space-y-3 pt-1">
            {/* Source switch: Built-in, URL, Upload */}
            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-neutral-200 transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{uploading ? 'Processing...' : 'Upload Image'}</span>
              </button>
            </div>

            {/* Custom URL Input */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="Or paste wallpaper image URL..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-neutral-200 placeholder:text-neutral-500 outline-none focus:border-white/30"
                />
                <Link className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-2" />
              </div>
              <button
                onClick={handleApplyUrl}
                className={`px-3 py-1.5 rounded-xl font-medium text-white cursor-pointer ${accentTheme.buttonClass}`}
              >
                Apply
              </button>
            </div>

            {/* Built-in Categories Filter */}
            <div className="pt-2">
              <div className="text-[11px] font-medium text-neutral-400 mb-2">Built-in Collection</div>
              <div className="flex flex-wrap gap-1 mb-3">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer ${
                      activeCategory === cat
                        ? `${accentTheme.bgActive} font-medium`
                        : 'bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Wallpapers grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                {filteredWallpapers.map((item) => {
                  const isSelected =
                    wallpaper.sourceType === 'builtin' &&
                    wallpaper.selectedBuiltinId === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() =>
                        updateWallpaper({
                          sourceType: 'builtin',
                          selectedBuiltinId: item.id,
                          gradient: item.gradient || '',
                        })
                      }
                      className={`group relative aspect-video rounded-xl overflow-hidden border transition-all text-left cursor-pointer ${
                        isSelected
                          ? 'border-cyan-400 ring-2 ring-cyan-500/50'
                          : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      {item.url ? (
                        <img
                          src={item.url}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div
                          className="w-full h-full"
                          style={{ background: item.gradient }}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1.5">
                        <span className="text-[10px] font-medium text-white truncate">
                          {item.title}
                        </span>
                      </div>
                      {isSelected && (
                        <span className="absolute top-1 right-1 p-0.5 rounded-full bg-cyan-500 text-black">
                          <Check className="w-2.5 h-2.5 stroke-3" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 5. Wallpaper Visual Controls */}
      <section className="space-y-4 pt-2 border-t border-white/10">
        <h4 className="text-xs font-semibold text-neutral-200 uppercase tracking-wider flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-cyan-400" />
          <span>Wallpaper Adjustments</span>
        </h4>

        {/* Brightness */}
        <div>
          <div className="flex justify-between text-xs text-neutral-300 mb-1">
            <span>Brightness</span>
            <span className="font-mono text-neutral-400">{wallpaper.brightness}%</span>
          </div>
          <input
            type="range"
            min="30"
            max="120"
            step="5"
            value={wallpaper.brightness}
            onChange={(e) => updateWallpaper({ brightness: Number(e.target.value) })}
            className="w-full accent-cyan-500 cursor-pointer"
          />
        </div>

        {/* Blur */}
        <div>
          <div className="flex justify-between text-xs text-neutral-300 mb-1">
            <span>Blur</span>
            <span className="font-mono text-neutral-400">{wallpaper.blur}px</span>
          </div>
          <input
            type="range"
            min="0"
            max="25"
            step="1"
            value={wallpaper.blur}
            onChange={(e) => updateWallpaper({ blur: Number(e.target.value) })}
            className="w-full accent-cyan-500 cursor-pointer"
          />
        </div>

        {/* Overlay Opacity */}
        <div>
          <div className="flex justify-between text-xs text-neutral-300 mb-1">
            <span>Dark / Light Overlay</span>
            <span className="font-mono text-neutral-400">{wallpaper.overlayOpacity}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="90"
            step="5"
            value={wallpaper.overlayOpacity}
            onChange={(e) => updateWallpaper({ overlayOpacity: Number(e.target.value) })}
            className="w-full accent-cyan-500 cursor-pointer"
          />
        </div>

        {/* Animated Effect Toggle */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <div className="font-medium text-neutral-200">Ambient Star Drift</div>
            <div className="text-[11px] text-neutral-500">
              Gentle celestial particle drift behind widgets
            </div>
          </div>
          <input
            type="checkbox"
            checked={wallpaper.animatedEffect}
            onChange={(e) => updateWallpaper({ animatedEffect: e.target.checked })}
            className="w-4 h-4 rounded accent-cyan-500 cursor-pointer"
          />
        </div>
      </section>
    </div>
  );
};
