import React, { useEffect, useRef } from 'react';
import {
  ExternalLink,
  Edit2,
  Trash2,
  FolderPlus,
  Plus,
  Star,
  Copy,
  Folder,
  ArrowRight,
  Check,
} from 'lucide-react';
import { useBookmarks } from '../../context/BookmarkContext';
import { isFolder, isBookmark } from '../../utils/bookmarkUtils';

export const BookmarkContextMenu: React.FC = () => {
  const {
    contextMenu,
    closeContextMenu,
    openDialog,
    openBookmark,
    toggleFavoriteBookmark,
    deleteBookmark,
    deleteFolder,
  } = useBookmarks();

  const menuRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    // Keep menu inside viewport boundaries
    if (menuRef.current && contextMenu.isOpen) {
      const rect = menuRef.current.getBoundingClientRect();
      let x = contextMenu.x;
      let y = contextMenu.y;

      if (x + rect.width > window.innerWidth) {
        x = window.innerWidth - rect.width - 10;
      }
      if (y + rect.height > window.innerHeight) {
        y = window.innerHeight - rect.height - 10;
      }

      menuRef.current.style.left = `${Math.max(10, x)}px`;
      menuRef.current.style.top = `${Math.max(10, y)}px`;
    }
  }, [contextMenu.isOpen, contextMenu.x, contextMenu.y]);

  if (!contextMenu.isOpen) return null;

  const node = contextMenu.node;
  const isTargetFolder = node && isFolder(node);
  const isTargetBookmark = node && isBookmark(node);

  const handleCopyLink = () => {
    if (isTargetBookmark) {
      navigator.clipboard.writeText(node.url);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        closeContextMenu();
      }, 700);
    }
  };

  return (
    <div
      ref={menuRef}
      style={{ left: contextMenu.x, top: contextMenu.y }}
      onClick={(e) => e.stopPropagation()}
      className="fixed z-50 min-w-48 rounded-xl glass-panel bg-white/95 dark:bg-neutral-900/95 border border-neutral-200/80 dark:border-white/15 p-1 shadow-2xl backdrop-blur-xl text-xs text-neutral-800 dark:text-neutral-200 select-none animate-in fade-in zoom-in-95 duration-100"
    >
      {/* 1. If clicking a Bookmark */}
      {isTargetBookmark && (
        <>
          <button
            onClick={() => {
              openBookmark(node, false);
              closeContextMenu();
            }}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/10 text-neutral-800 dark:text-neutral-200 transition-colors text-left font-medium"
          >
            <ArrowRight className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
            <span>Open</span>
          </button>

          <button
            onClick={() => {
              openBookmark(node, true);
              closeContextMenu();
            }}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/10 text-neutral-800 dark:text-neutral-200 transition-colors text-left font-medium"
          >
            <ExternalLink className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
            <span>Open in New Tab</span>
          </button>

          <button
            onClick={() => {
              toggleFavoriteBookmark(node);
              closeContextMenu();
            }}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/10 text-neutral-800 dark:text-neutral-200 transition-colors text-left font-medium"
          >
            <Star className={`w-3.5 h-3.5 ${node.isFavorite ? 'text-amber-500 fill-amber-500' : 'text-neutral-500 dark:text-neutral-400'}`} />
            <span>{node.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/10 text-neutral-800 dark:text-neutral-200 transition-colors text-left font-medium"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Link'}</span>
          </button>

          <div className="my-1 border-t border-neutral-200 dark:border-white/10" />

          <button
            onClick={() => {
              openDialog('edit-bookmark', node);
              closeContextMenu();
            }}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/10 text-neutral-800 dark:text-neutral-200 transition-colors text-left font-medium"
          >
            <Edit2 className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
            <span>Edit Bookmark</span>
          </button>

          <button
            onClick={() => {
              deleteBookmark(node.id);
              closeContextMenu();
            }}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-rose-50 text-rose-600 dark:hover:bg-rose-500/20 dark:text-rose-300 transition-colors text-left font-medium"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </>
      )}

      {/* 2. If clicking a Folder */}
      {isTargetFolder && (
        <>
          <button
            onClick={() => {
              openDialog('add-bookmark', null, node.id);
              closeContextMenu();
            }}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/10 text-neutral-800 dark:text-neutral-200 transition-colors text-left font-medium"
          >
            <Plus className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>New Bookmark Here</span>
          </button>

          <button
            onClick={() => {
              openDialog('add-folder', null, node.id);
              closeContextMenu();
            }}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/10 text-neutral-800 dark:text-neutral-200 transition-colors text-left font-medium"
          >
            <FolderPlus className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>New Subfolder</span>
          </button>

          <div className="my-1 border-t border-neutral-200 dark:border-white/10" />

          <button
            onClick={() => {
              openDialog('rename-folder', node);
              closeContextMenu();
            }}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/10 text-neutral-800 dark:text-neutral-200 transition-colors text-left font-medium"
          >
            <Edit2 className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
            <span>Rename Folder</span>
          </button>

          <button
            onClick={() => {
              openDialog('delete-confirm', node);
              closeContextMenu();
            }}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-rose-50 text-rose-600 dark:hover:bg-rose-500/20 dark:text-rose-300 transition-colors text-left font-medium"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Folder</span>
          </button>
        </>
      )}

      {/* 3. If clicking on empty space */}
      {!node && (
        <>
          <button
            onClick={() => {
              openDialog('add-bookmark', null, contextMenu.folderId);
              closeContextMenu();
            }}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/10 text-neutral-800 dark:text-neutral-200 transition-colors text-left font-medium"
          >
            <Plus className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>New Bookmark</span>
          </button>

          <button
            onClick={() => {
              openDialog('add-folder', null, contextMenu.folderId);
              closeContextMenu();
            }}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/10 text-neutral-800 dark:text-neutral-200 transition-colors text-left font-medium"
          >
            <FolderPlus className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>New Folder</span>
          </button>

          <div className="my-1 border-t border-neutral-200 dark:border-white/10" />

          <button
            onClick={() => {
              openDialog('import-export');
              closeContextMenu();
            }}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/10 text-neutral-800 dark:text-neutral-200 transition-colors text-left font-medium"
          >
            <Folder className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
            <span>Import / Export...</span>
          </button>
        </>
      )}
    </div>
  );
};
