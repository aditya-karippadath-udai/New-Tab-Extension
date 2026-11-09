import React from 'react';
import {
  Search,
  Plus,
  FolderPlus,
  Download,
  ArrowUpDown,
  ChevronsUpDown,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { useBookmarks } from '../../context/BookmarkContext';
import { useSettings } from '../../context/SettingsContext';
import { BookmarkSortOption } from '../../types/bookmark';

export const BookmarkToolbar: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    sortOption,
    setSortOption,
    openDialog,
    expandAll,
    collapseAll,
    selectedFolderId,
    stats,
  } = useBookmarks();

  const { accentTheme } = useSettings();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 border-b border-neutral-200 dark:border-white/10 select-none text-xs">
      {/* Left: Search input */}
      <div className="relative flex-1 min-w-48 max-w-sm">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search bookmarks by title or URL..."
          className="w-full bg-white dark:bg-black/40 border border-neutral-300 dark:border-white/10 rounded-xl pl-8 pr-7 py-1.5 text-xs text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 outline-none focus:border-cyan-500 dark:focus:border-white/30 transition-all"
        />
        <Search className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500 absolute left-2.5 top-2.5" />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white absolute right-1.5 top-1.5 transition-colors cursor-pointer"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Sort Selector */}
        <div className="relative flex items-center">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as BookmarkSortOption)}
            aria-label="Sort bookmarks"
            className="bg-white dark:bg-black/30 border border-neutral-300 dark:border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-neutral-800 dark:text-neutral-300 outline-none cursor-pointer hover:border-neutral-400 dark:hover:border-white/20 transition-colors"
          >
            <option value="manual" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200">Manual Order</option>
            <option value="name-asc" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200">Name (A → Z)</option>
            <option value="name-desc" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200">Name (Z → A)</option>
            <option value="date-newest" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200">Date Added (Newest)</option>
            <option value="date-oldest" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200">Date Added (Oldest)</option>
            <option value="last-opened" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200">Recently Opened</option>
          </select>
        </div>

        {/* Expand/Collapse All */}
        <div className="hidden md:flex items-center gap-1 border-r border-neutral-200 dark:border-white/10 pr-2">
          <button
            onClick={expandAll}
            title="Expand All Folders"
            className="px-2 py-1 rounded-lg text-[11px] text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            title="Collapse All Folders"
            className="px-2 py-1 rounded-lg text-[11px] text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            Collapse All
          </button>
        </div>

        {/* Import/Export */}
        <button
          onClick={() => openDialog('import-export')}
          title="Import or Export Bookmarks"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 border border-neutral-200 dark:border-white/10 text-neutral-700 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
          <span className="hidden sm:inline">Backup</span>
        </button>

        {/* New Folder button */}
        <button
          onClick={() => openDialog('add-folder', null, selectedFolderId)}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 border border-neutral-200 dark:border-white/10 text-neutral-700 hover:text-neutral-950 dark:text-neutral-200 dark:hover:text-white transition-colors cursor-pointer"
        >
          <FolderPlus className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
          <span>New Folder</span>
        </button>

        {/* Add Bookmark button */}
        <button
          onClick={() => openDialog('add-bookmark', null, selectedFolderId)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-white font-medium shadow-sm transition-all cursor-pointer ${accentTheme.buttonClass}`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Bookmark</span>
        </button>
      </div>
    </div>
  );
};
