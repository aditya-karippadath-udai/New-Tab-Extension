import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ExternalLink,
  Search,
  CheckSquare,
  Square,
  Plus,
  Bookmark,
  Sun,
  Moon,
  Timer,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useTasks } from '../context/TasksContext';
import { useFavorites } from '../context/FavoritesContext';
import { useBookmarks } from '../context/BookmarkContext';
import { useClock } from '../hooks/useClock';
import { getGreeting } from '../utils/dateUtils';
import { SEARCH_ENGINES } from '../utils/searchEngines';
import { getFaviconUrl } from '../utils/faviconUtils';
import { getBrowserTimeStats, BrowserTimeStats } from '../services/browserTimeService';
import { BookmarkFolderNode } from '../types/bookmark';

declare const chrome: any;

export const Popup: React.FC = () => {
  const { settings, updateSettings, effectiveTheme, accentTheme } = useSettings();
  const { tasks, addTask, toggleTask } = useTasks();
  const { favorites } = useFavorites();
  const { bookmarks } = useBookmarks();
  const { now, hours, minutes, period, formattedDate } = useClock(settings.timeFormat24, settings.showSeconds);

  const timeString = `${hours}:${minutes}${period ? ` ${period}` : ''}`;
  const greeting = getGreeting(settings.userName);

  const [searchQuery, setSearchQuery] = useState('');
  const [newTaskText, setNewTaskText] = useState('');
  const [browserStats, setBrowserStats] = useState<BrowserTimeStats | null>(null);
  const [activeTab, setActiveTab] = useState<'tasks' | 'links' | 'focus'>('tasks');

  useEffect(() => {
    getBrowserTimeStats().then(setBrowserStats);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const engine = SEARCH_ENGINES[settings.defaultSearchEngine] || SEARCH_ENGINES.google;
    const targetUrl = `${engine.url}${encodeURIComponent(searchQuery.trim())}`;
    if (typeof chrome !== 'undefined' && chrome.tabs?.create) {
      chrome.tabs.create({ url: targetUrl });
    } else {
      window.open(targetUrl, '_blank');
    }
  };

  const handleOpenNewTab = () => {
    if (typeof chrome !== 'undefined' && chrome.tabs?.create) {
      chrome.tabs.create({ url: chrome.runtime.getURL('index.html') });
    } else {
      window.open('index.html', '_blank');
    }
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    addTask(newTaskText.trim(), 'medium');
    setNewTaskText('');
  };

  const toggleTheme = () => {
    const next = effectiveTheme === 'dark' ? 'light' : 'dark';
    updateSettings({ theme: next });
  };

  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="w-[360px] min-h-[480px] max-h-[580px] flex flex-col bg-neutral-950 text-neutral-100 font-sans border border-neutral-800 shadow-2xl overflow-hidden select-none">
      {/* Top Header */}
      <header className="px-4 py-3 bg-neutral-900/80 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div>
            <div className="text-xs font-bold tracking-tight text-white flex items-center gap-1.5">
              <span>{settings.userName || 'AuraTab'}</span>
            </div>
            <div className="text-[10px] text-neutral-400 font-mono leading-none">
              {greeting}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={toggleTheme}
            title="Toggle theme"
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            {effectiveTheme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5" />
            )}
          </button>
          <button
            onClick={handleOpenNewTab}
            title="Open Full Dashboard in New Tab"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 transition-colors cursor-pointer"
          >
            <span>Open Tab</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </header>

      {/* Clock Banner */}
      <div className="px-4 py-3 bg-gradient-to-b from-neutral-900/50 to-transparent flex items-center justify-between border-b border-white/5">
        <div>
          <div className="text-2xl font-bold font-mono tracking-tight text-white leading-none">
            {timeString}
          </div>
          <div className="text-[11px] text-neutral-400 mt-0.5">
            {formattedDate}
          </div>
        </div>
        {browserStats && (
          <div className="text-right">
            <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">Active Today</div>
            <div className="text-xs font-mono font-medium text-cyan-300">
              {browserStats.focusMinutesCompleted}m focus · #{browserStats.sessionsCount}
            </div>
          </div>
        )}
      </div>

      {/* Quick Search */}
      <div className="px-4 py-2">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${SEARCH_ENGINES[settings.defaultSearchEngine]?.name || 'web'}...`}
            className="w-full bg-white/5 hover:bg-white/10 focus:bg-neutral-900 border border-white/10 focus:border-cyan-500/50 rounded-xl pl-8 pr-8 py-1.5 text-xs text-neutral-200 placeholder:text-neutral-500 outline-none transition-all"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-1"
          >
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </form>
      </div>

      {/* Tabs */}
      <div className="px-4 flex items-center border-b border-white/10 text-xs">
        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex items-center gap-1.5 py-2 px-3 border-b-2 font-medium transition-colors cursor-pointer ${
            activeTab === 'tasks'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <CheckSquare className="w-3.5 h-3.5" />
          <span>Tasks ({pendingTasks.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('links')}
          className={`flex items-center gap-1.5 py-2 px-3 border-b-2 font-medium transition-colors cursor-pointer ${
            activeTab === 'links'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Quick Links</span>
        </button>
        <button
          onClick={() => setActiveTab('focus')}
          className={`flex items-center gap-1.5 py-2 px-3 border-b-2 font-medium transition-colors cursor-pointer ${
            activeTab === 'focus'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Timer className="w-3.5 h-3.5" />
          <span>Focus</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {activeTab === 'tasks' && (
          <div className="space-y-3">
            {/* Quick Add Form */}
            <form onSubmit={handleAddTask} className="flex items-center gap-1.5">
              <input
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder="Add task for today..."
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-neutral-100 placeholder:text-neutral-500 outline-none focus:border-cyan-500/50"
              />
              <button
                type="submit"
                disabled={!newTaskText.trim()}
                className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/30 disabled:opacity-40 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Tasks List */}
            <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
              {tasks.length === 0 ? (
                <div className="text-center py-6 text-neutral-500 text-xs">
                  No tasks yet. Add one above!
                </div>
              ) : (
                tasks.slice(0, 10).map((task) => (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className="flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer transition-colors"
                  >
                    <button type="button" className="text-neutral-400 hover:text-cyan-400">
                      {task.completed ? (
                        <CheckSquare className="w-3.5 h-3.5 text-cyan-400" />
                      ) : (
                        <Square className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <span
                      className={`text-xs flex-1 truncate ${
                        task.completed ? 'line-through text-neutral-500' : 'text-neutral-200'
                      }`}
                    >
                      {task.text}
                    </span>
                  </div>
                ))
              )}
            </div>

            {completedCount > 0 && (
              <div className="text-[10px] text-neutral-500 text-right">
                {completedCount} task{completedCount > 1 ? 's' : ''} completed
              </div>
            )}
          </div>
        )}

        {activeTab === 'links' && (
          <div className="space-y-3">
            <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
              Favourites
            </div>
            <div className="grid grid-cols-2 gap-2">
              {favorites.slice(0, 8).map((fav) => (
                <a
                  key={fav.id}
                  href={fav.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-neutral-300 hover:text-white transition-colors"
                >
                  <img
                    src={getFaviconUrl(fav.url)}
                    alt=""
                    className="w-4 h-4 rounded"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                  <span className="truncate">{fav.title}</span>
                </a>
              ))}
            </div>

            {bookmarks.length > 0 && (
              <>
                <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider pt-2 border-t border-white/5">
                  Top Bookmark Folders
                </div>
                <div className="space-y-1">
                  {bookmarks.slice(0, 4).map((folder: BookmarkFolderNode) => (
                    <div
                      key={folder.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-white/5 text-xs text-neutral-300"
                    >
                      <div className="flex items-center gap-1.5">
                        <Bookmark className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{folder.title}</span>
                      </div>
                      <span className="text-[10px] text-neutral-500 font-mono">
                        {folder.children?.length || 0} items
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'focus' && (
          <div className="flex flex-col items-center justify-center py-4 space-y-4 text-center">
            <div className="w-16 h-16 rounded-full bg-cyan-500/10 border-2 border-cyan-500/40 flex items-center justify-center">
              <Clock className="w-8 h-8 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">BrowserTime & Focus Mode</div>
              <p className="text-[11px] text-neutral-400 max-w-[240px] mt-1">
                Run uninterrupted Pomodoro sessions and track your daily productivity with AuraTab.
              </p>
            </div>

            <button
              onClick={handleOpenNewTab}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500 text-black hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              Open Focus Timer in Dashboard
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="px-4 py-2 bg-neutral-900/60 border-t border-white/10 flex items-center justify-between text-[10px] text-neutral-500">
        <span>AuraTab Extension v1.0.0</span>
        <button
          onClick={handleOpenNewTab}
          className="hover:text-cyan-400 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <span>Dashboard</span>
          <ArrowUpRight className="w-2.5 h-2.5" />
        </button>
      </footer>
    </div>
  );
};

export default Popup;
