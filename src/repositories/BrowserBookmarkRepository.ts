import { BookmarkRepository } from './BookmarkRepository';
import { BookmarkFolderNode, BookmarkItemNode, BookmarkNode } from '../types/bookmark';
import { generateId } from '../utils/bookmarkUtils';
import { LocalBookmarkRepository } from './LocalBookmarkRepository';

declare const chrome: any;
declare const browser: any;

export class BrowserBookmarkRepository implements BookmarkRepository {
  private localFallback = new LocalBookmarkRepository();

  isBrowserApiAvailable(): boolean {
    if (typeof browser !== 'undefined' && browser?.bookmarks?.getTree) {
      return true;
    }
    if (typeof chrome !== 'undefined' && chrome?.bookmarks?.getTree) {
      return true;
    }
    return false;
  }

  async getTree(): Promise<BookmarkFolderNode[]> {
    return this.localFallback.getTree();
  }

  async saveTree(tree: BookmarkFolderNode[]): Promise<void> {
    return this.localFallback.saveTree(tree);
  }

  async getExpandedFolders(): Promise<string[]> {
    return this.localFallback.getExpandedFolders();
  }

  async saveExpandedFolders(ids: string[]): Promise<void> {
    return this.localFallback.saveExpandedFolders(ids);
  }

  async getRecentBookmarks(): Promise<BookmarkItemNode[]> {
    return this.localFallback.getRecentBookmarks();
  }

  async saveRecentBookmarks(items: BookmarkItemNode[]): Promise<void> {
    return this.localFallback.saveRecentBookmarks(items);
  }

  async importBrowserBookmarks(): Promise<BookmarkFolderNode[] | null> {
    if (!this.isBrowserApiAvailable()) return null;

    try {
      let rawTree: any[] = [];
      if (typeof browser !== 'undefined' && browser?.bookmarks?.getTree) {
        rawTree = await browser.bookmarks.getTree();
      } else if (typeof chrome !== 'undefined' && chrome?.bookmarks?.getTree) {
        rawTree = await new Promise((resolve) => {
          chrome.bookmarks.getTree((res: any) => resolve(res || []));
        });
      }

      if (!rawTree || rawTree.length === 0) return null;

      function convertNode(raw: any, parentId: string | null): BookmarkNode | null {
        if (raw.url) {
          // It's a bookmark
          const bm: BookmarkItemNode = {
            id: generateId('bm'),
            title: raw.title || 'Untitled Bookmark',
            url: raw.url,
            parentId,
            type: 'bookmark',
            createdAt: raw.dateAdded || Date.now(),
            updatedAt: raw.dateAdded || Date.now(),
          };
          return bm;
        } else if (raw.children) {
          // It's a folder
          const folder: BookmarkFolderNode = {
            id: generateId('folder'),
            title: raw.title || 'Imported Folder',
            parentId,
            type: 'folder',
            createdAt: raw.dateAdded || Date.now(),
            updatedAt: Date.now(),
            children: [],
          };
          folder.children = raw.children
            .map((child: any) => convertNode(child, folder.id))
            .filter(Boolean) as BookmarkNode[];
          return folder;
        }
        return null;
      }

      const importedFolders: BookmarkFolderNode[] = [];
      for (const root of rawTree) {
        if (root.children) {
          for (const sub of root.children) {
            const converted = convertNode(sub, null);
            if (converted && converted.type === 'folder') {
              importedFolders.push(converted);
            }
          }
        }
      }

      return importedFolders.length > 0 ? importedFolders : null;
    } catch (err) {
      console.warn('Could not read browser bookmarks:', err);
      return null;
    }
  }
}
