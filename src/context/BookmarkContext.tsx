import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import {
  BookmarkFolderNode,
  BookmarkItemNode,
  BookmarkNode,
  BookmarkSortOption,
  BookmarkSearchMatch,
} from '../types/bookmark';
import { BookmarkRepository } from '../repositories/BookmarkRepository';
import { LocalBookmarkRepository } from '../repositories/LocalBookmarkRepository';
import { BrowserBookmarkRepository } from '../repositories/BrowserBookmarkRepository';
import { BookmarkService } from '../services/bookmarkService';
import {
  findNodeById,
  findParentFolder,
  getBreadcrumbPath,
  searchBookmarkTree,
  getAllBookmarksFlat,
  isFolder,
  isBookmark,
  getAllFoldersFlattened,
} from '../utils/bookmarkUtils';
import { useFavorites } from './FavoritesContext';
import { persistStoredSortOption, loadStoredSortOption } from '../storage/bookmarkStorage';

interface BookmarkDialogState {
  type: 'none' | 'add-bookmark' | 'add-folder' | 'edit-bookmark' | 'rename-folder' | 'delete-confirm' | 'import-export';
  targetNode?: BookmarkNode | null;
  targetFolderId?: string | null;
}

interface ContextMenuState {
  isOpen: boolean;
  x: number;
  y: number;
  node: BookmarkNode | null;
  folderId: string | null; // which folder context
}

interface BookmarkContextType {
  bookmarks: BookmarkFolderNode[];
  selectedFolderId: string | null;
  selectedFolder: BookmarkFolderNode | null;
  expandedFolderIds: Set<string>;
  recentBookmarks: BookmarkItemNode[];
  searchQuery: string;
  searchResults: BookmarkSearchMatch[];
  sortOption: BookmarkSortOption;
  isManagerOpen: boolean;
  breadcrumbs: { id: string; title: string }[];
  allFolders: { id: string; title: string; level: number }[];
  dialogState: BookmarkDialogState;
  contextMenu: ContextMenuState;
  stats: { totalBookmarks: number; totalFolders: number };
  isBrowserApiSupported: boolean;

  // Actions
  selectFolder: (folderId: string | null) => void;
  toggleFolderExpand: (folderId: string) => void;
  expandFolder: (folderId: string) => void;
  collapseFolder: (folderId: string) => void;
  expandAll: () => void;
  collapseAll: () => void;
  setSearchQuery: (query: string) => void;
  setSortOption: (option: BookmarkSortOption) => void;
  setIsManagerOpen: (open: boolean) => void;

  // Crud operations
  addBookmark: (data: { title: string; url: string; parentId: string | null; isFavorite?: boolean }) => void;
  updateBookmark: (id: string, updates: Partial<BookmarkItemNode>) => void;
  deleteBookmark: (id: string) => void;
  addFolder: (title: string, parentId?: string | null) => void;
  renameFolder: (id: string, newTitle: string) => void;
  deleteFolder: (id: string) => void;
  moveNode: (sourceId: string, targetFolderId: string | null, targetIndex?: number) => boolean;

  // Navigation / Execution
  openBookmark: (bookmark: BookmarkItemNode, inNewTab?: boolean) => void;
  toggleFavoriteBookmark: (bookmark: BookmarkItemNode) => void;
  clearRecentBookmarks: () => void;

  // Dialog & Menu control
  openDialog: (type: BookmarkDialogState['type'], targetNode?: BookmarkNode | null, targetFolderId?: string | null) => void;
  closeDialog: () => void;
  openContextMenu: (e: React.MouseEvent, node: BookmarkNode | null, folderId?: string | null) => void;
  closeContextMenu: () => void;

  // Import / Export
  importBookmarksJson: (json: string, mode: 'merge' | 'replace') => { success: boolean; error?: string; count?: number };
  exportBookmarksJson: () => string;
  importFromBrowserApi: () => Promise<{ success: boolean; count?: number; error?: string }>;
}

const BookmarkContext = createContext<BookmarkContextType | null>(null);

const localRepo = new LocalBookmarkRepository();
const browserRepo = new BrowserBookmarkRepository();

