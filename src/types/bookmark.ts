export type BookmarkNodeType = 'folder' | 'bookmark';

export interface BaseBookmarkNode {
  id: string;
  title: string;
  parentId: string | null;
  type: BookmarkNodeType;
  createdAt: number;
  updatedAt: number;
  order?: number;
}

export interface BookmarkFolderNode extends BaseBookmarkNode {
  type: 'folder';
  children: BookmarkNode[];
  isExpanded?: boolean;
}

export interface BookmarkItemNode extends BaseBookmarkNode {
  type: 'bookmark';
  url: string;
  favicon?: string;
  isFavorite?: boolean;
  lastOpenedAt?: number;
  visitCount?: number;
}

export type BookmarkNode = BookmarkFolderNode | BookmarkItemNode;

export type BookmarkSortOption = 'manual' | 'name-asc' | 'name-desc' | 'date-newest' | 'date-oldest' | 'last-opened';

export interface BookmarkSearchMatch {
  node: BookmarkNode;
  breadcrumbs: { id: string; title: string }[];
}

export interface BookmarkTreeCounts {
  bookmarksCount: number;
  foldersCount: number;
}

export type BookmarkWidgetDisplayMode = 'tree' | 'favorites' | 'recent' | 'selectedFolder';

export interface BookmarkWidgetConfig {
  displayMode: BookmarkWidgetDisplayMode;
  maxItems: number;
  selectedFolderId?: string;
}
