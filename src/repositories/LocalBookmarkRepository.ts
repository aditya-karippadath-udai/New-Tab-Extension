import { BookmarkRepository } from './BookmarkRepository';
import { BookmarkFolderNode, BookmarkItemNode } from '../types/bookmark';
import {
  loadStoredBookmarkTree,
  persistBookmarkTree,
  loadStoredExpandedFolders,
  persistStoredExpandedFolders,
  loadStoredRecentBookmarks,
  persistStoredRecentBookmarks,
} from '../storage/bookmarkStorage';

export class LocalBookmarkRepository implements BookmarkRepository {
  async getTree(): Promise<BookmarkFolderNode[]> {
    return await loadStoredBookmarkTree();
  }

  async saveTree(tree: BookmarkFolderNode[]): Promise<void> {
    await persistBookmarkTree(tree);
  }

  async getExpandedFolders(): Promise<string[]> {
    return await loadStoredExpandedFolders();
  }

  async saveExpandedFolders(ids: string[]): Promise<void> {
    await persistStoredExpandedFolders(ids);
  }

  async getRecentBookmarks(): Promise<BookmarkItemNode[]> {
    return await loadStoredRecentBookmarks();
  }

  async saveRecentBookmarks(items: BookmarkItemNode[]): Promise<void> {
    await persistStoredRecentBookmarks(items);
  }

  isBrowserApiAvailable(): boolean {
    return false;
  }
}
