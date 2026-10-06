import React from 'react';
import { useClock } from '../../hooks/useClock';
import { useSettings } from '../../context/SettingsContext';
import { getGreeting } from '../../utils/dateUtils';

export const ClockWidget: React.FC = () => {
  const { settings, accentTheme, effectiveTheme } = useSettings();
  const {
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

  if (clockStyle === 'minimal') {
    return (
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
    );
  }

  if (clockStyle === 'large') {
    return (
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
    );
  }

  // Default 'digital' style
  return (
    <div className="flex flex-col items-center justify-center text-center select-none py-2 sm:py-3">
      {/* Time Display */}
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

      {/* Date */}
      {showDate && (
        <div className="mt-1.5 text-xs sm:text-sm font-medium tracking-wide text-neutral-400 dark:text-neutral-300">
          {formattedDate}
        </div>
      )}

      {/* Greeting */}
      {showGreeting && (
        <div className="mt-1 text-xs text-neutral-400 font-normal">
          {greetingText}
        </div>
      )}
    </div>
  );
};
