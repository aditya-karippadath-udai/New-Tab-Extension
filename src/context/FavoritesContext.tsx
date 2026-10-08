import React, { createContext, useContext, useEffect, useState } from 'react';
import { FavoriteItem } from '../types';
import { getFavorites, saveFavorites } from '../storage/favoriteStorage';

interface FavoritesContextType {
  favorites: FavoriteItem[];
  addFavorite: (title: string, url: string, customIcon?: string) => void;
  updateFavorite: (id: string, updates: Partial<FavoriteItem>) => void;
  deleteFavorite: (id: string) => void;
  moveFavorite: (id: string, direction: 'left' | 'right') => void;
  openFavorite: (url: string, forceNewTab?: boolean) => void;
  syncFavoriteBookmark: (title: string, url: string, isFav: boolean) => void;
  isFavoriteUrl: (url: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    let isMounted = true;
    getFavorites().then((loaded) => {
      if (isMounted) setFavorites(loaded);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const persist = (next: FavoriteItem[]) => {
    setFavorites(next);
    saveFavorites(next);
  };

  const addFavorite = (title: string, rawUrl: string, customIcon?: string) => {
    const formattedUrl = rawUrl.startsWith('http://') || rawUrl.startsWith('https://')
      ? rawUrl
      : `https://${rawUrl}`;

    const newFav: FavoriteItem = {
      id: `fav_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: title.trim() || 'New Link',
      url: formattedUrl,
      customIcon,
      order: favorites.length,
    };
    persist([...favorites, newFav]);
  };

  const updateFavorite = (id: string, updates: Partial<FavoriteItem>) => {
    if (updates.url && !updates.url.startsWith('http://') && !updates.url.startsWith('https://')) {
      updates.url = `https://${updates.url}`;
    }
    const next = favorites.map((f) => (f.id === id ? { ...f, ...updates } : f));
    persist(next);
  };

  const deleteFavorite = (id: string) => {
    const next = favorites.filter((f) => f.id !== id).map((f, idx) => ({ ...f, order: idx }));
    persist(next);
  };

  const moveFavorite = (id: string, direction: 'left' | 'right') => {
    const index = favorites.findIndex((f) => f.id === id);
    if (index === -1) return;
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= favorites.length) return;

    const copy = [...favorites];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;

    const updated = copy.map((f, idx) => ({ ...f, order: idx }));
    persist(updated);
  };

  const openFavorite = (url: string, forceNewTab?: boolean) => {
    const target = forceNewTab ? '_blank' : '_self';
    window.open(url, target, forceNewTab ? 'noopener,noreferrer' : undefined);
  };

  const isFavoriteUrl = (url: string): boolean => {
    const normalized = url.replace(/\/+$/, '').toLowerCase();
    return favorites.some(
      (f) => f.url.replace(/\/+$/, '').toLowerCase() === normalized
    );
  };

  const syncFavoriteBookmark = (title: string, url: string, isFav: boolean) => {
    const normalized = url.replace(/\/+$/, '').toLowerCase();
    const existing = favorites.find(
      (f) => f.url.replace(/\/+$/, '').toLowerCase() === normalized
    );

    if (isFav && !existing) {
      addFavorite(title, url);
    } else if (!isFav && existing) {
      deleteFavorite(existing.id);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        updateFavorite,
        deleteFavorite,
        moveFavorite,
        openFavorite,
        syncFavoriteBookmark,
        isFavoriteUrl,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return ctx;
}
