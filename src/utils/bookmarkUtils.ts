import { BookmarkNode, BookmarkFolderNode, BookmarkItemNode, BookmarkSearchMatch, BookmarkSortOption } from '../types/bookmark';

export function isFolder(node: BookmarkNode): node is BookmarkFolderNode {
  return node.type === 'folder';
}

export function isBookmark(node: BookmarkNode): node is BookmarkItemNode {
  return node.type === 'bookmark';
}

export function generateId(prefix: 'folder' | 'bm' = 'bm'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

export const INITIAL_BOOKMARK_TREE: BookmarkFolderNode[] = [
  {
    id: 'folder_dev',
    title: 'Development',
    parentId: null,
    type: 'folder',
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now() - 86400000 * 30,
    children: [
      {
        id: 'bm_github',
        title: 'GitHub',
        url: 'https://github.com',
        parentId: 'folder_dev',
        type: 'bookmark',
        isFavorite: true,
        createdAt: Date.now() - 86400000 * 25,
        updatedAt: Date.now() - 86400000 * 25,
        visitCount: 42,
      },
      {
        id: 'bm_stackoverflow',
        title: 'Stack Overflow',
        url: 'https://stackoverflow.com',
        parentId: 'folder_dev',
        type: 'bookmark',
        isFavorite: false,
        createdAt: Date.now() - 86400000 * 20,
        updatedAt: Date.now() - 86400000 * 20,
        visitCount: 19,
      },
      {
        id: 'bm_mdn',
        title: 'MDN Web Docs',
        url: 'https://developer.mozilla.org',
        parentId: 'folder_dev',
        type: 'bookmark',
        isFavorite: false,
        createdAt: Date.now() - 86400000 * 18,
        updatedAt: Date.now() - 86400000 * 18,
        visitCount: 15,
      },
      {
        id: 'folder_react',
        title: 'React',
        parentId: 'folder_dev',
        type: 'folder',
        createdAt: Date.now() - 86400000 * 15,
        updatedAt: Date.now() - 86400000 * 15,
        children: [
          {
            id: 'bm_react_docs',
            title: 'React Docs',
            url: 'https://react.dev',
            parentId: 'folder_react',
            type: 'bookmark',
            isFavorite: true,
            createdAt: Date.now() - 86400000 * 14,
            updatedAt: Date.now() - 86400000 * 14,
            visitCount: 28,
          },
          {
            id: 'bm_react_blog',
            title: 'React Blog',
            url: 'https://react.dev/blog',
            parentId: 'folder_react',
            type: 'bookmark',
            isFavorite: false,
            createdAt: Date.now() - 86400000 * 12,
            updatedAt: Date.now() - 86400000 * 12,
            visitCount: 6,
          },
        ],
      },
      {
        id: 'folder_backend',
        title: 'Backend',
        parentId: 'folder_dev',
        type: 'folder',
        createdAt: Date.now() - 86400000 * 10,
        updatedAt: Date.now() - 86400000 * 10,
        children: [
          {
            id: 'bm_fastapi',
            title: 'FastAPI',
            url: 'https://fastapi.tiangolo.com',
            parentId: 'folder_backend',
            type: 'bookmark',
            createdAt: Date.now() - 86400000 * 9,
            updatedAt: Date.now() - 86400000 * 9,
            visitCount: 8,
          },
          {
            id: 'bm_postgresql',
            title: 'PostgreSQL Docs',
            url: 'https://www.postgresql.org/docs',
            parentId: 'folder_backend',
            type: 'bookmark',
            createdAt: Date.now() - 86400000 * 8,
            updatedAt: Date.now() - 86400000 * 8,
            visitCount: 11,
          },
        ],
      },
    ],
  },
  {
    id: 'folder_ai',
    title: 'AI',
    parentId: null,
    type: 'folder',
    createdAt: Date.now() - 86400000 * 20,
    updatedAt: Date.now() - 86400000 * 20,
    children: [
      {
        id: 'bm_chatgpt',
        title: 'ChatGPT',
        url: 'https://chatgpt.com',
        parentId: 'folder_ai',
        type: 'bookmark',
        isFavorite: true,
        createdAt: Date.now() - 86400000 * 19,
        updatedAt: Date.now() - 86400000 * 19,
        visitCount: 50,
      },
      {
        id: 'bm_gemini',
        title: 'Google Gemini',
        url: 'https://gemini.google.com',
        parentId: 'folder_ai',
        type: 'bookmark',
        isFavorite: true,
        createdAt: Date.now() - 86400000 * 18,
        updatedAt: Date.now() - 86400000 * 18,
        visitCount: 35,
      },
      {
        id: 'bm_huggingface',
        title: 'Hugging Face',
        url: 'https://huggingface.co',
        parentId: 'folder_ai',
        type: 'bookmark',
        createdAt: Date.now() - 86400000 * 15,
        updatedAt: Date.now() - 86400000 * 15,
        visitCount: 14,
      },
    ],
  },
  {
    id: 'folder_entertainment',
    title: 'Entertainment',
    parentId: null,
    type: 'folder',
    createdAt: Date.now() - 86400000 * 15,
    updatedAt: Date.now() - 86400000 * 15,
    children: [
      {
        id: 'bm_youtube',
        title: 'YouTube',
        url: 'https://youtube.com',
        parentId: 'folder_entertainment',
        type: 'bookmark',
        isFavorite: true,
        createdAt: Date.now() - 86400000 * 14,
        updatedAt: Date.now() - 86400000 * 14,
        visitCount: 60,
      },
      {
        id: 'bm_netflix',
        title: 'Netflix',
        url: 'https://netflix.com',
        parentId: 'folder_entertainment',
        type: 'bookmark',
        createdAt: Date.now() - 86400000 * 10,
        updatedAt: Date.now() - 86400000 * 10,
        visitCount: 12,
      },
    ],
  },
  {
    id: 'folder_other',
    title: 'Other',
    parentId: null,
    type: 'folder',
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now() - 86400000 * 5,
    children: [
      {
        id: 'bm_useful',
        title: 'Useful Website',
        url: 'https://en.wikipedia.org',
        parentId: 'folder_other',
        type: 'bookmark',
        createdAt: Date.now() - 86400000 * 4,
        updatedAt: Date.now() - 86400000 * 4,
        visitCount: 4,
      },
    ],
  },
];

/**
 * Find a node by ID anywhere in the tree
 */
export function findNodeById(tree: BookmarkNode[], id: string): BookmarkNode | null {
  for (const node of tree) {
    if (node.id === id) return node;
    if (isFolder(node) && node.children.length > 0) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Find the parent folder of a node by node ID
 */
export function findParentFolder(tree: BookmarkNode[], childId: string): BookmarkFolderNode | null {
  for (const node of tree) {
    if (isFolder(node)) {
      if (node.children.some(c => c.id === childId)) {
        return node;
      }
      const found = findParentFolder(node.children, childId);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Calculate breadcrumbs path for a given node or folder ID
 */
export function getBreadcrumbPath(
  tree: BookmarkNode[],
  targetId: string | null
): { id: string; title: string }[] {
  if (!targetId) {
    return [{ id: 'root', title: 'Bookmarks' }];
  }

  const path: { id: string; title: string }[] = [];

  function traverse(nodes: BookmarkNode[], currentPath: { id: string; title: string }[]): boolean {
    for (const node of nodes) {
      const newPath = [...currentPath, { id: node.id, title: node.title }];
      if (node.id === targetId) {
        path.push(...newPath);
        return true;
      }
      if (isFolder(node) && node.children.length > 0) {
        if (traverse(node.children, newPath)) {
          return true;
        }
      }
    }
    return false;
  }

  traverse(tree, [{ id: 'root', title: 'Bookmarks' }]);
  return path.length > 0 ? path : [{ id: 'root', title: 'Bookmarks' }];
}

/**
 * Counts bookmarks and folders recursively inside a subtree
 */
export function countSubtreeItems(node: BookmarkFolderNode): { bookmarks: number; folders: number } {
  let bookmarks = 0;
  let folders = 0;

  for (const child of node.children) {
    if (isFolder(child)) {
      folders += 1;
      const sub = countSubtreeItems(child);
      bookmarks += sub.bookmarks;
      folders += sub.folders;
    } else {
      bookmarks += 1;
    }
  }

  return { bookmarks, folders };
}

/**
 * Check if targetFolderId is a descendant of sourceFolderId to prevent circular references!
 */
export function isDescendantFolder(
  tree: BookmarkNode[],
  sourceFolderId: string,
  targetFolderId: string
): boolean {
  if (sourceFolderId === targetFolderId) return true;

  const sourceNode = findNodeById(tree, sourceFolderId);
  if (!sourceNode || !isFolder(sourceNode)) return false;

  function checkChildren(folder: BookmarkFolderNode): boolean {
    for (const child of folder.children) {
      if (child.id === targetFolderId) return true;
      if (isFolder(child) && checkChildren(child)) return true;
    }
    return false;
  }

  return checkChildren(sourceNode);
}

/**
 * Get all folders in a flattened list (for select dropdowns)
 */
export function getAllFoldersFlattened(
  tree: BookmarkNode[],
  level = 0
): { id: string; title: string; level: number }[] {
  const result: { id: string; title: string; level: number }[] = [];

  for (const node of tree) {
    if (isFolder(node)) {
      result.push({ id: node.id, title: node.title, level });
      result.push(...getAllFoldersFlattened(node.children, level + 1));
    }
  }

  return result;
}

/**
 * Search all bookmarks and folders recursively
 */
export function searchBookmarkTree(
  tree: BookmarkNode[],
  query: string
): BookmarkSearchMatch[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const matches: BookmarkSearchMatch[] = [];

  function traverse(nodes: BookmarkNode[], path: { id: string; title: string }[]) {
    for (const node of nodes) {
      const nodePath = [...path, { id: node.id, title: node.title }];
      const titleMatch = node.title.toLowerCase().includes(q);
      const urlMatch = isBookmark(node) && node.url.toLowerCase().includes(q);

      if (titleMatch || urlMatch) {
        matches.push({
          node,
          breadcrumbs: path,
        });
      }

      if (isFolder(node)) {
        traverse(node.children, nodePath);
      }
    }
  }

  traverse(tree, [{ id: 'root', title: 'Bookmarks' }]);
  return matches;
}

/**
 * Get all bookmarks as a flat list
 */
export function getAllBookmarksFlat(tree: BookmarkNode[]): BookmarkItemNode[] {
  const result: BookmarkItemNode[] = [];
  function traverse(nodes: BookmarkNode[]) {
    for (const node of nodes) {
      if (isBookmark(node)) {
        result.push(node);
      } else if (isFolder(node)) {
        traverse(node.children);
      }
    }
  }
  traverse(tree);
  return result;
}

/**
 * Sort a list of BookmarkNodes according to option
 */
export function sortBookmarkNodes(
  nodes: BookmarkNode[],
  sortOption: BookmarkSortOption
): BookmarkNode[] {
  if (sortOption === 'manual') return nodes;

  const copy = [...nodes];
  copy.sort((a, b) => {
    // Folders usually stay on top in file explorers
    if (isFolder(a) && !isFolder(b)) return -1;
    if (!isFolder(a) && isFolder(b)) return 1;

    switch (sortOption) {
      case 'name-asc':
        return a.title.localeCompare(b.title);
      case 'name-desc':
        return b.title.localeCompare(a.title);
      case 'date-newest':
        return (b.createdAt || 0) - (a.createdAt || 0);
      case 'date-oldest':
        return (a.createdAt || 0) - (b.createdAt || 0);
      case 'last-opened': {
        const lastA = isBookmark(a) ? (a.lastOpenedAt || 0) : (a.updatedAt || 0);
        const lastB = isBookmark(b) ? (b.lastOpenedAt || 0) : (b.updatedAt || 0);
        return lastB - lastA;
      }
      default:
        return 0;
    }
  });

  return copy;
}

/**
 * Deep clone bookmark tree
 */
export function cloneBookmarkTree<T extends BookmarkNode[]>(tree: T): T {
  return JSON.parse(JSON.stringify(tree));
}

/**
 * Clean & validate URL
 */
export function sanitizeUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}
