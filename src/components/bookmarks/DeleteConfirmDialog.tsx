import React from 'react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';
import { useBookmarks } from '../../context/BookmarkContext';
import { isFolder, countSubtreeItems } from '../../utils/bookmarkUtils';

export const DeleteConfirmDialog: React.FC = () => {
  const { dialogState, closeDialog, deleteFolder, deleteBookmark } = useBookmarks();

  if (dialogState.type !== 'delete-confirm' || !dialogState.targetNode) {
    return null;
  }

  const node = dialogState.targetNode;
  const isTargetFolder = isFolder(node);
  const counts = isTargetFolder ? countSubtreeItems(node) : { bookmarks: 0, folders: 0 };
  const hasChildren = isTargetFolder && (counts.bookmarks > 0 || counts.folders > 0);

  const handleDelete = () => {
    if (isTargetFolder) {
      deleteFolder(node.id);
    } else {
      deleteBookmark(node.id);
    }
    closeDialog();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl glass-panel bg-neutral-900/95 border border-rose-500/30 p-5 shadow-2xl text-neutral-200">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
          <h3 className="text-sm font-semibold text-rose-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>Delete "{node.title}"?</span>
          </h3>
          <button
            onClick={closeDialog}
            className="p-1 rounded-lg text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs text-neutral-300">
          {hasChildren ? (
            <>
              <p>This folder contains:</p>
              <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1 font-mono text-neutral-200">
                <div className="flex items-center justify-between">
                  <span>Bookmarks</span>
                  <span className="font-bold text-amber-400">{counts.bookmarks}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Subfolders</span>
                  <span className="font-bold text-cyan-400">{counts.folders}</span>
                </div>
              </div>
              <p className="text-rose-300 font-medium">
                Are you sure you want to delete everything inside this folder? This action cannot be undone.
              </p>
            </>
          ) : (
            <p>
              Are you sure you want to delete this {isTargetFolder ? 'folder' : 'bookmark'}?
            </p>
          )}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={closeDialog}
              className="px-3 py-1.5 rounded-xl text-xs font-medium text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-medium text-white bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete {isTargetFolder ? 'Folder' : 'Bookmark'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
