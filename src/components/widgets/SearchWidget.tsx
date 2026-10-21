import React, { useState, useRef, useEffect } from 'react';
import { Search, Globe, X, ChevronDown, Clock, ArrowUpRight } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { SEARCH_ENGINES, QUICK_SHORTCUTS } from '../../utils/searchEngines';
import { SearchEngineId } from '../../types';
import { getStorageItem, setStorageItem } from '../../storage/browserStorage';

interface SearchWidgetProps {
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

const RECENT_SEARCHES_KEY = 'auratab_recent_searches';

export const SearchWidget: React.FC<SearchWidgetProps> = ({ inputRef: externalInputRef }) => {
  const { settings, updateSettings, effectiveTheme, accentTheme } = useSettings();
  const internalInputRef = useRef<HTMLInputElement>(null);
  const inputRef = externalInputRef || internalInputRef;

  const [query, setQuery] = useState('');
  const [engineDropdownOpen, setEngineDropdownOpen] = useState(false);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeEngine = SEARCH_ENGINES[settings.defaultSearchEngine] || SEARCH_ENGINES.google;
  const isDark = effectiveTheme === 'dark';

  // Load recent searches
  useEffect(() => {
    getStorageItem<string[]>(RECENT_SEARCHES_KEY, []).then((list) => {
      setRecentSearches(list.slice(0, 5));
    });
  }, []);

  // Close menus on outside click
  useEffect(() => {
    const handleDocClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setEngineDropdownOpen(false);
        setSuggestionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleDocClick);
    return () => document.removeEventListener('mousedown', handleDocClick);
  }, []);

  const handleSelectEngine = (engineId: SearchEngineId) => {
    updateSettings({ defaultSearchEngine: engineId });
    setEngineDropdownOpen(false);
    inputRef.current?.focus();
  };

  const handleSearchSubmit = (searchQuery: string = query) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    // Save to recents
    const updated = [trimmed, ...recentSearches.filter((s) => s !== trimmed)].slice(0, 5);
    setRecentSearches(updated);
    setStorageItem(RECENT_SEARCHES_KEY, updated);

    // Check if user used a quick shortcut like "gh: react"
    let targetUrl = '';
    for (const shortcut of QUICK_SHORTCUTS) {
      if (trimmed.startsWith(shortcut.prefix)) {
        const q = trimmed.slice(shortcut.prefix.length).trim();
        targetUrl = `${shortcut.engine}${encodeURIComponent(q)}`;
        break;
      }
    }

