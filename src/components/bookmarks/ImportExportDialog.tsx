import React, { useRef, useState } from 'react';
import { X, Download, Upload, Globe, Check, AlertCircle } from 'lucide-react';
import { useBookmarks } from '../../context/BookmarkContext';
import { useSettings } from '../../context/SettingsContext';

export const ImportExportDialog: React.FC = () => {
  const {
    dialogState,
    closeDialog,
    exportBookmarksJson,
    importBookmarksJson,
    importFromBrowserApi,
    isBrowserApiSupported,
  } = useBookmarks();
  const { accentTheme } = useSettings();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (dialogState.type !== 'import-export') {
    return null;
  }

  const handleExport = () => {
    const json = exportBookmarksJson();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(json);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `auratab-bookmarks-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setStatusMessage({ type: 'success', text: 'Bookmarks exported successfully!' });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importBookmarksJson(content, importMode);
      if (res.success) {
        setStatusMessage({
          type: 'success',
          text: `Successfully imported ${res.count || ''} bookmarks (${importMode === 'replace' ? 'replaced' : 'merged'}).`,
        });
      } else {
        setStatusMessage({ type: 'error', text: res.error || 'Failed to import bookmark file.' });
      }
    };
    reader.readAsText(file);
  };

  const handleBrowserImport = async () => {
    setStatusMessage(null);
    const res = await importFromBrowserApi();
    if (res.success) {
      setStatusMessage({
        type: 'success',
        text: `Imported ${res.count || ''} browser bookmarks into your hierarchy!`,
      });
    } else {
      setStatusMessage({
        type: 'error',
        text: res.error || 'Native browser bookmark import unavailable in this browser session.',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl glass-panel bg-neutral-900/95 border border-white/15 p-5 shadow-2xl text-neutral-200">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
          <h3 className="text-sm font-semibold text-neutral-100 flex items-center gap-2">
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Bookmark Backup & Migration</span>
          </h3>
          <button
            onClick={closeDialog}
            className="p-1 rounded-lg text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {statusMessage && (
          <div
            className={`p-3 rounded-xl mb-4 text-xs flex items-center gap-2 border ${
              statusMessage.type === 'success'
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <div className="space-y-5 text-xs text-neutral-300">
          {/* Export section */}
          <section className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-2">
            <div className="font-semibold text-neutral-100 flex items-center gap-1.5">
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Export Bookmarks to JSON</span>
            </div>
            <p className="text-[11px] text-neutral-400">
              Download your complete hierarchical bookmark tree as a portable JSON file.
            </p>
            <button
              onClick={handleExport}
              className={`px-3 py-1.5 rounded-xl font-medium text-white transition-all cursor-pointer ${accentTheme.buttonClass}`}
            >
              Export Bookmarks
            </button>
          </section>

          {/* Import JSON section */}
          <section className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-3">
            <div className="font-semibold text-neutral-100 flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-amber-400" />
              <span>Import Bookmarks from JSON</span>
            </div>
            <p className="text-[11px] text-neutral-400">
              Select how to import incoming bookmark folders:
            </p>

            <div className="grid grid-cols-2 gap-2">
              <label
                onClick={() => setImportMode('merge')}
                className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                  importMode === 'merge'
                    ? `${accentTheme.bgActive} border-cyan-500/40 font-medium`
                    : 'bg-black/30 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="font-semibold text-neutral-200">Merge with existing</div>
                <div className="text-[10px] text-neutral-400 mt-0.5">
                  Append new folders safely without deleting existing ones
                </div>
              </label>

              <label
                onClick={() => setImportMode('replace')}
                className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                  importMode === 'replace'
                    ? 'bg-rose-500/20 text-rose-200 border-rose-500/40 font-medium'
                    : 'bg-black/30 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="font-semibold text-neutral-200">Replace all bookmarks</div>
                <div className="text-[10px] text-neutral-400 mt-0.5">
                  Overwrite entire tree with imported file
                </div>
              </label>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Select JSON File</span>
            </button>
          </section>

          {/* Browser Bookmarks Import */}
          <section className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-2">
            <div className="font-semibold text-neutral-100 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>Import Browser Bookmarks</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/10 text-neutral-300 font-mono">
                {isBrowserApiSupported ? 'Extension Active' : 'Native Browser'}
              </span>
            </div>
            <p className="text-[11px] text-neutral-400">
              Directly synchronize bookmarks from your Chrome or Firefox browser instance into a dedicated folder.
            </p>
            <button
              onClick={handleBrowserImport}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium transition-colors cursor-pointer"
            >
              Import from Browser
            </button>
          </section>
        </div>

        <div className="flex justify-end pt-4 mt-2 border-t border-white/10">
          <button
            onClick={closeDialog}
            className="px-4 py-1.5 rounded-xl text-xs font-medium text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
