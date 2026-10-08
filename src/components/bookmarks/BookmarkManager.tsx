import React, { useEffect } from 'react';
import { X, Bookmark, Folder, Layers, Sparkles } from 'lucide-react';
import { useBookmarks } from '../../context/BookmarkContext';
import { useSettings } from '../../context/SettingsContext';
import { BookmarkToolbar } from './BookmarkToolbar';
import { BookmarkBreadcrumbs } from './BookmarkBreadcrumbs';
import { BookmarkTree } from './BookmarkTree';
import { BookmarkFolderView } from './BookmarkFolderView';
import { BookmarkSearch } from './BookmarkSearch';
import { BookmarkContextMenu } from './BookmarkContextMenu';
import { AddBookmarkDialog } from './AddBookmarkDialog';
import { AddFolderDialog } from './AddFolderDialog';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { ImportExportDialog } from './ImportExportDialog';

export const BookmarkManager: React.FC = () => {
  const { isManagerOpen, setIsManagerOpen, searchQuery, stats } = useBookmarks();
  const { effectiveTheme, accentTheme } = useSettings();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isManagerOpen) {
        setIsManagerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isManagerOpen, setIsManagerOpen]);

  if (!isManagerOpen) return null;

  const isDark = effectiveTheme === 'dark';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      {/* Main Container Window */}
      <div
        className={`w-full max-w-6xl h-[88vh] flex flex-col rounded-3xl border shadow-2xl glass-panel overflow-hidden ${
          isDark
            ? 'bg-neutral-950/95 border-white/15 text-neutral-100'
            : 'bg-white/95 border-neutral-300 text-neutral-900'
        }`}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 select-none">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Bookmark className={`w-4 h-4 ${accentTheme.textColor}`} />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
                <span>Bookmarks Explorer</span>
                <span className="text-[10px] font-mono font-normal text-neutral-400 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                  {stats.totalBookmarks} bookmarks · {stats.totalFolders} folders
                </span>
              </h2>
            </div>
          </div>

          <button
            onClick={() => setIsManagerOpen(false)}
            aria-label="Close Bookmarks Explorer (Esc)"
            className="p-1.5 rounded-xl text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toolbar */}
        <BookmarkToolbar />

        {/* Dual-Pane Explorer Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Pane: Hierarchical Tree Sidebar */}
          <aside className="w-64 sm:w-72 md:w-80 border-r border-white/10 flex flex-col p-3 overflow-hidden bg-black/20 shrink-0">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-2 px-1 flex items-center justify-between">
              <span>Folder Hierarchy</span>
              <Layers className="w-3.5 h-3.5 text-neutral-500" />
            </div>
            <div className="flex-1 overflow-y-auto">
              <BookmarkTree />
            </div>
          </aside>

          {/* Right Pane: Breadcrumbs + Folder Content View OR Search Results */}
          <main className="flex-1 flex flex-col overflow-hidden bg-black/10">
            {/* Breadcrumb Navigation Bar */}
            <div className="px-4 py-2 border-b border-white/5 bg-white/[0.02]">
              <BookmarkBreadcrumbs />
            </div>

            {/* Folder Contents or Search */}
            <div className="flex-1 overflow-hidden">
              {searchQuery.trim() ? <BookmarkSearch /> : <BookmarkFolderView />}
            </div>
          </main>
        </div>

        {/* Bottom Status Footer */}
        <footer className="px-5 py-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-400 select-none bg-black/30">
          <div className="flex items-center gap-3">
            <span>Drag items to reorder or move between folders</span>
            <span aria-hidden="true" className="opacity-30">·</span>
            <span>Right-click for options</span>
          </div>
          <div>
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 font-mono text-[10px]">
              Esc
            </kbd>{' '}
            to close
          </div>
        </footer>
      </div>

      {/* Modals & Dialogs */}
      <BookmarkContextMenu />
      <AddBookmarkDialog />
      <AddFolderDialog />
      <DeleteConfirmDialog />
      <ImportExportDialog />
    </div>
  );
};
