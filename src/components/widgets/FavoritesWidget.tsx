import React, { useState } from 'react';
import { Plus, MoreVertical, Edit2, Trash2, ArrowLeft, ArrowRight, ExternalLink, Bookmark } from 'lucide-react';
import { WidgetContainer } from './WidgetContainer';
import { useFavorites } from '../../context/FavoritesContext';
import { useSettings } from '../../context/SettingsContext';
import { FavoriteItem } from '../../types';
import { getFaviconUrl, getDomainInitials, getBrandFallbackClass, extractHostname } from '../../utils/faviconUtils';
import { AddFavoriteModal } from '../modals/AddFavoriteModal';

export const FavoritesWidget: React.FC = () => {
  const { favorites, deleteFavorite, moveFavorite, openFavorite } = useFavorites();
  const { settings, accentTheme } = useSettings();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FavoriteItem | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [failedFavicons, setFailedFavicons] = useState<Record<string, boolean>>({});

  const handleImageError = (id: string) => {
    setFailedFavicons((prev) => ({ ...prev, [id]: true }));
  };

  const handleItemClick = (e: React.MouseEvent, fav: FavoriteItem) => {
    // If click happened on menu trigger/buttons, ignore
    if ((e.target as HTMLElement).closest('.fav-menu-container')) {
      return;
    }
    const forceNewTab = e.metaKey || e.ctrlKey || settings.openFavoritesInNewTab;
    openFavorite(fav.url, forceNewTab);
  };

  return (
    <>
      <WidgetContainer
        id="favorites-widget"
        title="Favourite Pages"
        icon={<Bookmark className="w-3.5 h-3.5" />}
        headerAction={
          <button
            onClick={() => {
              setEditingItem(null);
              setModalOpen(true);
            }}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Shortcut</span>
          </button>
        }
      >
        {favorites.length === 0 ? (
          <div className="py-8 text-center select-none">
            <Bookmark className="w-8 h-8 mx-auto mb-2 text-neutral-500 stroke-1" />
            <p className="text-sm font-medium text-neutral-300">No favourite pages yet</p>
            <p className="text-xs text-neutral-500 mt-1 mb-4">
              Add your frequently visited websites for one-click access
            </p>
            <button
              onClick={() => {
                setEditingItem(null);
                setModalOpen(true);
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-white ${accentTheme.buttonClass}`}
            >
              <Plus className="w-4 h-4" />
              <span>Add Favourite</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-3">
            {favorites.map((fav, index) => {
              const faviconSrc = getFaviconUrl(fav.url);
              const failed = failedFavicons[fav.id];
              const isMenuOpen = activeMenuId === fav.id;

              return (
                <div
                  key={fav.id}
                  onClick={(e) => handleItemClick(e, fav)}
                  title={`${fav.title} (${extractHostname(fav.url)})`}
                  className="group relative flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 hover:bg-white/10 dark:bg-black/20 dark:hover:bg-black/40 border border-white/5 hover:border-white/15 transition-all duration-200 cursor-pointer text-center select-none"
                >
                  {/* Context menu button (visible on hover) */}
                  <div className="fav-menu-container absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(isMenuOpen ? null : fav.id);
                      }}
                      className="p-1 rounded-md text-neutral-400 hover:text-white bg-black/40 hover:bg-black/60 transition-colors"
                    >
                      <MoreVertical className="w-3 h-3" />
                    </button>

                    {/* Popover Menu */}
                    {isMenuOpen && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="glass-panel absolute right-0 top-full mt-1 w-36 rounded-xl border border-white/15 bg-neutral-900/95 p-1 z-50 shadow-2xl backdrop-blur-xl text-left text-xs"
                      >
                        <button
                          onClick={() => {
                            setEditingItem(fav);
                            setModalOpen(true);
                            setActiveMenuId(null);
                          }}
                          className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/10 text-neutral-200 transition-colors"
                        >
                          <Edit2 className="w-3 h-3 text-neutral-400" />
                          <span>Edit</span>
                        </button>

                        <div className="flex items-center gap-1 px-1 py-1">
                          <button
                            disabled={index === 0}
                            onClick={() => {
                              moveFavorite(fav.id, 'left');
                              setActiveMenuId(null);
                            }}
                            title="Move left"
                            className="flex-1 flex justify-center p-1 rounded hover:bg-white/10 disabled:opacity-30 text-neutral-300"
                          >
                            <ArrowLeft className="w-3 h-3" />
                          </button>
                          <button
                            disabled={index === favorites.length - 1}
                            onClick={() => {
                              moveFavorite(fav.id, 'right');
                              setActiveMenuId(null);
                            }}
                            title="Move right"
                            className="flex-1 flex justify-center p-1 rounded hover:bg-white/10 disabled:opacity-30 text-neutral-300"
                          >
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => {
                            deleteFavorite(fav.id);
                            setActiveMenuId(null);
                          }}
                          className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-rose-500/20 text-rose-300 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Favicon Icon */}
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2 overflow-hidden shadow-sm transition-transform group-hover:scale-105">
                    {!failed ? (
                      <img
                        src={faviconSrc}
                        alt=""
                        onError={() => handleImageError(fav.id)}
                        className="w-6 h-6 object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <div
                        className={`w-full h-full flex items-center justify-center font-bold text-xs border ${getBrandFallbackClass(
                          fav.url
                        )}`}
                      >
                        {getDomainInitials(fav.url)}
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <span className="text-xs font-medium text-neutral-200 group-hover:text-white truncate w-full px-1">
                    {fav.title}
                  </span>
                </div>
              );
            })}

            {/* Quick "+ Add" slot */}
            <button
              onClick={() => {
                setEditingItem(null);
                setModalOpen(true);
              }}
              title="Add another favorite page"
              className="flex flex-col items-center justify-center p-3 rounded-2xl border border-dashed border-white/15 hover:border-white/30 bg-white/[0.02] hover:bg-white/5 transition-all text-neutral-400 hover:text-white group select-none"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2 bg-white/5 group-hover:bg-white/10 transition-colors">
                <Plus className="w-4 h-4 text-neutral-400 group-hover:text-white" />
              </div>
              <span className="text-xs font-medium text-neutral-400 group-hover:text-neutral-200">
                Add Page
              </span>
            </button>
          </div>
        )}
      </WidgetContainer>

      <AddFavoriteModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingItem(null);
        }}
        editItem={editingItem}
      />
    </>
  );
};
