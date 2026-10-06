import React, { useState, useEffect } from 'react';
import { X, Globe, Link2 } from 'lucide-react';
import { useFavorites } from '../../context/FavoritesContext';
import { useSettings } from '../../context/SettingsContext';
import { FavoriteItem } from '../../types';

interface AddFavoriteModalProps {
  isOpen: boolean;
  onClose: () => void;
  editItem?: FavoriteItem | null;
}

export const AddFavoriteModal: React.FC<AddFavoriteModalProps> = ({
  isOpen,
  onClose,
  editItem,
}) => {
  const { addFavorite, updateFavorite } = useFavorites();
  const { accentTheme } = useSettings();

  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (editItem) {
      setTitle(editItem.title);
      setUrl(editItem.url);
    } else {
      setTitle('');
      setUrl('');
    }
  }, [editItem, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    if (editItem) {
      updateFavorite(editItem.id, {
        title: title.trim() || url.trim(),
        url: url.trim(),
      });
    } else {
      addFavorite(title.trim() || url.trim(), url.trim());
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl glass-panel bg-neutral-900/90 border border-white/10 p-5 shadow-2xl">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
          <h3 className="text-sm font-semibold text-neutral-100 flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>{editItem ? 'Edit Favourite Page' : 'Add Favourite Page'}</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Name / Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. GitHub or Linear"
              className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-xs text-neutral-100 placeholder:text-neutral-500 outline-none focus:border-white/30 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Website URL
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://github.com or google.com"
                className="w-full bg-black/30 border border-white/10 rounded-xl pl-8 pr-3 py-2 text-xs text-neutral-100 placeholder:text-neutral-500 outline-none focus:border-white/30 transition-all"
                autoFocus
              />
              <Link2 className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-2.5" />
            </div>
            <p className="text-[10px] text-neutral-500 mt-1">
              Favicon is automatically detected from the web address.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl text-xs font-medium text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!url.trim()}
              className={`px-4 py-1.5 rounded-xl text-xs font-medium text-white transition-all disabled:opacity-40 ${accentTheme.buttonClass}`}
            >
              {editItem ? 'Save Changes' : 'Add to Dashboard'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
