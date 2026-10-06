import React from 'react';
import { Clock, User } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { ClockStyle } from '../../types';

export const ClockSettings: React.FC = () => {
  const { settings, updateSettings, accentTheme } = useSettings();

  return (
    <div className="space-y-6 text-xs text-neutral-300">
      {/* Clock Style */}
      <section>
        <h4 className="text-xs font-semibold text-neutral-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>Clock Typography & Style</span>
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {(['digital', 'minimal', 'large'] as ClockStyle[]).map((st) => (
            <button
              key={st}
              onClick={() => updateSettings({ clockStyle: st })}
              className={`py-2 px-3 rounded-xl border text-center capitalize transition-all font-medium ${
                settings.clockStyle === st
                  ? `${accentTheme.bgActive} border-cyan-500/50`
                  : 'bg-white/5 border-white/10 hover:bg-white/10 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </section>

      {/* Format Toggles */}
      <section className="space-y-3">
        <h4 className="text-xs font-semibold text-neutral-200 uppercase tracking-wider">
          Display Preferences
        </h4>

        {/* 24-Hour Toggle */}
        <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 cursor-pointer">
          <div>
            <div className="font-medium text-neutral-200">24-Hour Time Format</div>
            <div className="text-[11px] text-neutral-500">
              Display time as 14:30 instead of 2:30 PM
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.timeFormat24}
            onChange={(e) => updateSettings({ timeFormat24: e.target.checked })}
            className="w-4 h-4 rounded accent-cyan-500"
          />
        </label>

        {/* Seconds Toggle */}
        <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 cursor-pointer">
          <div>
            <div className="font-medium text-neutral-200">Show Seconds</div>
            <div className="text-[11px] text-neutral-500">Live ticking seconds indicator</div>
          </div>
          <input
            type="checkbox"
            checked={settings.showSeconds}
            onChange={(e) => updateSettings({ showSeconds: e.target.checked })}
            className="w-4 h-4 rounded accent-cyan-500"
          />
        </label>

        {/* Date Toggle */}
        <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 cursor-pointer">
          <div>
            <div className="font-medium text-neutral-200">Show Date</div>
            <div className="text-[11px] text-neutral-500">Day of the week and full date</div>
          </div>
          <input
            type="checkbox"
            checked={settings.showDate}
            onChange={(e) => updateSettings({ showDate: e.target.checked })}
            className="w-4 h-4 rounded accent-cyan-500"
          />
        </label>

        {/* Greeting Toggle */}
        <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 cursor-pointer">
          <div>
            <div className="font-medium text-neutral-200">Time-Aware Greeting</div>
            <div className="text-[11px] text-neutral-500">
              Display "Good morning / afternoon / evening"
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.showGreeting}
            onChange={(e) => updateSettings({ showGreeting: e.target.checked })}
            className="w-4 h-4 rounded accent-cyan-500"
          />
        </label>
      </section>

      {/* Greeting User Name */}
      {settings.showGreeting && (
        <section className="space-y-2">
          <label className="block text-xs font-semibold text-neutral-200 uppercase tracking-wider flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-cyan-400" />
            <span>Greeting Name</span>
          </label>
          <input
            type="text"
            value={settings.userName}
            onChange={(e) => updateSettings({ userName: e.target.value })}
            placeholder="e.g. Aditya"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-neutral-200 placeholder:text-neutral-500 outline-none focus:border-white/30"
          />
        </section>
      )}
    </div>
  );
};
