import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Zap,
  Film,
  Upload,
  Link as LinkIcon,
  Play,
  Pause,
  Trash2,
  Sparkles,
  Sliders,
  Check,
  Video,
  Eye,
  Info,
  Waves,
  Cpu,
  Star,
  Activity,
  Droplets,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { LiveWallpaperType, LiveWallpaperColorScheme } from '../../types';
import {
  storeUploadedLiveVideo,
  clearUploadedWallpaper,
} from '../../storage/wallpaperStorage';
import {
  getStoredLiveWallpapers,
  StoredLiveWallpaperMeta,
} from '../../storage/indexedDbStorage';

interface LiveWallpaperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CURATED_CINEMATIC_VIDEOS = [
  {
    id: 'cyber_rain',
    title: 'Cyber City Rain',
    category: 'Cyberpunk',
    description: 'Moody neon metropolis with dynamic night rain and cinematic reflections',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-driving-through-a-futuristic-city-at-night-42289-large.mp4',
    gradient: 'from-blue-700/50 via-cyan-600/30 to-purple-800/50',
    tags: ['Rain', 'Neon', 'City', 'Night'],
  },
  {
    id: 'space_flight',
    title: 'Interstellar Nebula',
    category: 'Space',
    description: 'Deep cosmic journey drifting through glowing interstellar gas and starlight',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-flying-through-space-stars-and-nebula-42407-large.mp4',
    gradient: 'from-purple-800/50 via-indigo-700/30 to-pink-700/50',
    tags: ['Cosmos', 'Galaxy', 'Stars', '4K'],
  },
  {
    id: 'sunset_waves',
    title: 'Ocean Sunset Waves',
    category: 'Nature',
    description: 'Calming rhythmic twilight waves gently breaking under a warm violet sky',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-waves-coming-to-the-beach-5016-large.mp4',
    gradient: 'from-amber-600/50 via-pink-600/30 to-indigo-800/50',
    tags: ['Waves', 'Beach', 'Calm', 'Twilight'],
  },
  {
    id: 'matrix_stream',
    title: 'Matrix Data Stream',
    category: 'Cyberpunk',
    description: 'Futuristic hyper-fast cascading green glyph stream and encrypted cyberspace',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-with-code-31910-large.mp4',
    gradient: 'from-emerald-900/50 via-teal-800/30 to-emerald-700/50',
    tags: ['Matrix', 'Code', 'Hacker', 'Green'],
  },
  {
    id: 'cyber_tunnel',
    title: 'Neon Hyperspace Warp',
    category: 'Abstract',
    description: 'Hypnotic high-speed geometric tunnel warp with synthwave magenta lasers',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-tunnel-of-futuristic-neon-lights-42288-large.mp4',
    gradient: 'from-fuchsia-800/50 via-violet-700/30 to-cyan-700/50',
    tags: ['Synthwave', 'Hyperspace', 'Tunnel'],
  },
  {
    id: 'alpine_mist',
    title: 'Alpine Forest Mist',
    category: 'Nature',
    description: 'Slow rolling cinematic mist moving across towering evergreen mountain ridge',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4',
    gradient: 'from-emerald-800/50 via-teal-700/30 to-slate-800/50',
    tags: ['Forest', 'Peaceful', 'Mountains'],
  },
];

