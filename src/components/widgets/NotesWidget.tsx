import React from 'react';
import { FileText } from 'lucide-react';
import { WidgetContainer } from './WidgetContainer';
import { useSettings } from '../../context/SettingsContext';

export const NotesWidget: React.FC = () => {
  const { settings, updateSettings } = useSettings();

  return (
    <WidgetContainer
      id="notes-widget"
      title="Quick Scratchpad"
      icon={<FileText className="w-3.5 h-3.5" />}
    >
      <textarea
        value={settings.quickNotes || ''}
        onChange={(e) => updateSettings({ quickNotes: e.target.value })}
        placeholder="Type quick thoughts, temporary links, or ideas here..."
        rows={4}
        className="w-full bg-white dark:bg-black/20 border border-neutral-300 dark:border-white/10 rounded-xl p-2.5 text-xs text-neutral-900 dark:text-neutral-200 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 outline-none focus:border-cyan-500 dark:focus:border-white/30 resize-none font-mono"
      />
      <div className="flex justify-between items-center text-[10px] text-neutral-600 dark:text-neutral-500 mt-1">
        <span>Saved locally in browser storage</span>
        <span>{(settings.quickNotes || '').length} characters</span>
      </div>
    </WidgetContainer>
  );
};
