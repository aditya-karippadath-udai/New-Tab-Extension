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
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { BUILTIN_WALLPAPERS } from '../../utils/builtinWallpapers';
import { ACCENT_THEMES } from '../../utils/accentThemes';
import { AccentColor, ThemeMode, WallpaperCategory } from '../../types';
import { storeUploadedWallpaper } from '../../storage/wallpaperStorage';

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

  const [activeCategory, setActiveCategory] = useState<WallpaperCategory>('Space');
  const [urlInput, setUrlInput] = useState(wallpaper.customUrl || '');
  const [uploading, setUploading] = useState(false);

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
      {/* 1. Theme Mode */}
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
        <h4 className="text-xs font-semibold text-neutral-200 uppercase tracking-wider flex items-center gap-1.5">
          <Image className="w-3.5 h-3.5 text-cyan-400" />
          <span>Wallpaper Studio</span>
        </h4>

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
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-neutral-200 transition-colors"
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
            className={`px-3 py-1.5 rounded-xl font-medium text-white ${accentTheme.buttonClass}`}
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
                className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${
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
                  className={`group relative aspect-video rounded-xl overflow-hidden border transition-all text-left ${
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
