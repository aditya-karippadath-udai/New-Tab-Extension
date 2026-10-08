import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  Globe,
  Star,
  ExternalLink,
} from 'lucide-react';
import { BookmarkNode } from '../../types/bookmark';
import { useBookmarks } from '../../context/BookmarkContext';
import { useSettings } from '../../context/SettingsContext';
import { isFolder, isBookmark } from '../../utils/bookmarkUtils';
import { getFaviconUrl } from '../../utils/faviconUtils';

interface BookmarkTreeNodeProps {
  node: BookmarkNode;
  level: number;
}

export const BookmarkTreeNode: React.FC<BookmarkTreeNodeProps> = ({ node, level }) => {
  const {
    selectedFolderId,
    selectFolder,
    expandedFolderIds,
    toggleFolderExpand,
    openBookmark,
    openContextMenu,
    moveNode,
  } = useBookmarks();

  const { accentTheme } = useSettings();

  const [isDragOver, setIsDragOver] = useState(false);
  const [dropPosition, setDropPosition] = useState<'inside' | 'above' | 'below'>('inside');
  const [faviconFailed, setFaviconFailed] = useState(false);

  const isNodeFolder = isFolder(node);
  const isExpanded = isNodeFolder && expandedFolderIds.has(node.id);
  const isSelected = selectedFolderId === node.id;

  // Handle Drag & Drop
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', node.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();
    const offsetY = e.clientY - rect.top;
    const height = rect.height;

    if (isNodeFolder) {
      if (offsetY < height * 0.25) {
        setDropPosition('above');
      } else if (offsetY > height * 0.75) {
        setDropPosition('below');
      } else {
        setDropPosition('inside');
      }
    } else {
      if (offsetY < height * 0.5) {
        setDropPosition('above');
      } else {
        setDropPosition('below');
      }
    }

    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const draggedId = e.dataTransfer.getData('text/plain');
    if (!draggedId || draggedId === node.id) return;

    if (isNodeFolder && dropPosition === 'inside') {
      moveNode(draggedId, node.id);
    } else {
      // Reorder or drop next to node
      const parentId = node.parentId;
      moveNode(draggedId, parentId);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isNodeFolder) {
      selectFolder(node.id);
      toggleFolderExpand(node.id);
    } else if (isBookmark(node)) {
      openBookmark(node, e.metaKey || e.ctrlKey);
    }
  };

  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isNodeFolder) {
      toggleFolderExpand(node.id);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    openContextMenu(e, node, isNodeFolder ? node.id : node.parentId);
  };

  const paddingLeft = `${level * 16 + 8}px`;

  return (
    <div className="relative select-none text-xs">
      {/* Drop indicators */}
      {isDragOver && dropPosition === 'above' && (
        <div className="absolute top-0 left-2 right-2 h-0.5 bg-cyan-400 z-20 shadow-sm" />
      )}
      {isDragOver && dropPosition === 'below' && (
        <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-cyan-400 z-20 shadow-sm" />
      )}

      {/* Node Row */}
      <div
        draggable
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        style={{ paddingLeft }}
        className={`group flex items-center justify-between py-1.5 pr-2 rounded-xl transition-all cursor-pointer border ${
          isSelected
            ? `${accentTheme.bgActive} border-cyan-500/40 shadow-xs font-medium`
            : isDragOver && dropPosition === 'inside'
            ? 'bg-cyan-500/20 border-cyan-400/60'
            : 'border-transparent hover:bg-white/5 text-neutral-300 hover:text-white'
        }`}
      >
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          {/* Expand / Collapse icon */}
          {isNodeFolder ? (
            <button
              onClick={handleToggleClick}
              className="p-0.5 rounded text-neutral-400 hover:text-white transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>
          ) : (
            <span className="w-3.5 h-3.5 shrink-0" />
          )}

          {/* Node Icon */}
          {isNodeFolder ? (
            isExpanded ? (
              <FolderOpen className="w-4 h-4 text-amber-400 shrink-0" />
            ) : (
              <Folder className="w-4 h-4 text-amber-400 shrink-0" />
            )
          ) : (
            <div className="w-4 h-4 shrink-0 flex items-center justify-center">
              {!faviconFailed ? (
                <img
                  src={getFaviconUrl((node as any).url)}
                  alt=""
                  onError={() => setFaviconFailed(true)}
                  className="w-3.5 h-3.5 object-contain"
                  loading="lazy"
                />
              ) : (
                <Globe className="w-3.5 h-3.5 text-neutral-400" />
              )}
            </div>
          )}

          {/* Title */}
          <span className="truncate flex-1">{node.title}</span>
        </div>

        {/* Right side indicators */}
        <div className="flex items-center gap-1 shrink-0 ml-1">
          {isBookmark(node) && node.isFavorite && (
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
          )}
          {isNodeFolder && node.children.length > 0 && (
            <span className="text-[10px] text-neutral-400 tabular-nums">
              {node.children.length}
            </span>
          )}
        </div>
      </div>

      {/* Recursive Children */}
      {isNodeFolder && isExpanded && node.children.length > 0 && (
        <div className="relative border-l border-white/10 ml-4 pl-1">
          {node.children.map((child) => (
            <BookmarkTreeNode key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};