export const CANVAS_FX_ENGINES: {
  id: LiveWallpaperType;
  title: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
}[] = [
  {
    id: 'aurora',
    title: 'Aurora Borealis',
    description: 'Luminous northern lights wave simulation with cursor parallax',
    icon: Sparkles,
    gradient: 'from-cyan-500/30 via-emerald-500/20 to-blue-600/30',
  },
  {
    id: 'matrix',
    title: 'Digital Matrix Rain',
    description: 'Authentic cascading cyber code rain with glowing leading glyphs',
    icon: Cpu,
    gradient: 'from-emerald-600/30 via-teal-500/20 to-green-600/30',
  },
  {
    id: 'starfield',
    title: 'Deep Space Warp',
    description: 'Interactive 3D starfield with dynamic acceleration and cursor warp',
    icon: Star,
    gradient: 'from-blue-600/30 via-indigo-500/20 to-purple-600/30',
  },
  {
    id: 'particles',
    title: 'Constellation Mesh',
    description: 'Floating interconnected neural nodes with gravitational cursor pull',
    icon: Activity,
    gradient: 'from-violet-600/30 via-purple-500/20 to-pink-600/30',
  },
  {
    id: 'waves',
    title: 'Bioluminescent Waves',
    description: 'Multi-layered organic glowing wave crests and sine ripples',
    icon: Waves,
    gradient: 'from-teal-600/30 via-cyan-500/20 to-blue-600/30',
  },
  {
    id: 'gradientMesh',
    title: 'Fluid Lava Blobs',
    description: 'Organic morphing lava blobs and soothing metaball color gradients',
    icon: Droplets,
    gradient: 'from-violet-600/30 via-fuchsia-500/20 to-cyan-500/30',
  },
];

const COLOR_SCHEMES: { id: LiveWallpaperColorScheme; label: string; dot: string }[] = [
  { id: 'cyan', label: 'Cyan / Electric Blue', dot: 'bg-gradient-to-r from-cyan-400 to-blue-500' },
  { id: 'cyber', label: 'Cyberpunk Neon', dot: 'bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400' },
  { id: 'violet', label: 'Deep Violet', dot: 'bg-gradient-to-r from-purple-500 to-indigo-500' },
  { id: 'emerald', label: 'Matrix Emerald', dot: 'bg-gradient-to-r from-emerald-400 to-teal-500' },
  { id: 'fire', label: 'Solar Amber', dot: 'bg-gradient-to-r from-amber-400 to-red-500' },
  { id: 'monochrome', label: 'Obsidian Mono', dot: 'bg-gradient-to-r from-slate-200 to-slate-400' },
];

