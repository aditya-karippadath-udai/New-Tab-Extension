/**
 * IndexedDB helper for storing custom uploaded wallpaper image & video blobs/dataUrls.
 * Prevents exceeding extension storage quota limits.
 */

const DB_NAME = 'AuraTab_Media_DB';
const DB_VERSION = 2;
const STORE_NAME = 'wallpapers';
const META_STORE = 'live_wallpaper_meta';

export interface StoredLiveWallpaperMeta {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  createdAt: number;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported in this environment'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result as IDBDatabase;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
      if (!db.objectStoreNames.contains(META_STORE)) {
        db.createObjectStore(META_STORE, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveWallpaperBlob(id: string, data: Blob | string, meta?: Partial<StoredLiveWallpaperMeta>): Promise<void> {
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME, META_STORE], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      store.put(data, id);

      if (meta) {
        const metaStore = transaction.objectStore(META_STORE);
        metaStore.put({
          id,
          name: meta.name || 'Custom Live Wallpaper',
          size: meta.size || (typeof data !== 'string' ? data.size : data.length),
          mimeType: meta.mimeType || (typeof data !== 'string' ? data.type : 'video/mp4'),
          createdAt: meta.createdAt || Date.now(),
        });
      }

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (err) {
    console.warn('Error saving wallpaper to IndexedDB:', err);
  }
}

// Keep active ObjectURL cache to prevent memory leaks while enabling instant playback
const objectUrlCache = new Map<string, string>();

export async function getWallpaperBlob(id: string): Promise<string | null> {
  if (objectUrlCache.has(id)) {
    return objectUrlCache.get(id)!;
  }

  try {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const req = store.get(id);

      req.onsuccess = () => {
        const result = req.result;
        if (!result) {
          resolve(null);
          return;
        }

        if (result instanceof Blob) {
          const url = URL.createObjectURL(result);
          objectUrlCache.set(id, url);
          resolve(url);
        } else if (typeof result === 'string') {
          resolve(result);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Error reading wallpaper from IndexedDB:', err);
    return null;
  }
}

export async function getStoredLiveWallpapers(): Promise<StoredLiveWallpaperMeta[]> {
  try {
    const db = await openDb();
    return new Promise((resolve) => {
      const transaction = db.transaction(META_STORE, 'readonly');
      const store = transaction.objectStore(META_STORE);
      const req = store.getAll();

      req.onsuccess = () => {
        const list = (req.result as StoredLiveWallpaperMeta[]) || [];
        resolve(list.sort((a, b) => b.createdAt - a.createdAt));
      };
      req.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
}

export async function deleteWallpaperBlob(id: string): Promise<void> {
  if (objectUrlCache.has(id)) {
    try {
      URL.revokeObjectURL(objectUrlCache.get(id)!);
    } catch {}
    objectUrlCache.delete(id);
  }

  try {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME, META_STORE], 'readwrite');
      transaction.objectStore(STORE_NAME).delete(id);
      transaction.objectStore(META_STORE).delete(id);

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (err) {
    console.warn('Error deleting wallpaper from IndexedDB:', err);
  }
}
