import React from 'react';
import { Search, Globe, Folder, ArrowRight, ExternalLink } from 'lucide-react';
import { useBookmarks } from '../../context/BookmarkContext';
import { isFolder, isBookmark } from '../../utils/bookmarkUtils';
import { getFaviconUrl } from '../../utils/faviconUtils';

export const BookmarkSearch: React.FC = () => {
  const {
    searchQuery,
    searchResults,
    selectFolder,
    openBookmark,
    setSearchQuery,
  } = useBookmarks();

  if (!searchQuery.trim()) return null;

  return (
    <div className="h-full overflow-y-auto p-4 space-y-3 select-none">
      <div className="flex items-center justify-between text-xs text-neutral-400 pb-2 border-b border-white/10">
        <span>
          Search results for "<strong className="text-neutral-100">{searchQuery}</strong>"
        </span>
        <span>
          {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'}
        </span>
      </div>

      {searchResults.length === 0 ? (
        <div className="py-12 text-center text-xs text-neutral-400">
          <Search className="w-8 h-8 mx-auto mb-2 text-neutral-500 stroke-1" />
          <p className="font-semibold text-neutral-200">No bookmarks found</p>
          <p className="text-[11px] text-neutral-500 mt-1 mb-3">
            Try a different search keyword or check spelling.
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-200 transition-colors"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="space-y-1.5">
          {searchResults.map(({ node, breadcrumbs }) => {
            const isNodeFolder = isFolder(node);
            const pathText = breadcrumbs.map((b) => b.title).join(' / ');

            return (
              <div
                key={node.id}
                onClick={() => {
                  if (isNodeFolder) {
                    selectFolder(node.id);
                    setSearchQuery('');
                  } else {
                    openBookmark(node as any);
                  }
                }}
                className="group flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 dark:bg-black/20 dark:hover:bg-black/40 border border-white/5 hover:border-white/15 transition-all cursor-pointer text-xs"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    {isNodeFolder ? (
                      <Folder className="w-4 h-4 text-amber-400" />
                    ) : (
                      <img
                        src={getFaviconUrl((node as any).url)}
                        alt=""
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                        className="w-4 h-4 object-contain"
                        loading="lazy"
                      />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-neutral-200 group-hover:text-white truncate">
                      {node.title}
                    </div>
                    <div className="text-[10px] text-neutral-500 truncate flex items-center gap-1 font-mono">
                      <span>{pathText}</span>
                      {isBookmark(node) && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="truncate">{node.url}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  {isBookmark(node) ? (
                    <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-white" />
                  ) : (
                    <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-white" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
