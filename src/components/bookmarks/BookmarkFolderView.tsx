import React, { useState } from 'react';
import {
  Folder,
  Globe,
  Star,
  ExternalLink,
  MoreVertical,
  Plus,
  FolderPlus,
  ArrowRight,
  Clock,
  Sparkles,
  Link2,
} from 'lucide-react';
import { useBookmarks } from '../../context/BookmarkContext';
import { useSettings } from '../../context/SettingsContext';
import {
  isFolder,
  isBookmark,
  sortBookmarkNodes,
} from '../../utils/bookmarkUtils';
import { getFaviconUrl } from '../../utils/faviconUtils';
import { BookmarkNode } from '../../types/bookmark';

export const BookmarkFolderView: React.FC = () => {
  const {
    bookmarks,
    selectedFolder,
    selectedFolderId,
    selectFolder,
    openBookmark,
    toggleFavoriteBookmark,
    openContextMenu,
    openDialog,
    sortOption,
    moveNode,
  } = useBookmarks();

  const { accentTheme } = useSettings();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Determine items to display
  let items: BookmarkNode[] = [];
  if (selectedFolder) {
    items = selectedFolder.children;
  } else {
    // Root level: show all top folders
    items = bookmarks;
  }

  const sortedItems = sortBookmarkNodes(items, sortOption);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData('text/plain');
    if (!sourceId || sourceId === targetId) return;

    const targetNode = items.find((i) => i.id === targetId);
    if (targetNode && isFolder(targetNode)) {
      moveNode(sourceId, targetNode.id);
    } else {
      moveNode(sourceId, selectedFolderId);
    }
  };

  if (items.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center select-none">
        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-3">
          <Folder className="w-6 h-6 text-amber-400" />
        </div>
        <h3 className="text-sm font-semibold text-neutral-200">
          This folder is empty
        </h3>
        <p className="text-xs text-neutral-400 mt-1 mb-5 max-w-sm">
          Add frequently used websites or create subfolders to organize your links.
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openDialog('add-bookmark', null, selectedFolderId)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-white cursor-pointer ${accentTheme.buttonClass}`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Bookmark</span>
          </button>
          <button
            onClick={() => openDialog('add-folder', null, selectedFolderId)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-neutral-200 bg-white/10 hover:bg-white/20 border border-white/10 transition-colors cursor-pointer"
          >
            <FolderPlus className="w-3.5 h-3.5 text-amber-400" />
            <span>New Subfolder</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onContextMenu={(e) => {
        if ((e.target as HTMLElement).closest('.item-card')) return;
        openContextMenu(e, null, selectedFolderId);
      }}
      className="h-full overflow-y-auto p-4 space-y-4 select-none"
    >
      {/* Folder items */}
      <div
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3'
            : 'space-y-1.5'
        }
      >
        {sortedItems.map((item) => {
          const isItemFolder = isFolder(item);

          if (isItemFolder) {
            return (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, item.id)}
                onClick={() => selectFolder(item.id)}
                onContextMenu={(e) => openContextMenu(e, item, selectedFolderId)}
                className="item-card group relative flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 dark:bg-black/20 dark:hover:bg-black/40 border border-white/5 hover:border-white/15 transition-all cursor-pointer text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                    <Folder className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-neutral-200 group-hover:text-white truncate">
                      {item.title}
                    </div>
                    <div className="text-[10px] text-neutral-400">
                      {item.children.length} {item.children.length === 1 ? 'item' : 'items'}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openContextMenu(e, item, selectedFolderId);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-opacity"
                >
                  <MoreVertical className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          }

          // Bookmark Card
          const bm = item;
          const faviconSrc = getFaviconUrl(bm.url);

          return (
            <div
              key={bm.id}
              draggable
              onDragStart={(e) => handleDragStart(e, bm.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, bm.id)}
              onClick={(e) => openBookmark(bm, e.metaKey || e.ctrlKey)}
              onContextMenu={(e) => openContextMenu(e, bm, selectedFolderId)}
              className="item-card group relative flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 dark:bg-black/20 dark:hover:bg-black/40 border border-white/5 hover:border-white/15 transition-all cursor-pointer text-xs"
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                  <img
                    src={faviconSrc}
                    alt=""
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                    className="w-4 h-4 object-contain"
                    loading="lazy"
                  />
                  <Globe className="w-4 h-4 text-neutral-400 fallback-icon hidden" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="font-medium text-neutral-200 group-hover:text-white truncate flex items-center gap-1.5">
                    <span className="truncate">{bm.title}</span>
                    {bm.isFavorite && (
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
                    )}
                  </div>
                  <div className="text-[10px] text-neutral-500 truncate font-mono">
                    {bm.url.replace(/^https?:\/\//, '')}
                  </div>
                </div>
              </div>

              {/* Action buttons on hover */}
              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavoriteBookmark(bm);
                  }}
                  title={bm.isFavorite ? 'Remove favorite' : 'Add to favorites'}
                  className="p-1 rounded-lg text-neutral-400 hover:text-amber-400 transition-colors"
                >
                  <Star className={`w-3.5 h-3.5 ${bm.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openBookmark(bm, true);
                  }}
                  title="Open in new tab"
                  className="p-1 rounded-lg text-neutral-400 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openContextMenu(e, bm, selectedFolderId);
                  }}
                  className="p-1 rounded-lg text-neutral-400 hover:text-white transition-colors"
                >
                  <MoreVertical className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
