import { BookmarkFolderNode, BookmarkItemNode, BookmarkNode } from '../types/bookmark';
import {
  cloneBookmarkTree,
  findNodeById,
  findParentFolder,
  generateId,
  isDescendantFolder,
  isFolder,
  isBookmark,
  sanitizeUrl,
} from '../utils/bookmarkUtils';

export interface BookmarkExportData {
  version: number;
  exportedAt: string;
  bookmarks: BookmarkFolderNode[];
}

export class BookmarkService {
  /**
   * Adds a new bookmark item into a destination folder or root
   */
  static addBookmark(
    tree: BookmarkFolderNode[],
    data: { title: string; url: string; parentId: string | null; isFavorite?: boolean }
  ): { updatedTree: BookmarkFolderNode[]; newBookmark: BookmarkItemNode } {
    const nextTree = cloneBookmarkTree(tree);
    const validUrl = sanitizeUrl(data.url);
    const newBookmark: BookmarkItemNode = {
      id: generateId('bm'),
      title: data.title.trim() || validUrl,
      url: validUrl,
      parentId: data.parentId,
      type: 'bookmark',
      isFavorite: !!data.isFavorite,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      visitCount: 0,
    };

    if (!data.parentId) {
      // Put in first folder if exists, or create a Default folder
      if (nextTree.length > 0) {
        newBookmark.parentId = nextTree[0].id;
        nextTree[0].children.push(newBookmark);
      } else {
        const rootFolder: BookmarkFolderNode = {
          id: generateId('folder'),
          title: 'Bookmarks',
          parentId: null,
          type: 'folder',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          children: [newBookmark],
        };
        newBookmark.parentId = rootFolder.id;
        nextTree.push(rootFolder);
      }
    } else {
      const targetFolder = findNodeById(nextTree, data.parentId);
      if (targetFolder && isFolder(targetFolder)) {
        targetFolder.children.push(newBookmark);
        targetFolder.updatedAt = Date.now();
      } else if (nextTree.length > 0) {
        nextTree[0].children.push(newBookmark);
      }
    }

    return { updatedTree: nextTree, newBookmark };
  }

  /**
   * Adds a new folder into parentId or root
   */
  static addFolder(
    tree: BookmarkFolderNode[],
    data: { title: string; parentId: string | null }
  ): { updatedTree: BookmarkFolderNode[]; newFolder: BookmarkFolderNode } {
    const nextTree = cloneBookmarkTree(tree);
    const newFolder: BookmarkFolderNode = {
      id: generateId('folder'),
      title: data.title.trim() || 'New Folder',
      parentId: data.parentId,
      type: 'folder',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      children: [],
    };

    if (!data.parentId) {
      nextTree.push(newFolder);
    } else {
      const targetFolder = findNodeById(nextTree, data.parentId);
      if (targetFolder && isFolder(targetFolder)) {
        targetFolder.children.push(newFolder);
        targetFolder.updatedAt = Date.now();
      } else {
        nextTree.push(newFolder);
      }
    }

    return { updatedTree: nextTree, newFolder };
  }

  /**
   * Update bookmark details
   */
  static updateBookmark(
    tree: BookmarkFolderNode[],
    id: string,
    updates: Partial<Omit<BookmarkItemNode, 'id' | 'type'>>
  ): BookmarkFolderNode[] {
    const nextTree = cloneBookmarkTree(tree);
    const node = findNodeById(nextTree, id);
    if (!node || !isBookmark(node)) return tree;

    if (updates.title !== undefined) node.title = updates.title.trim() || node.title;
    if (updates.url !== undefined) node.url = sanitizeUrl(updates.url);
    if (updates.isFavorite !== undefined) node.isFavorite = updates.isFavorite;
    if (updates.lastOpenedAt !== undefined) node.lastOpenedAt = updates.lastOpenedAt;
    if (updates.visitCount !== undefined) node.visitCount = updates.visitCount;
    node.updatedAt = Date.now();

    return nextTree;
  }

