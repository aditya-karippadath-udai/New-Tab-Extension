import { FavoriteItem } from '../types';
import { getStorageItem, setStorageItem } from './browserStorage';

const FAVORITES_KEY = 'auratab_favorites';

export const INITIAL_FAVORITES: FavoriteItem[] = [
  {
    id: 'fav-1',
    title: 'GitHub',
    url: 'https://github.com',
    order: 0,
  },
  {
    id: 'fav-2',
    title: 'Gmail',
    url: 'https://mail.google.com',
    order: 1,
  },
  {
    id: 'fav-3',
    title: 'YouTube',
    url: 'https://youtube.com',
    order: 2,
  },
  {
    id: 'fav-4',
    title: 'ChatGPT',
    url: 'https://chatgpt.com',
    order: 3,
  },
  {
    id: 'fav-5',
    title: 'LinkedIn',
    url: 'https://linkedin.com',
    order: 4,
  },
  {
    id: 'fav-6',
    title: 'Reddit',
    url: 'https://reddit.com',
    order: 5,
  },
  {
    id: 'fav-7',
    title: 'X / Twitter',
    url: 'https://x.com',
    order: 6,
  },
  {
    id: 'fav-8',
    title: 'Notion',
    url: 'https://notion.so',
    order: 7,
  },
];

export async function getFavorites(): Promise<FavoriteItem[]> {
  const favs = await getStorageItem<FavoriteItem[] | null>(FAVORITES_KEY, null);
  if (favs === null) {
    await saveFavorites(INITIAL_FAVORITES);
    return INITIAL_FAVORITES;
  }
  return favs.sort((a, b) => a.order - b.order);
}

export async function saveFavorites(favs: FavoriteItem[]): Promise<void> {
  await setStorageItem(FAVORITES_KEY, favs);
}
