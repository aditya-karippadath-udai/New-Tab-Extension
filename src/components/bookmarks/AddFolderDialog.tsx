import React, { useState, useEffect } from 'react';
import { X, FolderPlus, Folder } from 'lucide-react';
import { useBookmarks } from '../../context/BookmarkContext';
import { useSettings } from '../../context/SettingsContext';
import { isFolder } from '../../utils/bookmarkUtils';

export const AddFolderDialog: React.FC = () => {
  const { dialogState, closeDialog, addFolder, renameFolder, allFolders } = useBookmarks();
  const { accentTheme } = useSettings();

  const isRenaming = dialogState.type === 'rename-folder';
  const targetNode = dialogState.targetNode;
  const initialFolder = targetNode && isFolder(targetNode) ? targetNode : null;

  const [title, setTitle] = useState('');
  const [parentFolderId, setParentFolderId] = useState<string>('');

  useEffect(() => {
    if (isRenaming && initialFolder) {
      setTitle(initialFolder.title);
      setParentFolderId(initialFolder.parentId || '');
    } else {
      setTitle('');
      setParentFolderId(dialogState.targetFolderId || '');
    }
  }, [isRenaming, initialFolder, dialogState.targetFolderId]);

  if (dialogState.type !== 'add-folder' && dialogState.type !== 'rename-folder') {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;

    if (isRenaming && initialFolder) {
      renameFolder(initialFolder.id, cleanTitle);
    } else {
      addFolder(cleanTitle, parentFolderId || null);
    }

    closeDialog();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl glass-panel bg-neutral-900/95 border border-white/15 p-5 shadow-2xl text-neutral-200">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
          <h3 className="text-sm font-semibold text-neutral-100 flex items-center gap-2">
            <FolderPlus className="w-4 h-4 text-amber-400" />
            <span>{isRenaming ? 'Rename Folder' : 'Create New Folder'}</span>
          </h3>
          <button
            onClick={closeDialog}
            className="p-1 rounded-lg text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Folder Name
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Design Systems"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-neutral-100 placeholder:text-neutral-500 outline-none focus:border-white/30"
              autoFocus
            />
          </div>

          {!isRenaming && (
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5 flex items-center gap-1.5">
                <Folder className="w-3.5 h-3.5 text-amber-400" />
                <span>Parent Folder</span>
              </label>
              <select
                value={parentFolderId}
                onChange={(e) => setParentFolderId(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-neutral-200 outline-none cursor-pointer"
              >
                <option value="" className="bg-neutral-900 text-neutral-200">
                  📁 Top Level (Root)
                </option>
                {allFolders.map((f) => (
                  <option key={f.id} value={f.id} className="bg-neutral-900 text-neutral-200">
                    {'\u00A0'.repeat((f.level + 1) * 3)}📁 {f.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={closeDialog}
              className="px-3 py-1.5 rounded-xl text-xs font-medium text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className={`px-4 py-1.5 rounded-xl text-xs font-medium text-white transition-all disabled:opacity-40 cursor-pointer ${accentTheme.buttonClass}`}
            >
              {isRenaming ? 'Save Changes' : 'Create Folder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
