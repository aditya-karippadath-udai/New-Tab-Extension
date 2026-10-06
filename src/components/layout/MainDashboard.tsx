import React, { useRef } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { TopBar } from './TopBar';
import { ClockWidget } from '../widgets/ClockWidget';
import { SearchWidget } from '../widgets/SearchWidget';
import { CalendarWidget } from '../widgets/CalendarWidget';
import { TasksWidget } from '../widgets/TasksWidget';
import { FavoritesWidget } from '../widgets/FavoritesWidget';
import { NotesWidget } from '../widgets/NotesWidget';
import { SettingsDrawer } from '../settings/SettingsDrawer';
import { WidgetType } from '../../types';

export const MainDashboard: React.FC = () => {
  const { settings, isSettingsOpen, setIsSettingsOpen } = useSettings();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const taskInputRef = useRef<HTMLInputElement>(null);

  // Setup keyboard shortcuts: '/', 'T', 'Esc', 'Cmd+K', 'Cmd+,'
  useKeyboardShortcuts({
    onFocusSearch: () => {
      searchInputRef.current?.focus();
    },
    onFocusTask: () => {
      taskInputRef.current?.focus();
    },
    onCloseOverlays: () => {
      if (isSettingsOpen) {
        setIsSettingsOpen(false);
      }
    },
    onToggleSettings: () => {
      setIsSettingsOpen(!isSettingsOpen);
    },
  });

  // Check which widgets are enabled
  const isWidgetEnabled = (id: WidgetType) => {
    const found = settings.widgets.find((w) => w.id === id);
    return found ? found.enabled : true;
  };

  const getWidgetSize = (id: WidgetType) => {
    const found = settings.widgets.find((w) => w.id === id);
    return found ? found.size : 'medium';
  };

  const isSearchEnabled = isWidgetEnabled('search');
  const isClockEnabled = isWidgetEnabled('clock');
  const isCalendarEnabled = isWidgetEnabled('calendar');
  const isTasksEnabled = isWidgetEnabled('tasks');
  const isFavoritesEnabled = isWidgetEnabled('favorites');
  const isNotesEnabled = isWidgetEnabled('notes');

  // Layout density spacing
  const spacingClass =
    settings.density === 'compact'
      ? 'space-y-4 md:space-y-6'
      : settings.density === 'spacious'
      ? 'space-y-8 md:space-y-12'
      : 'space-y-6 md:space-y-8';

  return (
    <div className="relative min-h-screen flex flex-col justify-between">
      {/* Top Bar with brand and controls */}
      <TopBar onOpenSettings={() => setIsSettingsOpen(true)} />

      {/* Main Center Content Container */}
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 flex-1 flex flex-col justify-center">
        <div className={`w-full ${spacingClass}`}>
          {/* 1. Search Bar */}
          {isSearchEnabled && (
            <div className="w-full">
              <SearchWidget inputRef={searchInputRef} />
            </div>
          )}

          {/* 2. Clock & Date & Greeting */}
          {isClockEnabled && (
            <div className="w-full">
              <ClockWidget />
            </div>
          )}

          {/* 3. Middle Section: Calendar & Tasks */}
          {(isCalendarEnabled || isTasksEnabled) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-start">
              {isCalendarEnabled && (
                <div className="w-full">
                  <CalendarWidget />
                </div>
              )}
              {isTasksEnabled && (
                <div className="w-full">
                  <TasksWidget inputRef={taskInputRef} />
                </div>
              )}
            </div>
          )}

          {/* 4. Favourite Pages */}
          {isFavoritesEnabled && (
            <div className="w-full">
              <FavoritesWidget />
            </div>
          )}

          {/* 5. Optional Notes / Scratchpad */}
          {isNotesEnabled && (
            <div className="w-full">
              <NotesWidget />
            </div>
          )}
        </div>
      </main>

      {/* Subtle bottom footer with quiet copyright & settings shortcut */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between text-[11px] text-neutral-400 select-none">
        <div>
          <span>AuraTab</span>
          <span className="mx-1.5 opacity-40">·</span>
          <span>Fast, Minimal & Private</span>
        </div>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="hover:text-neutral-200 transition-colors cursor-pointer"
        >
          Preferences (Ctrl+,)
        </button>
      </footer>

      {/* Customization Drawer */}
      <SettingsDrawer />
    </div>
  );
};
