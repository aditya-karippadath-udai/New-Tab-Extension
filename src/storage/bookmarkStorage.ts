import { BookmarkFolderNode, BookmarkItemNode, BookmarkSortOption } from '../types/bookmark';
import { getStorageItem, setStorageItem } from './browserStorage';
import { INITIAL_BOOKMARK_TREE } from '../utils/bookmarkUtils';

export const BOOKMARKS_STORAGE_KEY = 'auratab_bookmark_tree';
export const BOOKMARKS_EXPANDED_KEY = 'auratab_bookmark_expanded';
export const BOOKMARKS_RECENT_KEY = 'auratab_bookmark_recent';
export const BOOKMARKS_SORT_KEY = 'auratab_bookmark_sort';

export async function loadStoredBookmarkTree(): Promise<BookmarkFolderNode[]> {
  const tree = await getStorageItem<BookmarkFolderNode[] | null>(BOOKMARKS_STORAGE_KEY, null);
  if (!tree || !Array.isArray(tree) || tree.length === 0) {
    await persistBookmarkTree(INITIAL_BOOKMARK_TREE);
    return INITIAL_BOOKMARK_TREE;
  }
  return tree;
}

export async function persistBookmarkTree(tree: BookmarkFolderNode[]): Promise<void> {
  await setStorageItem(BOOKMARKS_STORAGE_KEY, tree);
}

export async function loadStoredExpandedFolders(): Promise<string[]> {
  return await getStorageItem<string[]>(BOOKMARKS_EXPANDED_KEY, ['folder_dev', 'folder_ai']);
}

export async function persistStoredExpandedFolders(ids: string[]): Promise<void> {
  await setStorageItem(BOOKMARKS_EXPANDED_KEY, ids);
}

export async function loadStoredRecentBookmarks(): Promise<BookmarkItemNode[]> {
  return await getStorageItem<BookmarkItemNode[]>(BOOKMARKS_RECENT_KEY, []);
}

export async function persistStoredRecentBookmarks(items: BookmarkItemNode[]): Promise<void> {
  await setStorageItem(BOOKMARKS_RECENT_KEY, items);
}

export async function loadStoredSortOption(): Promise<BookmarkSortOption> {
  return await getStorageItem<BookmarkSortOption>(BOOKMARKS_SORT_KEY, 'manual');
}

export async function persistStoredSortOption(sort: BookmarkSortOption): Promise<void> {
  await setStorageItem(BOOKMARKS_SORT_KEY, sort);
}
