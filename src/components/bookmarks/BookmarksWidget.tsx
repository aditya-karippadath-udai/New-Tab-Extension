import React, { useState } from 'react';
import {
  Bookmark,
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  Globe,
  Plus,
  Star,
  ExternalLink,
  Layers,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { WidgetContainer } from '../widgets/WidgetContainer';
import { useBookmarks } from '../../context/BookmarkContext';
import { useSettings } from '../../context/SettingsContext';
import { isFolder, isBookmark, getAllBookmarksFlat } from '../../utils/bookmarkUtils';
import { getFaviconUrl } from '../../utils/faviconUtils';
import { BookmarkFolderNode, BookmarkItemNode, BookmarkNode } from '../../types/bookmark';

export const BookmarksWidget: React.FC = () => {
  const {
    bookmarks,
    recentBookmarks,
    openBookmark,
    openDialog,
    setIsManagerOpen,
    expandedFolderIds,
    toggleFolderExpand,
  } = useBookmarks();

  const { accentTheme } = useSettings();
  const [tabMode, setTabMode] = useState<'tree' | 'favorites' | 'recent'>('tree');

  // Filter favorite bookmarks
  const allBookmarks = getAllBookmarksFlat(bookmarks);
  const favoriteBookmarks = allBookmarks.filter((b) => b.isFavorite);

  return (
    <WidgetContainer
      id="bookmarks-widget"
      title="Bookmarks"
      icon={<Bookmark className="w-3.5 h-3.5" />}
      headerAction={
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => openDialog('add-bookmark')}
            className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-medium text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            <span>Add</span>
          </button>
          <button
            onClick={() => setIsManagerOpen(true)}
            className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-medium text-cyan-400 hover:text-cyan-300 bg-cyan-950/30 hover:bg-cyan-900/40 border border-cyan-800/40 transition-colors cursor-pointer"
          >
            <span>Explorer</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      }
    >
      {/* Tab Switcher */}
      <div className="flex items-center gap-1 p-0.5 rounded-lg bg-black/20 dark:bg-black/30 border border-white/5 mb-3 text-xs">
        <button
          onClick={() => setTabMode('tree')}
          className={`flex-1 py-1 px-2 rounded-md font-medium text-center transition-colors cursor-pointer ${
            tabMode === 'tree'
              ? `${accentTheme.bgActive} font-semibold shadow-xs`
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          Folder Tree
        </button>
        <button
          onClick={() => setTabMode('favorites')}
          className={`flex-1 py-1 px-2 rounded-md font-medium text-center transition-colors cursor-pointer ${
            tabMode === 'favorites'
              ? `${accentTheme.bgActive} font-semibold shadow-xs`
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          Favorites ({favoriteBookmarks.length})
        </button>
        <button
          onClick={() => setTabMode('recent')}
          className={`flex-1 py-1 px-2 rounded-md font-medium text-center transition-colors cursor-pointer ${
            tabMode === 'recent'
              ? `${accentTheme.bgActive} font-semibold shadow-xs`
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          Recent ({recentBookmarks.length})
        </button>
      </div>

      {/* Body */}
      <div className="max-h-64 overflow-y-auto pr-1 select-none text-xs">
        {/* Mode 1: Compact Tree */}
        {tabMode === 'tree' && (
          <div className="space-y-1">
            {bookmarks.length === 0 ? (
              <div className="py-6 text-center text-xs text-neutral-400">
                <Bookmark className="w-5 h-5 mx-auto mb-1 text-neutral-500" />
                <p>No bookmarks yet</p>
                <button
                  onClick={() => openDialog('add-bookmark')}
                  className="mt-2 text-cyan-400 hover:underline"
                >
                  + Add Bookmark
                </button>
              </div>
            ) : (
              bookmarks.map((folder) => {
                const isExpanded = expandedFolderIds.has(folder.id);

                return (
                  <div key={folder.id} className="space-y-0.5">
                    {/* Folder header */}
                    <div
                      onClick={() => toggleFolderExpand(folder.id)}
                      className="flex items-center justify-between p-1.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <button className="text-neutral-400 group-hover:text-white">
                          {isExpanded ? (
                            <ChevronDown className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5" />
                          )}
                        </button>
                        {isExpanded ? (
                          <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
                        ) : (
                          <Folder className="w-3.5 h-3.5 text-amber-400" />
                        )}
                        <span className="font-semibold text-neutral-200 truncate">
                          {folder.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-neutral-500 tabular-nums">
                        {folder.children.length}
                      </span>
                    </div>

                    {/* Children items if expanded */}
                    {isExpanded && (
                      <div className="border-l border-white/10 ml-3.5 pl-2 space-y-0.5">
                        {folder.children.map((child) => {
                          if (isFolder(child)) {
                            return (
                              <div
                                key={child.id}
                                onClick={() => setIsManagerOpen(true)}
                                className="flex items-center gap-1.5 p-1 rounded-lg hover:bg-white/5 text-neutral-400 hover:text-white cursor-pointer"
                              >
                                <Folder className="w-3.5 h-3.5 text-amber-400" />
                                <span className="truncate">{child.title}</span>
                              </div>
                            );
                          }

                          const bm = child;
                          return (
                            <div
                              key={bm.id}
                              onClick={() => openBookmark(bm)}
                              className="group flex items-center justify-between p-1 rounded-lg hover:bg-white/5 cursor-pointer text-neutral-300 hover:text-white"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <img
                                  src={getFaviconUrl(bm.url)}
                                  alt=""
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = 'none';
                                  }}
                                  className="w-3.5 h-3.5 object-contain"
                                  loading="lazy"
                                />
                                <span className="truncate">{bm.title}</span>
                              </div>
                              <ExternalLink className="w-3 h-3 text-neutral-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Mode 2: Favorites List */}
        {tabMode === 'favorites' && (
          <div className="space-y-1">
            {favoriteBookmarks.length === 0 ? (
              <div className="py-6 text-center text-xs text-neutral-400">
                <Star className="w-5 h-5 mx-auto mb-1 text-neutral-500" />
                <p>No favorite bookmarks marked with ⭐ yet</p>
              </div>
            ) : (
              favoriteBookmarks.map((bm) => (
                <div
                  key={bm.id}
                  onClick={() => openBookmark(bm)}
                  className="group flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={getFaviconUrl(bm.url)}
                      alt=""
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                      className="w-4 h-4 object-contain"
                      loading="lazy"
                    />
                    <div className="min-w-0">
                      <div className="font-medium text-neutral-200 group-hover:text-white truncate">
                        {bm.title}
                      </div>
                      <div className="text-[10px] text-neutral-500 truncate font-mono">
                        {bm.url.replace(/^https?:\/\//, '')}
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white shrink-0" />
                </div>
              ))
            )}
          </div>
        )}

        {/* Mode 3: Recent Bookmarks */}
        {tabMode === 'recent' && (
          <div className="space-y-1">
            {recentBookmarks.length === 0 ? (
              <div className="py-6 text-center text-xs text-neutral-400">
                <Clock className="w-5 h-5 mx-auto mb-1 text-neutral-500" />
                <p>No recently opened bookmarks</p>
              </div>
            ) : (
              recentBookmarks.slice(0, 8).map((bm) => (
                <div
                  key={bm.id}
                  onClick={() => openBookmark(bm)}
                  className="group flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={getFaviconUrl(bm.url)}
                      alt=""
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                      className="w-4 h-4 object-contain"
                      loading="lazy"
                    />
                    <span className="font-medium text-neutral-200 group-hover:text-white truncate">
                      {bm.title}
                    </span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white shrink-0" />
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Bottom Link to Full Explorer */}
      <div className="pt-2.5 mt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
        <span className="text-neutral-500">{allBookmarks.length} total bookmarks</span>
        <button
          onClick={() => setIsManagerOpen(true)}
          className="flex items-center gap-1 font-medium text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
        >
          <span>Open Full Manager</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </WidgetContainer>
  );
};
