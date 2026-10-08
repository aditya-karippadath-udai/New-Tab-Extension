import React from 'react';
import { BookmarkTreeNode } from './BookmarkTreeNode';
import { useBookmarks } from '../../context/BookmarkContext';
import { FolderPlus, Plus, Bookmark } from 'lucide-react';

export const BookmarkTree: React.FC = () => {
  const {
    bookmarks,
    selectedFolderId,
    selectFolder,
    openContextMenu,
    openDialog,
    moveNode,
  } = useBookmarks();

  const handleContainerContextMenu = (e: React.MouseEvent) => {
    // If clicked on tree background, open root context menu
    if ((e.target as HTMLElement).closest('.group')) return;
    openContextMenu(e, null, null);
  };

  const handleRootDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleRootDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/plain');
    if (draggedId) {
      moveNode(draggedId, null);
    }
  };

  if (bookmarks.length === 0) {
    return (
      <div className="p-4 text-center text-xs text-neutral-400">
        <Bookmark className="w-6 h-6 mx-auto mb-2 text-neutral-500" />
        <p className="font-medium text-neutral-300">Tree is empty</p>
        <div className="flex flex-col gap-1.5 mt-3">
          <button
            onClick={() => openDialog('add-folder', null, null)}
            className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-200 transition-colors"
          >
            <FolderPlus className="w-3.5 h-3.5 text-amber-400" />
            <span>New Folder</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onContextMenu={handleContainerContextMenu}
      onDragOver={handleRootDragOver}
      onDrop={handleRootDrop}
      className="h-full overflow-y-auto space-y-0.5 pr-1 select-none focus:outline-none"
      tabIndex={0}
      role="tree"
      aria-label="Bookmarks Tree"
    >
      {/* Root "All Bookmarks" Row */}
      <div
        onClick={() => selectFolder(null)}
        className={`flex items-center justify-between py-1.5 px-2 rounded-xl transition-all cursor-pointer text-xs mb-1 border ${
          selectedFolderId === null
            ? 'bg-white/15 border-white/20 text-white font-semibold'
            : 'border-transparent text-neutral-400 hover:text-white hover:bg-white/5'
        }`}
      >
        <span className="font-semibold uppercase tracking-wider text-[11px]">
          Root Hierarchy
        </span>
        <span className="text-[10px] text-neutral-400 tabular-nums">
          {bookmarks.length} folders
        </span>
      </div>

      {/* Recursive nodes */}
      {bookmarks.map((folder) => (
        <BookmarkTreeNode key={folder.id} node={folder} level={0} />
      ))}
    </div>
  );
};
