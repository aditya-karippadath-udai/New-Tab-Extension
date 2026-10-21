import { LiveWallpaperConfig, WallpaperConfig } from '../types';
import { BUILTIN_WALLPAPERS } from '../utils/builtinWallpapers';
import { getWallpaperBlob, saveWallpaperBlob, deleteWallpaperBlob } from './indexedDbStorage';

export async function resolveLiveVideoSource(liveWallpaper?: LiveWallpaperConfig): Promise<string> {
  if (!liveWallpaper || liveWallpaper.type !== 'video') return '';
  if (liveWallpaper.videoId) {
    const blobData = await getWallpaperBlob(liveWallpaper.videoId);
    if (blobData) return blobData;
  }
  return liveWallpaper.videoUrl || '';
}

export async function resolveWallpaperSource(wallpaper: WallpaperConfig): Promise<string> {
  if (wallpaper.sourceType === 'live') {
    return '';
  }

  if (wallpaper.sourceType === 'builtin') {
    const found = BUILTIN_WALLPAPERS.find(w => w.id === wallpaper.selectedBuiltinId);
    if (found) {
      return found.url || found.gradient || '';
    }
    return BUILTIN_WALLPAPERS[0].url;
  }

  if (wallpaper.sourceType === 'url') {
    return wallpaper.customUrl || BUILTIN_WALLPAPERS[0].url;
  }

  if (wallpaper.sourceType === 'gradient') {
    return wallpaper.gradient || BUILTIN_WALLPAPERS[4].gradient || '';
  }

  if (wallpaper.sourceType === 'upload') {
    if (wallpaper.uploadedImageId) {
      const blobData = await getWallpaperBlob(wallpaper.uploadedImageId);
      if (blobData) return blobData;
    }
    if (wallpaper.uploadedImageData) {
      return wallpaper.uploadedImageData;
    }
    return BUILTIN_WALLPAPERS[0].url;
  }

  return BUILTIN_WALLPAPERS[0].url;
}

export async function storeUploadedWallpaper(file: File): Promise<{ id: string; previewUrl: string }> {
  const id = `upload_${Date.now()}`;
  try {
    await saveWallpaperBlob(id, file, {
      name: file.name,
      size: file.size,
      mimeType: file.type,
      createdAt: Date.now(),
    });
    const previewUrl = URL.createObjectURL(file);
    return { id, previewUrl };
  } catch (err) {
    console.error('Failed to store upload in IndexedDB:', err);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve({ id, previewUrl: reader.result as string });
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }
}

export async function storeUploadedLiveVideo(file: File): Promise<{ id: string; previewUrl: string; name: string }> {
  const id = `live_vid_${Date.now()}`;
  await saveWallpaperBlob(id, file, {
    name: file.name,
    size: file.size,
    mimeType: file.type,
    createdAt: Date.now(),
  });
  const previewUrl = URL.createObjectURL(file);
  return { id, previewUrl, name: file.name };
}

export async function clearUploadedWallpaper(id: string): Promise<void> {
  await deleteWallpaperBlob(id);
}

