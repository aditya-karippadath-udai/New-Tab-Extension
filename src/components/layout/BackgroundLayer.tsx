import React, { useEffect, useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { resolveWallpaperSource } from '../../storage/wallpaperStorage';
import { LiveWallpaperCanvas } from '../wallpaper/LiveWallpaperCanvas';

export const BackgroundLayer: React.FC = () => {
  const { settings, effectiveTheme } = useSettings();
  const { wallpaper } = settings;
  const [resolvedSource, setResolvedSource] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    if (wallpaper.sourceType !== 'live') {
      resolveWallpaperSource(wallpaper).then((source) => {
        if (isMounted) {
          setResolvedSource(source);
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [
    wallpaper.sourceType,
    wallpaper.selectedBuiltinId,
    wallpaper.customUrl,
    wallpaper.uploadedImageId,
    wallpaper.uploadedImageData,
    wallpaper.gradient,
  ]);

  const isGradient =
    resolvedSource.startsWith('linear-gradient') ||
    resolvedSource.startsWith('radial-gradient');

  // Background style computation
  const backgroundStyle: React.CSSProperties = {
    filter: `brightness(${wallpaper.brightness}%) blur(${wallpaper.blur}px)`,
    backgroundPosition: wallpaper.backgroundPosition,
    backgroundSize: wallpaper.backgroundSize,
    transform: wallpaper.blur > 0 ? 'scale(1.05)' : 'none', // prevent blurry edges
    transition: 'filter 0.3s ease, background 0.4s ease, opacity 0.4s ease',
  };

  if (isGradient) {
    backgroundStyle.backgroundImage = resolvedSource;
  } else if (resolvedSource && wallpaper.sourceType !== 'live') {
    backgroundStyle.backgroundImage = `url("${resolvedSource}")`;
    backgroundStyle.backgroundRepeat = 'no-repeat';
  }

  // Overlay opacity calculation
  const overlayAlpha = (wallpaper.overlayOpacity ?? 35) / 100;
  const overlayBg =
    effectiveTheme === 'dark'
      ? `rgba(9, 11, 17, ${overlayAlpha})`
      : `rgba(248, 250, 252, ${overlayAlpha * 0.8})`;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden select-none pointer-events-none bg-neutral-950">
      {/* Live Wallpaper or Static Wallpaper layer */}
      {wallpaper.sourceType === 'live' ? (
        <LiveWallpaperCanvas
          config={wallpaper.liveWallpaper}
          brightness={wallpaper.brightness}
          blur={wallpaper.blur}
        />
      ) : (
        <div
          className="absolute inset-0 w-full h-full"
          style={backgroundStyle}
        />
      )}

      {/* Measured Dark / Light Scrim Overlay for WCAG AA readability */}
      <div
        className="absolute inset-0 transition-colors duration-300"
        style={{ backgroundColor: overlayBg }}
      />

      {/* Subtle vignette for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            effectiveTheme === 'dark'
              ? 'radial-gradient(ellipse at center, transparent 40%, rgba(3, 5, 8, 0.6) 100%)'
              : 'radial-gradient(ellipse at center, transparent 50%, rgba(226, 232, 240, 0.4) 100%)',
        }}
      />

      {/* Optional gentle starry drift animation */}
      {wallpaper.animatedEffect && effectiveTheme === 'dark' && (
        <div className="absolute inset-0 opacity-40 pointer-events-none animate-star-drift mix-blend-screen">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="star-pattern" width="120" height="120" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="30" r="1" fill="#ffffff" opacity="0.6" />
                <circle cx="85" cy="40" r="1.5" fill="#38bdf8" opacity="0.8" />
                <circle cx="45" cy="95" r="0.8" fill="#ffffff" opacity="0.4" />
                <circle cx="105" cy="100" r="1" fill="#c084fc" opacity="0.6" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#star-pattern)" />
          </svg>
        </div>
      )}
    </div>
  );
};
