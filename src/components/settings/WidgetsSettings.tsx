import React from 'react';
import { LayoutGrid, ChevronUp, ChevronDown, RotateCcw } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { WidgetConfig, WidgetSize } from '../../types';
import { DEFAULT_WIDGETS } from '../../storage/settingsStorage';

export const WidgetsSettings: React.FC = () => {
  const { settings, updateWidgets, accentTheme } = useSettings();
  const widgets = [...settings.widgets].sort((a, b) => a.order - b.order);

  const toggleWidget = (id: string) => {
    const updated = widgets.map((w) =>
      w.id === id ? { ...w, enabled: !w.enabled } : w
    );
    updateWidgets(updated);
  };

  const changeSize = (id: string, size: WidgetSize) => {
    const updated = widgets.map((w) => (w.id === id ? { ...w, size } : w));
    updateWidgets(updated);
  };

  const moveUp = (index: number) => {
    if (index <= 0) return;
    const copy = [...widgets];
    const temp = copy[index - 1];
    copy[index - 1] = copy[index];
    copy[index] = temp;
    updateWidgets(copy.map((w, idx) => ({ ...w, order: idx })));
  };

  const moveDown = (index: number) => {
    if (index >= widgets.length - 1) return;
    const copy = [...widgets];
    const temp = copy[index + 1];
    copy[index + 1] = copy[index];
    copy[index] = temp;
    updateWidgets(copy.map((w, idx) => ({ ...w, order: idx })));
  };

  const handleResetLayout = () => {
    updateWidgets(DEFAULT_WIDGETS);
  };

  return (
    <div className="space-y-6 text-xs text-neutral-300">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-semibold text-neutral-200 uppercase tracking-wider flex items-center gap-1.5">
            <LayoutGrid className="w-3.5 h-3.5 text-cyan-400" />
            <span>Customize Dashboard Widgets</span>
          </h4>
          <p className="text-[11px] text-neutral-500 mt-0.5">
            Toggle visibility, adjust scale, and reorder dashboard modules
          </p>
        </div>
        <button
          onClick={handleResetLayout}
          title="Reset to default widget arrangement"
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      <div className="space-y-2">
        {widgets.map((widget, idx) => (
          <div
            key={widget.id}
            className={`p-3 rounded-xl border transition-all ${
              widget.enabled
                ? 'bg-white/5 border-white/10'
                : 'bg-black/20 border-white/5 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={widget.enabled}
                  onChange={() => toggleWidget(widget.id)}
                  className="w-4 h-4 rounded accent-cyan-500"
                />
                <span className="font-semibold text-neutral-200">{widget.name}</span>
              </label>

              {/* Order Controls */}
              <div className="flex items-center gap-1">
                <button
                  disabled={idx === 0}
                  onClick={() => moveUp(idx)}
                  className="p-1 rounded text-neutral-400 hover:text-white disabled:opacity-20 hover:bg-white/10"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  disabled={idx === widgets.length - 1}
                  onClick={() => moveDown(idx)}
                  className="p-1 rounded text-neutral-400 hover:text-white disabled:opacity-20 hover:bg-white/10"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Size Options */}
            {widget.enabled && widget.id !== 'clock' && (
              <div className="flex items-center gap-2 pt-1 border-t border-white/5 text-[11px]">
                <span className="text-neutral-500">Scale:</span>
                <div className="flex items-center gap-1">
                  {(['small', 'medium', 'large'] as WidgetSize[]).map((sz) => (
                    <button
                      key={sz}
                      onClick={() => changeSize(widget.id, sz)}
                      className={`px-2 py-0.5 rounded capitalize ${
                        widget.size === sz
                          ? `${accentTheme.bgActive} font-medium`
                          : 'bg-white/5 hover:bg-white/10 text-neutral-400'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
