import React, { useState, useEffect } from 'react';
import { X, Globe, Link2, Folder, Star } from 'lucide-react';
import { useBookmarks } from '../../context/BookmarkContext';
import { useSettings } from '../../context/SettingsContext';
import { isBookmark, sanitizeUrl } from '../../utils/bookmarkUtils';

export const AddBookmarkDialog: React.FC = () => {
  const { dialogState, closeDialog, addBookmark, updateBookmark, allFolders } = useBookmarks();
  const { accentTheme } = useSettings();

  const isEditing = dialogState.type === 'edit-bookmark';
  const targetNode = dialogState.targetNode;
  const initialBookmark = targetNode && isBookmark(targetNode) ? targetNode : null;

  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState<string>('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [urlError, setUrlError] = useState('');

  useEffect(() => {
    if (initialBookmark) {
      setTitle(initialBookmark.title);
      setUrl(initialBookmark.url);
      setSelectedFolderId(initialBookmark.parentId || (allFolders[0]?.id || ''));
      setIsFavorite(!!initialBookmark.isFavorite);
    } else {
      setTitle('');
      setUrl('');
      setSelectedFolderId(dialogState.targetFolderId || (allFolders[0]?.id || ''));
      setIsFavorite(false);
    }
    setUrlError('');
  }, [initialBookmark, dialogState.targetFolderId, allFolders]);

  if (dialogState.type !== 'add-bookmark' && dialogState.type !== 'edit-bookmark') {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrl = sanitizeUrl(url);

    if (!cleanUrl || !cleanUrl.includes('.')) {
      setUrlError('Please enter a valid website URL (e.g. github.com)');
      return;
    }

    if (isEditing && initialBookmark) {
      updateBookmark(initialBookmark.id, {
        title: title.trim() || cleanUrl,
        url: cleanUrl,
        parentId: selectedFolderId || null,
        isFavorite,
      });
    } else {
      addBookmark({
        title: title.trim() || cleanUrl,
        url: cleanUrl,
        parentId: selectedFolderId || null,
        isFavorite,
      });
    }

    closeDialog();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl glass-panel bg-neutral-900/95 border border-white/15 p-5 shadow-2xl text-neutral-200">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
          <h3 className="text-sm font-semibold text-neutral-100 flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>{isEditing ? 'Edit Bookmark' : 'Add New Bookmark'}</span>
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
              Bookmark Name
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. GitHub"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-neutral-100 placeholder:text-neutral-500 outline-none focus:border-white/30"
              autoFocus={!isEditing}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Website URL *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (urlError) setUrlError('');
                }}
                placeholder="https://github.com or docs.rs"
                className={`w-full bg-black/40 border rounded-xl pl-8 pr-3 py-2 text-xs text-neutral-100 placeholder:text-neutral-500 outline-none transition-all ${
                  urlError ? 'border-rose-500/80' : 'border-white/10 focus:border-white/30'
                }`}
              />
              <Link2 className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-2.5" />
            </div>
            {urlError && <p className="text-[11px] text-rose-400 mt-1">{urlError}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5 flex items-center gap-1.5">
              <Folder className="w-3.5 h-3.5 text-amber-400" />
              <span>Target Folder</span>
            </label>
            <select
              value={selectedFolderId}
              onChange={(e) => setSelectedFolderId(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-neutral-200 outline-none cursor-pointer"
            >
              {allFolders.map((f) => (
                <option key={f.id} value={f.id} className="bg-neutral-900 text-neutral-200">
                  {'\u00A0'.repeat(f.level * 3)}📁 {f.title}
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 cursor-pointer">
            <input
              type="checkbox"
              checked={isFavorite}
              onChange={(e) => setIsFavorite(e.target.checked)}
              className="w-4 h-4 rounded accent-cyan-500 cursor-pointer"
            />
            <div className="flex items-center gap-1.5">
              <Star className={`w-3.5 h-3.5 ${isFavorite ? 'text-amber-400 fill-amber-400' : 'text-neutral-400'}`} />
              <span className="font-medium text-neutral-200">Add to Favorites / Quick Links</span>
            </div>
          </label>

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
              disabled={!url.trim()}
              className={`px-4 py-1.5 rounded-xl text-xs font-medium text-white transition-all disabled:opacity-40 cursor-pointer ${accentTheme.buttonClass}`}
            >
              {isEditing ? 'Save Changes' : 'Add Bookmark'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
