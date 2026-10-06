import React, { useState } from 'react';
import {
  X,
  Palette,
  Clock,
  LayoutGrid,
  Search,
  CheckSquare,
  Sliders,
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { AppearanceSettings } from './AppearanceSettings';
import { ClockSettings } from './ClockSettings';
import { WidgetsSettings } from './WidgetsSettings';
import { SearchSettings } from './SearchSettings';
import { TasksSettings } from './TasksSettings';

type SettingsTab = 'appearance' | 'clock' | 'widgets' | 'search' | 'tasks';

export const SettingsDrawer: React.FC = () => {
  const { isSettingsOpen, setIsSettingsOpen, effectiveTheme, accentTheme } = useSettings();
  const [activeTab, setActiveTab] = useState<SettingsTab>('appearance');

  if (!isSettingsOpen) return null;

  const isDark = effectiveTheme === 'dark';

  const TABS = [
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'clock', label: 'Clock', icon: Clock },
    { id: 'widgets', label: 'Widgets', icon: LayoutGrid },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'tasks', label: 'Preferences', icon: CheckSquare },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={() => setIsSettingsOpen(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Drawer */}
      <div
        className={`relative z-10 w-full max-w-md h-full flex flex-col border-l shadow-2xl glass-panel transition-all duration-300 ${
          isDark
            ? 'bg-neutral-950/95 border-white/10 text-neutral-100'
            : 'bg-white/95 border-neutral-200 text-neutral-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 dark:border-white/10 border-neutral-200">
          <div className="flex items-center gap-2">
            <Sliders className={`w-4 h-4 ${accentTheme.textColor}`} />
            <h3 className="font-semibold text-sm tracking-wide">
              Dashboard Settings
            </h3>
          </div>
          <button
            onClick={() => setIsSettingsOpen(false)}
            aria-label="Close settings"
            className="p-1.5 rounded-xl text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 p-2 border-b border-white/5 dark:border-white/10 border-neutral-200 overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as SettingsTab)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? `${accentTheme.bgActive} shadow-xs font-semibold`
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'appearance' && <AppearanceSettings />}
          {activeTab === 'clock' && <ClockSettings />}
          {activeTab === 'widgets' && <WidgetsSettings />}
          {activeTab === 'search' && <SearchSettings />}
          {activeTab === 'tasks' && <TasksSettings />}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 text-center text-[11px] text-neutral-500">
          <span>AuraTab · Chromium & Firefox Extension · 100% Offline & Private</span>
        </div>
      </div>
    </div>
  );
};