export const LiveWallpaperModal: React.FC<LiveWallpaperModalProps> = ({ isOpen, onClose }) => {
  const { settings, updateWallpaper, accentTheme } = useSettings();
  const { wallpaper } = settings;

  const [activeTab, setActiveTab] = useState<'import' | 'videos' | 'canvas' | 'controls'>('import');
  const [urlInput, setUrlInput] = useState('');
  const [customNameInput, setCustomNameInput] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importedLibrary, setImportedLibrary] = useState<StoredLiveWallpaperMeta[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load custom imported live wallpapers library
  const refreshLibrary = async () => {
    const list = await getStoredLiveWallpapers();
    setImportedLibrary(list);
  };

  useEffect(() => {
    if (isOpen) {
      refreshLibrary();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isLiveActive = wallpaper.sourceType === 'live';
  const activeType = wallpaper.liveWallpaper?.type || 'aurora';
  const activeVideoUrl = wallpaper.liveWallpaper?.videoUrl;
  const activeVideoId = wallpaper.liveWallpaper?.videoId;

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate type
    const validExtensions = /\.(mp4|webm|ogg|mov|mkv|gif)$/i;
    const isVideoOrGif = file.type.startsWith('video/') || file.type === 'image/gif' || validExtensions.test(file.name);
    if (!isVideoOrGif) {
      setImportError('Please upload a video file (.mp4, .webm, .mov, .ogg) or animated GIF.');
      return;
    }

    setIsImporting(true);
    setImportError(null);

    try {
      const displayName = customNameInput.trim() || file.name.replace(/\.[^/.]+$/, '');
      const { id, previewUrl } = await storeUploadedLiveVideo(file);

      updateWallpaper({
        sourceType: 'live',
        liveWallpaper: {
          type: 'video',
          videoId: id,
          videoUrl: previewUrl,
          videoName: displayName,
          speed: wallpaper.liveWallpaper?.speed ?? 1,
          interactive: false,
          colorScheme: wallpaper.liveWallpaper?.colorScheme ?? 'cyan',
        },
      });

      setCustomNameInput('');
      await refreshLibrary();
    } catch (err: any) {
      console.error('Video upload error:', err);
      setImportError(err.message || 'Failed to import video file.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleApplyUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;

    if (!/^https?:\/\//i.test(trimmed)) {
      setImportError('Please enter a valid URL starting with http:// or https://');
      return;
    }

    setImportError(null);
    const displayName = customNameInput.trim() || 'Online Live Wallpaper';

    updateWallpaper({
      sourceType: 'live',
      liveWallpaper: {
        type: 'video',
        videoUrl: trimmed,
        videoName: displayName,
        speed: wallpaper.liveWallpaper?.speed ?? 1,
        interactive: false,
        colorScheme: wallpaper.liveWallpaper?.colorScheme ?? 'cyan',
      },
    });

    setUrlInput('');
    setCustomNameInput('');
  };

  const handleDeleteImported = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await clearUploadedWallpaper(id);
    if (wallpaper.liveWallpaper?.videoId === id) {
      // Revert to default canvas FX
      updateWallpaper({
        sourceType: 'live',
        liveWallpaper: {
          type: 'aurora',
          speed: 1,
          interactive: true,
          colorScheme: 'cyan',
        },
      });
    }
    await refreshLibrary();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl max-h-[90vh] bg-neutral-900 border border-white/15 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-neutral-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">Live Wallpaper Studio</h2>
                {isLiveActive ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    Active Playing
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-neutral-800 text-neutral-400 border border-white/10">
                    Still Wallpaper Mode
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-400">
                Import custom looping videos, cinematic atmospheres, or 60FPS dynamic canvas engines
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isLiveActive ? (
              <button
                onClick={() =>
                  updateWallpaper({
                    sourceType: 'live',
                    liveWallpaper: wallpaper.liveWallpaper || {
                      type: 'aurora',
                      speed: 1,
                      interactive: true,
                      colorScheme: 'cyan',
                    },
                  })
                }
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-neutral-950 transition-colors cursor-pointer"
              >
                Enable Live Mode
              </button>
            ) : (
              <button
                onClick={() =>
                  updateWallpaper({
                    sourceType: 'builtin',
                    selectedBuiltinId: wallpaper.selectedBuiltinId || 'cosmic_nebula',
                  })
                }
                className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10 transition-colors cursor-pointer"
              >
                Switch to Still
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 py-2.5 border-b border-white/10 bg-black/40 text-xs font-medium overflow-x-auto">
          <button
            onClick={() => setActiveTab('import')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'import'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Upload className="w-4 h-4 text-cyan-400" />
            <span>Import My Own</span>
            {importedLibrary.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-cyan-500/30 text-cyan-200">
                {importedLibrary.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('videos')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'videos'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Film className="w-4 h-4 text-purple-400" />
            <span>Cinematic Video Loops</span>
          </button>

          <button
            onClick={() => setActiveTab('canvas')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'canvas'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>60 FPS Canvas Engines</span>
          </button>

          <button
            onClick={() => setActiveTab('controls')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'controls'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sliders className="w-4 h-4 text-emerald-400" />
            <span>Speed & Visual Tuning</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: IMPORT MY OWN LIVE WALLPAPER */}
          {activeTab === 'import' && (
            <div className="space-y-6">
              {/* Active Playing Banner if custom video */}
              {isLiveActive && wallpaper.liveWallpaper?.type === 'video' && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/60 to-blue-950/40 border border-cyan-500/40 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shrink-0">
                      <Play className="w-5 h-5 fill-cyan-400 text-cyan-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-white truncate">
                        {wallpaper.liveWallpaper.videoName || 'Custom Live Wallpaper'}
                      </div>
                      <div className="text-xs text-cyan-300/90 flex items-center gap-2">
                        <span>Currently active on your New Tab</span>
                        <span>•</span>
                        <span>Speed: {wallpaper.liveWallpaper.speed || 1}x</span>
                      </div>
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
                    className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white/10 hover:bg-rose-500/20 hover:text-rose-300 border border-white/10 hover:border-rose-500/30 transition-colors shrink-0"
                  >
                    Reset to Canvas
                  </button>
                </div>
              )}

              {/* Upload Drop Zone */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Upload className="w-4 h-4 text-cyan-400" />
                    <span>Upload Local Video / Live Wallpaper File</span>
                  </h3>
                  <span className="text-xs text-neutral-400 font-mono">
                    Supported: .mp4, .webm, .ogg, .mov, .gif
                  </span>
                </div>

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragActive(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                    dragActive
                      ? 'border-cyan-400 bg-cyan-500/10 scale-[1.01]'
                      : 'border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/[0.08]'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                    accept="video/mp4,video/webm,video/ogg,video/quicktime,video/x-matroska,image/gif"
                    className="hidden"
                  />

                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3">
                    <Video className="w-6 h-6" />
                  </div>

                  <div className="text-sm font-semibold text-white mb-1">
                    {isImporting ? 'Processing and saving live video...' : 'Click to select or drag and drop your live video'}
                  </div>
                  <p className="text-xs text-neutral-400 max-w-md">
                    Seamless loops, anime live wallpapers, gaming moments, or cinematic nature clips. Automatically cached safely in browser storage.
                  </p>
                </div>
              </div>

              {/* Paste URL Option */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="text-xs font-semibold text-white flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-cyan-400" />
                  <span>Or Import from Direct Live Video URL</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={customNameInput}
                    onChange={(e) => setCustomNameInput(e.target.value)}
                    placeholder="Optional title (e.g. Neon City Loop)"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-neutral-500 outline-none focus:border-cyan-500/50"
                  />

                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleApplyUrl();
                    }}
                    placeholder="Paste direct .mp4 or .webm URL..."
                    className="sm:col-span-2 w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-neutral-500 outline-none focus:border-cyan-500/50 font-mono"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleApplyUrl}
                    disabled={!urlInput.trim()}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer ${accentTheme.buttonClass} disabled:opacity-50`}
                  >
                    Apply Live Video URL
                  </button>
                </div>
              </div>

              {importError && (
                <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-xs text-rose-300">
                  {importError}
                </div>
              )}

              {/* My Imported Live Wallpapers Library */}
              {importedLibrary.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                      My Imported Live Wallpapers Library ({importedLibrary.length})
                    </h4>
                    <span className="text-[10px] text-neutral-500">Stored safely in browser IndexedDB</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {importedLibrary.map((item) => {
                      const isCurrent = activeVideoId === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            updateWallpaper({
                              sourceType: 'live',
                              liveWallpaper: {
                                type: 'video',
                                videoId: item.id,
                                videoName: item.name,
                                speed: wallpaper.liveWallpaper?.speed ?? 1,
                                interactive: false,
                                colorScheme: wallpaper.liveWallpaper?.colorScheme ?? 'cyan',
                              },
                            });
                          }}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                            isCurrent
                              ? 'border-cyan-400 bg-cyan-950/40 ring-2 ring-cyan-500/30'
                              : 'border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shrink-0">
                              <Video className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-white truncate">{item.name}</div>
                              <div className="text-[10px] text-neutral-400">
                                {new Date(item.createdAt).toLocaleDateString()} • {(item.size / (1024 * 1024)).toFixed(1)} MB
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {isCurrent && (
                              <span className="p-1 rounded-full bg-cyan-500 text-black">
                                <Check className="w-3 h-3 stroke-3" />
                              </span>
                            )}
                            <button
                              onClick={(e) => handleDeleteImported(e, item.id)}
                              title="Delete from library"
                              className="p-1.5 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-white/10 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CURATED CINEMATIC VIDEO LOOPS */}
          {activeTab === 'videos' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">Curated Cinematic Loops</h3>
                  <p className="text-xs text-neutral-400">
                    High definition, seamless video loops optimized for background productivity
                  </p>
                </div>
                <span className="text-xs text-neutral-500 font-mono">Looping MP4</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {CURATED_CINEMATIC_VIDEOS.map((vid) => {
                  const isCurrent =
                    isLiveActive &&
                    wallpaper.liveWallpaper?.type === 'video' &&
                    wallpaper.liveWallpaper?.videoUrl === vid.url;

                  return (
                    <div
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
                      className={`group relative p-4 rounded-2xl border text-left transition-all overflow-hidden flex flex-col justify-between min-h-[140px] cursor-pointer ${
                        isCurrent
                          ? 'border-cyan-400 ring-2 ring-cyan-500/40 bg-white/15 shadow-xl shadow-cyan-950/50'
                          : 'border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      {/* Ambient background glow */}
                      <div className={`absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-gradient-to-br ${vid.gradient} blur-2xl pointer-events-none opacity-50 group-hover:opacity-80 transition-opacity`} />

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-black/50 text-cyan-300 border border-white/10">
                            {vid.category}
                          </span>
                          {isCurrent ? (
                            <span className="p-1 rounded-full bg-cyan-500 text-black">
                              <Check className="w-3 h-3 stroke-3" />
                            </span>
                          ) : (
                            <div className="p-1 rounded-lg bg-black/40 text-neutral-400 group-hover:text-white transition-colors">
                              <Play className="w-3 h-3 fill-current" />
                            </div>
                          )}
                        </div>

                        <div className="font-bold text-sm text-white mb-1">{vid.title}</div>
                        <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed">
                          {vid.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-1 mt-3">
                        {vid.tags.map((tag) => (
                          <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-neutral-300">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: 60 FPS DYNAMIC CANVAS ENGINES */}
          {activeTab === 'canvas' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">Dynamic 60FPS Canvas Engines</h3>
                  <p className="text-xs text-neutral-400">
                    Pure procedural animation that responds dynamically to mouse movement with zero video streaming
                  </p>
                </div>
                <span className="text-xs text-emerald-400 font-mono">0% CPU in background tabs</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {CANVAS_FX_ENGINES.map((eng) => {
                  const isCurrent =
                    isLiveActive &&
                    (wallpaper.liveWallpaper?.type === eng.id ||
                      (!wallpaper.liveWallpaper?.type && eng.id === 'aurora'));
                  const IconComponent = eng.icon;

                  return (
                    <div
                      key={eng.id}
                      onClick={() =>
                        updateWallpaper({
                          sourceType: 'live',
                          liveWallpaper: {
                            type: eng.id,
                            speed: wallpaper.liveWallpaper?.speed ?? 1,
                            interactive: wallpaper.liveWallpaper?.interactive ?? true,
                            colorScheme: wallpaper.liveWallpaper?.colorScheme ?? 'cyan',
                          },
                        })
                      }
                      className={`group relative p-4 rounded-2xl border text-left transition-all overflow-hidden flex flex-col justify-between min-h-[140px] cursor-pointer ${
                        isCurrent
                          ? 'border-cyan-400 ring-2 ring-cyan-500/40 bg-white/15 shadow-xl shadow-cyan-950/50'
                          : 'border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className={`absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-gradient-to-br ${eng.gradient} blur-2xl pointer-events-none opacity-50 group-hover:opacity-80 transition-opacity`} />

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="p-2 rounded-xl bg-black/40 border border-white/10 text-cyan-400">
                            <IconComponent className="w-4 h-4" />
                          </div>
                          {isCurrent && (
                            <span className="p-1 rounded-full bg-cyan-500 text-black">
                              <Check className="w-3 h-3 stroke-3" />
                            </span>
                          )}
                        </div>

                        <div className="font-bold text-sm text-white mb-1">{eng.title}</div>
                        <p className="text-xs text-neutral-300 leading-relaxed">
                          {eng.description}
                        </p>
                      </div>

                      <div className="mt-3 flex items-center justify-between text-[11px] text-cyan-400/80">
                        <span>Interactive cursor reaction</span>
                        <span className="font-mono">60 FPS</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: VISUAL & SPEED FINE-TUNING */}
          {activeTab === 'controls' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">Live Wallpaper Fine Tuning</h3>
                  <p className="text-xs text-neutral-400">
                    Adjust animation speed, color palette, cursor reaction, and readability overlay
                  </p>
                </div>
              </div>

              {/* Speed Controller */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
                <div className="flex justify-between text-xs text-neutral-300">
                  <span className="font-semibold text-white">Motion Speed Multiplier</span>
                  <span className="font-mono text-cyan-400 font-bold">
                    {wallpaper.liveWallpaper?.speed || 1}x Speed
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
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
                            videoUrl: wallpaper.liveWallpaper?.videoUrl,
                            videoId: wallpaper.liveWallpaper?.videoId,
                            videoName: wallpaper.liveWallpaper?.videoName,
                          },
                        })
                      }
                      className={`py-2 rounded-xl border text-center font-mono text-xs transition-colors cursor-pointer ${
                        (wallpaper.liveWallpaper?.speed ?? 1) === spd
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                          : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {spd}x {spd === 0.5 ? 'Slow' : spd === 1 ? 'Normal' : spd === 1.5 ? 'Fast' : 'Hyper'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Palette for Canvas Engines */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
                <div className="text-xs font-semibold text-white">Canvas Engine Color Scheme</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
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
                              videoUrl: wallpaper.liveWallpaper?.videoUrl,
                              videoId: wallpaper.liveWallpaper?.videoId,
                              videoName: wallpaper.liveWallpaper?.videoName,
                            },
                          })
                        }
                        className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          isCur
                            ? 'border-cyan-400 bg-cyan-950/40 ring-2 ring-cyan-500/30'
                            : 'border-white/5 bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <span className={`w-6 h-6 rounded-full ${scheme.dot} mb-1.5 shadow-sm`} />
                        <span className="text-[10px] text-neutral-200 font-medium">{scheme.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Brightness, Blur & Overlay */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex justify-between text-xs text-neutral-300">
                    <span>Brightness</span>
                    <span className="font-mono text-cyan-400">{wallpaper.brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="140"
                    value={wallpaper.brightness}
                    onChange={(e) => updateWallpaper({ brightness: Number(e.target.value) })}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex justify-between text-xs text-neutral-300">
                    <span>Background Blur</span>
                    <span className="font-mono text-cyan-400">{wallpaper.blur}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={wallpaper.blur}
                    onChange={(e) => updateWallpaper({ blur: Number(e.target.value) })}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex justify-between text-xs text-neutral-300">
                    <span>Readability Scrim Tint</span>
                    <span className="font-mono text-cyan-400">{wallpaper.overlayOpacity}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="80"
                    value={wallpaper.overlayOpacity}
                    onChange={(e) => updateWallpaper({ overlayOpacity: Number(e.target.value) })}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Interactive Cursor Checkbox */}
              <label className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 cursor-pointer">
                <div>
                  <div className="text-xs font-semibold text-white">Interactive Cursor Reaction</div>
                  <div className="text-[11px] text-neutral-400">
                    Mouse movements cause gentle wave ripples, particle deflection, and star warp
                  </div>
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
                        videoUrl: wallpaper.liveWallpaper?.videoUrl,
                        videoId: wallpaper.liveWallpaper?.videoId,
                        videoName: wallpaper.liveWallpaper?.videoName,
                      },
                    })
                  }
                  className="w-5 h-5 rounded accent-cyan-500 cursor-pointer"
                />
              </label>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-white/10 bg-black/40 text-xs">
          <div className="text-neutral-400 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            <span>Changes apply live immediately to your background</span>
          </div>

          <button
            onClick={onClose}
            className={`px-5 py-2 rounded-xl font-bold text-white transition-all cursor-pointer ${accentTheme.buttonClass}`}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