  /**
   * Rename folder
   */
  static renameFolder(
    tree: BookmarkFolderNode[],
    folderId: string,
    newTitle: string
  ): BookmarkFolderNode[] {
    const nextTree = cloneBookmarkTree(tree);
    const folder = findNodeById(nextTree, folderId);
    if (!folder || !isFolder(folder)) return tree;

    folder.title = newTitle.trim() || folder.title;
    folder.updatedAt = Date.now();
    return nextTree;
  }

  /**
   * Deletes a node (bookmark or folder) from anywhere in tree
   */
  static deleteNode(
    tree: BookmarkFolderNode[],
    nodeId: string
  ): BookmarkFolderNode[] {
    const nextTree = cloneBookmarkTree(tree);

    // Check top-level
    const topIdx = nextTree.findIndex((n) => n.id === nodeId);
    if (topIdx !== -1) {
      nextTree.splice(topIdx, 1);
      return nextTree;
    }

    // Check inside folders
    function removeRecursive(nodes: BookmarkNode[]): boolean {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].id === nodeId) {
          nodes.splice(i, 1);
          return true;
        }
        const curr = nodes[i];
        if (isFolder(curr) && curr.children.length > 0) {
          if (removeRecursive(curr.children)) return true;
        }
      }
      return false;
    }

    removeRecursive(nextTree);
    return nextTree;
  }

  /**
   * Moves a node (bookmark or folder) into another folder or changes index
   * Strictly prevents circular dependencies!
   */
  static moveNode(
    tree: BookmarkFolderNode[],
    sourceId: string,
    targetFolderId: string | null,
    targetIndex?: number
  ): BookmarkFolderNode[] | null {
    // Cannot move into itself
    if (sourceId === targetFolderId) return null;

    // Circular check if source is a folder
    if (targetFolderId && isDescendantFolder(tree, sourceId, targetFolderId)) {
      console.warn('Cannot move folder into its own subfolder (circular dependency)');
      return null;
    }

    const nextTree = cloneBookmarkTree(tree);

    // 1. Extract source node
    let extractedNode: BookmarkNode | null = null;

    const topIdx = nextTree.findIndex((n) => n.id === sourceId);
    if (topIdx !== -1) {
      extractedNode = nextTree.splice(topIdx, 1)[0];
    } else {
      function extractFromChildren(nodes: BookmarkNode[]): boolean {
        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i].id === sourceId) {
            extractedNode = nodes.splice(i, 1)[0];
            return true;
          }
          const curr = nodes[i];
          if (isFolder(curr) && curr.children.length > 0) {
            if (extractFromChildren(curr.children)) return true;
          }
        }
        return false;
      }
      extractFromChildren(nextTree);
    }

    if (!extractedNode) return null;

    // 2. Insert into target
    const nodeToInsert = extractedNode as BookmarkNode;
    nodeToInsert.parentId = targetFolderId;
    nodeToInsert.updatedAt = Date.now();

    if (!targetFolderId) {
      // Moved to root
      if (nodeToInsert.type === 'folder') {
        if (typeof targetIndex === 'number' && targetIndex >= 0) {
          nextTree.splice(targetIndex, 0, nodeToInsert as BookmarkFolderNode);
        } else {
          nextTree.push(nodeToInsert as BookmarkFolderNode);
        }
      } else {
        // Bookmarks should be in a folder or top-level default folder
        const bookmarkItem = nodeToInsert as BookmarkItemNode;
        if (nextTree.length > 0) {
          bookmarkItem.parentId = nextTree[0].id;
          nextTree[0].children.push(bookmarkItem);
        } else {
          const defaultFolder: BookmarkFolderNode = {
            id: generateId('folder'),
            title: 'Bookmarks',
            parentId: null,
            type: 'folder',
            createdAt: Date.now(),
            updatedAt: Date.now(),
            children: [bookmarkItem],
          };
          bookmarkItem.parentId = defaultFolder.id;
          nextTree.push(defaultFolder);
        }
      }
    } else {
      const targetFolder = findNodeById(nextTree, targetFolderId);
      if (targetFolder && isFolder(targetFolder)) {
        if (typeof targetIndex === 'number' && targetIndex >= 0 && targetIndex <= targetFolder.children.length) {
          targetFolder.children.splice(targetIndex, 0, nodeToInsert);
        } else {
          targetFolder.children.push(nodeToInsert);
        }
        targetFolder.updatedAt = Date.now();
      } else {
        return null;
      }
    }

    return nextTree;
  }

  /**
   * Export tree as structured JSON
   */
  static exportToJson(tree: BookmarkFolderNode[]): string {
    const data: BookmarkExportData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      bookmarks: tree,
    };
    return JSON.stringify(data, null, 2);
  }

  /**
   * Import bookmarks from JSON string with validation
   */
  static importFromJson(
    currentTree: BookmarkFolderNode[],
    jsonString: string,
    mode: 'merge' | 'replace'
  ): { success: boolean; tree?: BookmarkFolderNode[]; error?: string; count?: number } {
    try {
      const parsed = JSON.parse(jsonString);
      let incomingBookmarks: any[] = [];

      if (parsed && Array.isArray(parsed.bookmarks)) {
        incomingBookmarks = parsed.bookmarks;
      } else if (Array.isArray(parsed)) {
        incomingBookmarks = parsed;
      } else {
        return { success: false, error: 'Unrecognized bookmark file format.' };
      }

      // Basic validation and recursive sanitization
      let importedCount = 0;

      function sanitizeImportedNode(node: any, parentId: string | null): BookmarkNode | null {
        if (!node || typeof node !== 'object') return null;

        if (node.type === 'folder' || node.children) {
          const folder: BookmarkFolderNode = {
            id: generateId('folder'),
            title: String(node.title || 'Imported Folder'),
            parentId,
            type: 'folder',
            createdAt: node.createdAt || Date.now(),
            updatedAt: Date.now(),
            children: [],
          };
          if (Array.isArray(node.children)) {
            folder.children = node.children
              .map((c: any) => sanitizeImportedNode(c, folder.id))
              .filter(Boolean) as BookmarkNode[];
          }
          importedCount += 1;
          return folder;
        } else if (node.url) {
          const bm: BookmarkItemNode = {
            id: generateId('bm'),
            title: String(node.title || node.url),
            url: sanitizeUrl(node.url),
            parentId,
            type: 'bookmark',
            isFavorite: !!node.isFavorite,
            createdAt: node.createdAt || Date.now(),
            updatedAt: Date.now(),
            visitCount: node.visitCount || 0,
          };
          importedCount += 1;
          return bm;
        }
        return null;
      }

      const sanitizedFolders = incomingBookmarks
        .map((b: any) => sanitizeImportedNode(b, null))
        .filter((b): b is BookmarkFolderNode => b !== null && isFolder(b));

      if (sanitizedFolders.length === 0) {
        return { success: false, error: 'No valid bookmarks found in file.' };
      }

      if (mode === 'replace') {
        return { success: true, tree: sanitizedFolders, count: importedCount };
      } else {
        // Merge mode: append into a dedicated "Imported Bookmarks" folder or merge root folders
        const mergeFolder: BookmarkFolderNode = {
          id: generateId('folder'),
          title: `Imported (${new Date().toLocaleDateString()})`,
          parentId: null,
          type: 'folder',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          children: sanitizedFolders,
        };
        const mergedTree = [...cloneBookmarkTree(currentTree), mergeFolder];
        return { success: true, tree: mergedTree, count: importedCount };
      }
    } catch (err: any) {
      return { success: false, error: err.message || 'Invalid JSON syntax.' };
    }
  }
}
