import React from 'react';
import { Search, Globe, ExternalLink } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { SEARCH_ENGINES } from '../../utils/searchEngines';
import { SearchEngineId } from '../../types';

export const SearchSettings: React.FC = () => {
  const { settings, updateSettings, accentTheme } = useSettings();

  return (
    <div className="space-y-6 text-xs text-neutral-300">
      {/* Default Engine */}
      <section>
        <h4 className="text-xs font-semibold text-neutral-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-cyan-400" />
          <span>Default Search Provider</span>
        </h4>
        <div className="space-y-1.5">
          {(Object.values(SEARCH_ENGINES)).map((engine) => {
            const isSelected = settings.defaultSearchEngine === engine.id;
            return (
              <label
                key={engine.id}
                onClick={() => updateSettings({ defaultSearchEngine: engine.id as SearchEngineId })}
                className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? `${accentTheme.bgActive} border-cyan-500/40`
                    : 'bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/10'
                }`}
              >
                <div>
                  <div className="font-semibold text-neutral-200">{engine.name}</div>
                  <div className="text-[11px] text-neutral-500 truncate max-w-xs">{engine.placeholder}</div>
                </div>
                <input
                  type="radio"
                  name="default_engine"
                  checked={isSelected}
                  onChange={() => {}}
                  className="accent-cyan-500"
                />
              </label>
            );
          })}
        </div>
      </section>

      {/* Toggles */}
      <section className="space-y-3">
        <h4 className="text-xs font-semibold text-neutral-200 uppercase tracking-wider">
          Search Behavior
        </h4>

        {/* New Tab Toggle */}
        <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 cursor-pointer">
          <div>
            <div className="font-medium text-neutral-200 flex items-center gap-1.5">
              <span>Open Queries in New Tab</span>
              <ExternalLink className="w-3 h-3 text-neutral-500" />
            </div>
            <div className="text-[11px] text-neutral-500">
              Preserve this New Tab dashboard when executing searches
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.openSearchInNewTab}
            onChange={(e) => updateSettings({ openSearchInNewTab: e.target.checked })}
            className="w-4 h-4 rounded accent-cyan-500"
          />
        </label>

        {/* Search Suggestions */}
        <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 cursor-pointer">
          <div>
            <div className="font-medium text-neutral-200">Show Suggestions & Recents</div>
            <div className="text-[11px] text-neutral-500">
              Display quick engine shortcuts (gh:, yt:) and recent searches dropdown
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.showSearchSuggestions}
            onChange={(e) => updateSettings({ showSearchSuggestions: e.target.checked })}
            className="w-4 h-4 rounded accent-cyan-500"
          />
        </label>
      </section>
    </div>
  );
};