export const BookmarkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { syncFavoriteBookmark, isFavoriteUrl } = useFavorites();

  const [bookmarks, setBookmarks] = useState<BookmarkFolderNode[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>('folder_dev');
  const [expandedFolderIds, setExpandedFolderIds] = useState<Set<string>>(new Set(['folder_dev', 'folder_ai']));
  const [recentBookmarks, setRecentBookmarks] = useState<BookmarkItemNode[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOptionState] = useState<BookmarkSortOption>('manual');
  const [isManagerOpen, setIsManagerOpen] = useState(false);

  const [dialogState, setDialogState] = useState<BookmarkDialogState>({ type: 'none' });
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    isOpen: false,
    x: 0,
    y: 0,
    node: null,
    folderId: null,
  });

  // Load from repository on mount
  useEffect(() => {
    let isMounted = true;
    Promise.all([
      localRepo.getTree(),
      localRepo.getExpandedFolders(),
      localRepo.getRecentBookmarks(),
      loadStoredSortOption(),
    ]).then(([tree, expanded, recents, sort]) => {
      if (isMounted) {
        setBookmarks(tree);
        if (expanded && expanded.length > 0) {
          setExpandedFolderIds(new Set(expanded));
        }
        if (recents) {
          setRecentBookmarks(recents);
        }
        if (sort) {
          setSortOptionState(sort);
        }
        // If selected folder doesn't exist, pick the first
        if (tree.length > 0) {
          setSelectedFolderId(tree[0].id);
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Persist tree helper
  const persistTree = useCallback((newTree: BookmarkFolderNode[]) => {
    setBookmarks(newTree);
    localRepo.saveTree(newTree);
  }, []);

  // Persist expanded folders helper
  const persistExpanded = useCallback((newSet: Set<string>) => {
    setExpandedFolderIds(newSet);
    localRepo.saveExpandedFolders(Array.from(newSet));
  }, []);

  // Persist recents helper
  const persistRecents = useCallback((items: BookmarkItemNode[]) => {
    setRecentBookmarks(items);
    localRepo.saveRecentBookmarks(items);
  }, []);

  const setSortOption = (opt: BookmarkSortOption) => {
    setSortOptionState(opt);
    persistStoredSortOption(opt);
  };

  // Expand / collapse controls
  const toggleFolderExpand = useCallback((folderId: string) => {
    setExpandedFolderIds((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      localRepo.saveExpandedFolders(Array.from(next));
      return next;
    });
  }, []);

  const expandFolder = useCallback((folderId: string) => {
    setExpandedFolderIds((prev) => {
      if (prev.has(folderId)) return prev;
      const next = new Set(prev);
      next.add(folderId);
      localRepo.saveExpandedFolders(Array.from(next));
      return next;
    });
  }, []);

  const collapseFolder = useCallback((folderId: string) => {
    setExpandedFolderIds((prev) => {
      if (!prev.has(folderId)) return prev;
      const next = new Set(prev);
      next.delete(folderId);
      localRepo.saveExpandedFolders(Array.from(next));
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    const all = getAllFoldersFlattened(bookmarks).map((f) => f.id);
    const newSet = new Set(all);
    persistExpanded(newSet);
  }, [bookmarks, persistExpanded]);

  const collapseAll = useCallback(() => {
    persistExpanded(new Set());
  }, [persistExpanded]);

  const selectFolder = useCallback((folderId: string | null) => {
    setSelectedFolderId(folderId);
    if (folderId) {
      expandFolder(folderId);
    }
  }, [expandFolder]);

  // CRUD Actions
  const addBookmark = useCallback((data: { title: string; url: string; parentId: string | null; isFavorite?: boolean }) => {
    const targetParent = data.parentId || selectedFolderId;
    const { updatedTree, newBookmark } = BookmarkService.addBookmark(bookmarks, {
      ...data,
      parentId: targetParent,
    });
    persistTree(updatedTree);

    // Sync with favorites if marked
    if (data.isFavorite) {
      syncFavoriteBookmark(newBookmark.title, newBookmark.url, true);
    }
    if (targetParent) {
      expandFolder(targetParent);
    }
  }, [bookmarks, selectedFolderId, persistTree, syncFavoriteBookmark, expandFolder]);

  const updateBookmark = useCallback((id: string, updates: Partial<BookmarkItemNode>) => {
    const updatedTree = BookmarkService.updateBookmark(bookmarks, id, updates);
    persistTree(updatedTree);

    // If favorite changed, sync
    if (updates.isFavorite !== undefined && updates.url) {
      syncFavoriteBookmark(updates.title || '', updates.url, updates.isFavorite);
    }
  }, [bookmarks, persistTree, syncFavoriteBookmark]);

  const deleteBookmark = useCallback((id: string) => {
    const node = findNodeById(bookmarks, id);
    if (node && isBookmark(node) && node.isFavorite) {
      syncFavoriteBookmark(node.title, node.url, false);
    }
    const updatedTree = BookmarkService.deleteNode(bookmarks, id);
    persistTree(updatedTree);

    // Remove from recent if present
    setRecentBookmarks((prev) => prev.filter((b) => b.id !== id));
  }, [bookmarks, persistTree, syncFavoriteBookmark]);

  const addFolder = useCallback((title: string, parentId?: string | null) => {
    const targetParent = parentId !== undefined ? parentId : selectedFolderId;
    const { updatedTree, newFolder } = BookmarkService.addFolder(bookmarks, {
      title,
      parentId: targetParent,
    });
    persistTree(updatedTree);
    if (targetParent) {
      expandFolder(targetParent);
    }
    setSelectedFolderId(newFolder.id);
  }, [bookmarks, selectedFolderId, persistTree, expandFolder]);

  const renameFolder = useCallback((id: string, newTitle: string) => {
    const updatedTree = BookmarkService.renameFolder(bookmarks, id, newTitle);
    persistTree(updatedTree);
  }, [bookmarks, persistTree]);

  const deleteFolder = useCallback((id: string) => {
    const updatedTree = BookmarkService.deleteNode(bookmarks, id);
    persistTree(updatedTree);

    if (selectedFolderId === id) {
      setSelectedFolderId(updatedTree.length > 0 ? updatedTree[0].id : null);
    }
  }, [bookmarks, selectedFolderId, persistTree]);

  const moveNode = useCallback((sourceId: string, targetFolderId: string | null, targetIndex?: number): boolean => {
    const updatedTree = BookmarkService.moveNode(bookmarks, sourceId, targetFolderId, targetIndex);
    if (updatedTree) {
      persistTree(updatedTree);
      if (targetFolderId) {
        expandFolder(targetFolderId);
      }
      return true;
    }
    return false;
  }, [bookmarks, persistTree, expandFolder]);

  // Open bookmark and track recents
  const openBookmark = useCallback((bookmark: BookmarkItemNode, inNewTab = true) => {
    const updatedBookmark: BookmarkItemNode = {
      ...bookmark,
      lastOpenedAt: Date.now(),
      visitCount: (bookmark.visitCount || 0) + 1,
    };

    // Update in tree
    const nextTree = BookmarkService.updateBookmark(bookmarks, bookmark.id, {
      lastOpenedAt: updatedBookmark.lastOpenedAt,
      visitCount: updatedBookmark.visitCount,
    });
    persistTree(nextTree);

    // Update recents
    setRecentBookmarks((prev) => {
      const filtered = prev.filter((b) => b.id !== bookmark.id);
      const updatedList = [updatedBookmark, ...filtered].slice(0, 20);
      localRepo.saveRecentBookmarks(updatedList);
      return updatedList;
    });

    // Launch window
    const target = inNewTab ? '_blank' : '_self';
    window.open(bookmark.url, target, inNewTab ? 'noopener,noreferrer' : undefined);
  }, [bookmarks, persistTree]);

  const toggleFavoriteBookmark = useCallback((bookmark: BookmarkItemNode) => {
    const newFav = !bookmark.isFavorite;
    updateBookmark(bookmark.id, { isFavorite: newFav, url: bookmark.url, title: bookmark.title });
    syncFavoriteBookmark(bookmark.title, bookmark.url, newFav);
  }, [updateBookmark, syncFavoriteBookmark]);

  const clearRecentBookmarks = useCallback(() => {
    persistRecents([]);
  }, [persistRecents]);

  // Dialog Controls
  const openDialog = useCallback((
    type: BookmarkDialogState['type'],
    targetNode?: BookmarkNode | null,
    targetFolderId?: string | null
  ) => {
    setDialogState({
      type,
      targetNode: targetNode || null,
      targetFolderId: targetFolderId !== undefined ? targetFolderId : selectedFolderId,
    });
  }, [selectedFolderId]);

  const closeDialog = useCallback(() => {
    setDialogState({ type: 'none' });
  }, []);

  // Context Menu Controls
  const openContextMenu = useCallback((e: React.MouseEvent, node: BookmarkNode | null, folderId?: string | null) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      isOpen: true,
      x: e.clientX,
      y: e.clientY,
      node,
      folderId: folderId || selectedFolderId,
    });
  }, [selectedFolderId]);

  const closeContextMenu = useCallback(() => {
    setContextMenu((prev) => ({ ...prev, isOpen: false }));
  }, []);

  // Close context menu on outside click or scroll
  useEffect(() => {
    const handleOutside = () => {
      if (contextMenu.isOpen) closeContextMenu();
    };
    window.addEventListener('click', handleOutside);
    window.addEventListener('scroll', handleOutside, true);
    return () => {
      window.removeEventListener('click', handleOutside);
      window.removeEventListener('scroll', handleOutside, true);
    };
  }, [contextMenu.isOpen, closeContextMenu]);

  // Import / Export JSON
  const exportBookmarksJson = useCallback(() => {
    return BookmarkService.exportToJson(bookmarks);
  }, [bookmarks]);

  const importBookmarksJson = useCallback((json: string, mode: 'merge' | 'replace') => {
    const res = BookmarkService.importFromJson(bookmarks, json, mode);
    if (res.success && res.tree) {
      persistTree(res.tree);
      if (res.tree.length > 0) {
        setSelectedFolderId(res.tree[0].id);
      }
      return { success: true, count: res.count };
    }
    return { success: false, error: res.error };
  }, [bookmarks, persistTree]);

  // Native Browser API Import
  const importFromBrowserApi = useCallback(async () => {
    if (!browserRepo.isBrowserApiAvailable()) {
      return {
        success: false,
        error: 'Browser Bookmarks API is only accessible when installed as an unpacked Chrome or Firefox extension with bookmarks permission.',
      };
    }

    const imported = await browserRepo.importBrowserBookmarks();
    if (imported && imported.length > 0) {
      const mergedFolder: BookmarkFolderNode = {
        id: `folder_imported_${Date.now()}`,
        title: 'Browser Bookmarks',
        parentId: null,
        type: 'folder',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        children: imported,
      };
      const newTree = [...bookmarks, mergedFolder];
      persistTree(newTree);
      return { success: true, count: imported.length };
    }
    return { success: false, error: 'No bookmarks could be read from browser.' };
  }, [bookmarks, persistTree]);

  // Computed data
  const selectedFolder = useMemo(() => {
    if (!selectedFolderId) return null;
    const node = findNodeById(bookmarks, selectedFolderId);
    return node && isFolder(node) ? node : null;
  }, [bookmarks, selectedFolderId]);

  const breadcrumbs = useMemo(() => {
    return getBreadcrumbPath(bookmarks, selectedFolderId);
  }, [bookmarks, selectedFolderId]);

  const allFolders = useMemo(() => {
    return getAllFoldersFlattened(bookmarks);
  }, [bookmarks]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchBookmarkTree(bookmarks, searchQuery);
  }, [bookmarks, searchQuery]);

  const stats = useMemo(() => {
    const flat = getAllBookmarksFlat(bookmarks);
    const folders = getAllFoldersFlattened(bookmarks);
    return {
      totalBookmarks: flat.length,
      totalFolders: folders.length,
    };
  }, [bookmarks]);

  return (
    <BookmarkContext.Provider
      value={{
        bookmarks,
        selectedFolderId,
        selectedFolder,
        expandedFolderIds,
        recentBookmarks,
        searchQuery,
        searchResults,
        sortOption,
        isManagerOpen,
        breadcrumbs,
        allFolders,
        dialogState,
        contextMenu,
        stats,
        isBrowserApiSupported: browserRepo.isBrowserApiAvailable(),

        selectFolder,
        toggleFolderExpand,
        expandFolder,
        collapseFolder,
        expandAll,
        collapseAll,
        setSearchQuery,
        setSortOption,
        setIsManagerOpen,

        addBookmark,
        updateBookmark,
        deleteBookmark,
        addFolder,
        renameFolder,
        deleteFolder,
        moveNode,

        openBookmark,
        toggleFavoriteBookmark,
        clearRecentBookmarks,

        openDialog,
        closeDialog,
        openContextMenu,
        closeContextMenu,

        importBookmarksJson,
        exportBookmarksJson,
        importFromBrowserApi,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
};

export function useBookmarks() {
  const ctx = useContext(BookmarkContext);
  if (!ctx) {
    throw new Error('useBookmarks must be used within BookmarkProvider');
  }
  return ctx;
}