    // Direct URL check
    if (!targetUrl) {
      if (/^https?:\/\//i.test(trimmed)) {
        targetUrl = trimmed;
      } else if (/^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/.*)?$/i.test(trimmed)) {
        targetUrl = `https://${trimmed}`;
      } else {
        targetUrl = `${activeEngine.url}${encodeURIComponent(trimmed)}`;
      }
    }

    if (settings.openSearchInNewTab) {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = targetUrl;
    }

    setQuery('');
    setSuggestionsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearchSubmit();
    }
  };

  const removeRecentSearch = (e: React.MouseEvent, itemToRemove: string) => {
    e.stopPropagation();
    const updated = recentSearches.filter((item) => item !== itemToRemove);
    setRecentSearches(updated);
    setStorageItem(RECENT_SEARCHES_KEY, updated);
  };

  return (
    <div ref={containerRef} className="w-full relative select-none">
      {/* Search Bar Container */}
      <div
        className={`glass-panel relative flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl border transition-all duration-200 ${
          isDark
            ? 'bg-neutral-900/70 border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] focus-within:border-white/25 focus-within:bg-neutral-900/90'
            : 'bg-white/80 border-neutral-200/90 shadow-[0_8px_32px_rgba(0,0,0,0.06)] focus-within:border-neutral-300 focus-within:bg-white'
        }`}
      >
        {/* Search Engine Switcher Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setEngineDropdownOpen(!engineDropdownOpen);
              setSuggestionsOpen(false);
            }}
            aria-label="Select search engine"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-neutral-400" />
            <span className="hidden sm:inline">{activeEngine.name}</span>
            <ChevronDown className="w-3 h-3 text-neutral-400" />
          </button>

          {/* Engine Dropdown Popover */}
          {engineDropdownOpen && (
            <div
              className={`glass-panel absolute left-0 top-full mt-2 w-48 rounded-xl border p-1.5 z-50 shadow-2xl backdrop-blur-xl ${
                isDark
                  ? 'bg-neutral-900/95 border-white/15 text-neutral-200'
                  : 'bg-white/95 border-neutral-200 text-neutral-800'
              }`}
            >
              <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500 px-2 py-1">
                Search Engine
              </div>
              {Object.values(SEARCH_ENGINES).map((engine) => (
                <button
                  key={engine.id}
                  onClick={() => handleSelectEngine(engine.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left ${
                    engine.id === activeEngine.id
                      ? accentTheme.bgActive
                      : 'hover:bg-white/10 dark:hover:bg-white/5'
                  }`}
                >
                  <span className="font-medium">{engine.name}</span>
                  {engine.id === activeEngine.id && (
                    <span className={`w-1.5 h-1.5 rounded-full ${accentTheme.dotColor}`} />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!suggestionsOpen) setSuggestionsOpen(true);
          }}
          onFocus={() => {
            if (settings.showSearchSuggestions) setSuggestionsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={activeEngine.placeholder}
          className={`w-full bg-transparent text-sm sm:text-base outline-none font-medium transition-colors ${
            isDark
              ? 'text-white placeholder:text-neutral-400 caret-cyan-400'
              : 'text-neutral-900 placeholder:text-neutral-500 caret-cyan-600'
          }`}
          autoComplete="off"
          spellCheck="false"
        />

        {/* Clear Button */}
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className="p-1 rounded-lg text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Submit Search Button */}
        <button
          type="button"
          onClick={() => handleSearchSubmit()}
          aria-label="Submit search"
          className={`p-2 rounded-xl text-white transition-all ${accentTheme.buttonClass}`}
        >
          <Search className="w-4 h-4" />
        </button>
      </div>

      {/* Suggestions / Shortcuts / Recents Dropdown */}
      {suggestionsOpen && settings.showSearchSuggestions && (
        <div
          className={`glass-panel absolute left-0 right-0 top-full mt-2 rounded-2xl border p-3 z-40 shadow-2xl backdrop-blur-xl ${
            isDark
              ? 'bg-neutral-900/95 border-white/10 text-neutral-200'
              : 'bg-white/95 border-neutral-200 text-neutral-800'
          }`}
        >
          {/* Recent Searches */}
          {recentSearches.length > 0 && !query && (
            <div className="mb-3">
              <div className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider mb-1.5 px-1">
                Recent Searches
              </div>
              <div className="space-y-0.5">
                {recentSearches.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSearchSubmit(item)}
                    className="flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs hover:bg-white/10 dark:hover:bg-white/5 cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center gap-2 text-neutral-300">
                      <Clock className="w-3.5 h-3.5 text-neutral-500" />
                      <span>{item}</span>
                    </div>
                    <button
                      onClick={(e) => removeRecentSearch(e, item)}
                      className="opacity-0 group-hover:opacity-100 p-0.5 text-neutral-500 hover:text-rose-400 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Syntax Shortcuts */}
          <div>
            <div className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider mb-1.5 px-1 flex items-center justify-between">
              <span>Quick Engine Shortcuts</span>
              <span className="text-[10px] text-neutral-500 lowercase">Type prefix + query</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_SHORTCUTS.map((item) => (
                <button
                  key={item.prefix}
                  onClick={() => {
                    setQuery(`${item.prefix} `);
                    inputRef.current?.focus();
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 text-neutral-300 transition-colors"
                >
                  <span className="font-mono text-cyan-400 font-semibold">{item.prefix}</span>
                  <span>{item.label}</span>
                  <ArrowUpRight className="w-2.5 h-2.5 text-neutral-500" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
