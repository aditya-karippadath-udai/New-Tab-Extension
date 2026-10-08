import { useEffect } from 'react';

interface KeyboardShortcutHandlers {
  onFocusSearch?: () => void;
  onFocusTask?: () => void;
  onCloseOverlays?: () => void;
  onToggleSettings?: () => void;
  onToggleBookmarks?: () => void;
}

export function useKeyboardShortcuts({
  onFocusSearch,
  onFocusTask,
  onCloseOverlays,
  onToggleSettings,
  onToggleBookmarks,
}: KeyboardShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput =
        activeEl instanceof HTMLInputElement ||
        activeEl instanceof HTMLTextAreaElement ||
        (activeEl && (activeEl as HTMLElement).isContentEditable);

      // Escape always closes overlays
      if (e.key === 'Escape') {
        if (onCloseOverlays) {
          onCloseOverlays();
          e.preventDefault();
        }
        return;
      }

      // Ctrl/Cmd + K: Focus Search
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onFocusSearch?.();
        return;
      }

      // Ctrl/Cmd + ,: Open Settings
      if ((e.metaKey || e.ctrlKey) && e.key === ',') {
        e.preventDefault();
        onToggleSettings?.();
        return;
      }

      // If already focused in input, do not trigger single letter shortcuts
      if (isInput) return;

      // '/' key to focus search
      if (e.key === '/') {
        e.preventDefault();
        onFocusSearch?.();
        return;
      }

      // 'T' or 't' key to focus tasks
      if (e.key.toLowerCase() === 't' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        onFocusTask?.();
        return;
      }

      // 'B' or 'b' key to toggle bookmarks explorer
      if (e.key.toLowerCase() === 'b' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        onToggleBookmarks?.();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onFocusSearch, onFocusTask, onCloseOverlays, onToggleSettings, onToggleBookmarks]);
}
