import { BookmarkFolderNode, BookmarkItemNode, BookmarkNode } from '../types/bookmark';

export interface BookmarkRepository {
  getTree(): Promise<BookmarkFolderNode[]>;
  saveTree(tree: BookmarkFolderNode[]): Promise<void>;
  
  getExpandedFolders(): Promise<string[]>;
  saveExpandedFolders(ids: string[]): Promise<void>;

  getRecentBookmarks(): Promise<BookmarkItemNode[]>;
  saveRecentBookmarks(items: BookmarkItemNode[]): Promise<void>;

  isBrowserApiAvailable(): boolean;
  importBrowserBookmarks?(): Promise<BookmarkFolderNode[] | null>;
}
