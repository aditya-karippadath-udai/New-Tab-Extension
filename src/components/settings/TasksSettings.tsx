import React, { useRef } from 'react';
import { CheckSquare, Bookmark, Download, Upload, RotateCcw, AlertTriangle } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useTasks } from '../../context/TasksContext';

export const TasksSettings: React.FC = () => {
  const { settings, updateSettings, resetAllSettings, accentTheme } = useSettings();
  const { clearCompleted, stats } = useTasks();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(settings, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `auratab-backup-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        updateSettings(imported);
      } catch (err) {
        alert('Invalid backup configuration file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 text-xs text-neutral-300">
      {/* Task Preferences */}
      <section className="space-y-3">
        <h4 className="text-xs font-semibold text-neutral-200 uppercase tracking-wider flex items-center gap-1.5">
          <CheckSquare className="w-3.5 h-3.5 text-cyan-400" />
          <span>Task Preferences</span>
        </h4>

        {/* Progress Bar Toggle */}
        <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 cursor-pointer">
          <div>
            <div className="font-medium text-neutral-200">Show Task Progress Bar</div>
            <div className="text-[11px] text-neutral-500">
              Display completion ratio and colored progress bar
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.showTaskProgress}
            onChange={(e) => updateSettings({ showTaskProgress: e.target.checked })}
            className="w-4 h-4 rounded accent-cyan-500"
          />
        </label>

        {/* Default Filter */}
        <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 space-y-1.5">
          <div className="font-medium text-neutral-200">Default Filter on Launch</div>
          <div className="grid grid-cols-4 gap-1.5 pt-1">
            {(['all', 'active', 'completed', 'today'] as const).map((flt) => (
              <button
                key={flt}
                onClick={() => updateSettings({ defaultTaskFilter: flt })}
                className={`py-1.5 rounded-lg capitalize font-medium text-center transition-colors ${
                  settings.defaultTaskFilter === flt
                    ? `${accentTheme.bgActive} border-cyan-500/40`
                    : 'bg-white/5 hover:bg-white/10 text-neutral-400'
                }`}
              >
                {flt}
              </button>
            ))}
          </div>
        </div>

        {/* Clear Completed Action */}
        {stats.completed > 0 && (
          <button
            onClick={clearCompleted}
            className="w-full py-2 px-3 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-medium transition-colors text-center"
          >
            Clear {stats.completed} Completed Tasks
          </button>
        )}
      </section>

      {/* Favorites Preferences */}
      <section className="space-y-3 pt-2 border-t border-white/10">
        <h4 className="text-xs font-semibold text-neutral-200 uppercase tracking-wider flex items-center gap-1.5">
          <Bookmark className="w-3.5 h-3.5 text-cyan-400" />
          <span>Favourite Pages</span>
        </h4>

        <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 cursor-pointer">
          <div>
            <div className="font-medium text-neutral-200">Open Links in New Tab</div>
            <div className="text-[11px] text-neutral-500">
              Launch shortcut targets in a new browser tab
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.openFavoritesInNewTab}
            onChange={(e) => updateSettings({ openFavoritesInNewTab: e.target.checked })}
            className="w-4 h-4 rounded accent-cyan-500"
          />
        </label>
      </section>

      {/* Backup & Reset */}
      <section className="space-y-3 pt-2 border-t border-white/10">
        <h4 className="text-xs font-semibold text-neutral-200 uppercase tracking-wider">
          Backup & Maintenance
        </h4>

        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Config</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImport}
            accept=".json"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-200 transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import Config</span>
          </button>
        </div>

        <button
          onClick={resetAllSettings}
          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-white/10 bg-white/5 hover:bg-rose-500/10 hover:border-rose-500/30 text-neutral-400 hover:text-rose-300 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to Default</span>
        </button>
      </section>
    </div>
  );
};
