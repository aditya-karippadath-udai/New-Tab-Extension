import React from 'react';
import { useClock } from '../../hooks/useClock';
import { useSettings } from '../../context/SettingsContext';
import { getGreeting } from '../../utils/dateUtils';
import { SpeedometerClock } from './SpeedometerClock';
import { Gauge, Clock as ClockIcon } from 'lucide-react';

export const ClockWidget: React.FC = () => {
  const { settings, updateSettings, accentTheme, effectiveTheme } = useSettings();
  const {
    clockType,
    timeFormat24,
    showSeconds,
    showDate,
    showGreeting,
    userName,
    clockStyle,
  } = settings;

  const {
    hours,
    minutes,
    seconds,
    period,
    formattedDate,
  } = useClock(timeFormat24, showSeconds);

  const greetingText = getGreeting(userName);
  const isDark = effectiveTheme === 'dark';

  const toggleClockType = () => {
    updateSettings({
      clockType: clockType === 'analog' ? 'digital' : 'analog',
    });
  };

  return (
    <div className="relative group w-full flex flex-col items-center">
      {/* Clock Mode Switcher Pills (Digital / Speedometer) */}
      <div className="mb-2 flex items-center gap-1 p-0.5 rounded-xl bg-black/20 dark:bg-black/30 border border-white/5 opacity-80 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => updateSettings({ clockType: 'digital' })}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            clockType === 'digital'
              ? `${accentTheme.bgActive} shadow-xs font-semibold`
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <ClockIcon className="w-3.5 h-3.5" />
          <span>Digital</span>
        </button>

        <button
          onClick={() => updateSettings({ clockType: 'analog' })}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            clockType === 'analog'
              ? `${accentTheme.bgActive} shadow-xs font-semibold`
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Gauge className="w-3.5 h-3.5" />
          <span>Speedometer Analog</span>
        </button>
      </div>

      {/* Render Analog Speedometer or Digital Clock */}
      {clockType === 'analog' ? (
        <SpeedometerClock onToggleMode={toggleClockType} />
      ) : clockStyle === 'minimal' ? (
        <div className="flex flex-col items-center justify-center text-center select-none py-2">
          <div className="flex items-baseline gap-2 font-mono tabular-nums tracking-tight">
            <span className={`text-4xl sm:text-5xl font-light ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              {hours}:{minutes}
            </span>
            {showSeconds && (
              <span className={`text-xl sm:text-2xl font-light ${accentTheme.textColor}`}>
                :{seconds}
              </span>
            )}
            {period && (
              <span className="text-xs sm:text-sm font-medium tracking-wider text-neutral-400">
                {period}
              </span>
            )}
          </div>

          {showDate && (
            <div className="mt-1 text-xs sm:text-sm font-medium text-neutral-400 tracking-wide">
              {formattedDate}
            </div>
          )}

          {showGreeting && (
            <div className="mt-1 text-xs text-neutral-400/90 font-normal">
              {greetingText}
            </div>
          )}
        </div>
      ) : clockStyle === 'large' ? (
        <div className="flex flex-col items-center justify-center text-center select-none py-4 sm:py-6">
          <div className="flex items-baseline justify-center gap-2 font-mono tabular-nums tracking-tighter">
            <span className={`text-6xl sm:text-7xl md:text-8xl font-bold tracking-tight drop-shadow-md ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              {hours}:{minutes}
            </span>
            {showSeconds && (
              <span className={`text-2xl sm:text-3xl md:text-4xl font-semibold ${accentTheme.textColor}`}>
                :{seconds}
              </span>
            )}
            {period && (
              <span className="text-sm sm:text-base font-semibold tracking-wider text-neutral-400 self-center">
                {period}
              </span>
            )}
          </div>

          {showDate && (
            <div className="mt-2 text-sm sm:text-base font-medium text-neutral-300 dark:text-neutral-300 text-neutral-600 tracking-wide">
              {formattedDate}
            </div>
          )}

          {showGreeting && (
            <div className="mt-2 text-sm text-neutral-400 font-normal">
              {greetingText}
            </div>
          )}
        </div>
      ) : (
        // Default 'digital' style
        <div className="flex flex-col items-center justify-center text-center select-none py-2 sm:py-3">
          <div className="flex items-baseline justify-center gap-2 font-mono tabular-nums">
            <span
              className={`text-5xl sm:text-6xl font-bold tracking-tight drop-shadow-sm ${
                isDark ? 'text-neutral-100' : 'text-neutral-900'
              }`}
            >
              {hours}:{minutes}
            </span>
            {showSeconds && (
              <span className={`text-xl sm:text-2xl font-medium ${accentTheme.textColor}`}>
                :{seconds}
              </span>
            )}
            {period && (
              <span className="text-xs sm:text-sm font-semibold tracking-wider text-neutral-400 self-center">
                {period}
              </span>
            )}
          </div>

          {showDate && (
            <div className="mt-1.5 text-xs sm:text-sm font-medium tracking-wide text-neutral-400 dark:text-neutral-300">
              {formattedDate}
            </div>
          )}

          {showGreeting && (
            <div className="mt-1 text-xs text-neutral-400 font-normal">
              {greetingText}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
