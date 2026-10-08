import React from 'react';
import { ChevronRight, Home, Folder } from 'lucide-react';
import { useBookmarks } from '../../context/BookmarkContext';

export const BookmarkBreadcrumbs: React.FC = () => {
  const { breadcrumbs, selectFolder } = useBookmarks();

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-neutral-400 overflow-x-auto py-1">
      {breadcrumbs.map((crumb, idx) => {
        const isLast = idx === breadcrumbs.length - 1;
        const isRoot = crumb.id === 'root';

        return (
          <React.Fragment key={crumb.id}>
            {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-neutral-600 shrink-0" />}
            <button
              onClick={() => selectFolder(isRoot ? null : crumb.id)}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                isLast
                  ? 'text-neutral-100 font-semibold bg-white/10'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5'
              }`}
            >
              {isRoot ? (
                <Home className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              ) : (
                <Folder className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              )}
              <span className="truncate max-w-40">{crumb.title}</span>
            </button>
          </React.Fragment>
        );
      })}
    </nav>
  );
};
