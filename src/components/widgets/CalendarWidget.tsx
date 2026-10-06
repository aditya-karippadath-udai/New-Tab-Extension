import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, RotateCcw } from 'lucide-react';
import { WidgetContainer } from './WidgetContainer';
import { useSettings } from '../../context/SettingsContext';
import { useTasks } from '../../context/TasksContext';
import {
  WEEKDAYS,
  MONTHS,
  getDaysInMonth,
  getFirstDayOfMonth,
  isSameDay,
  formatDateToIso,
} from '../../utils/dateUtils';

export const CalendarWidget: React.FC = () => {
  const { accentTheme } = useSettings();
  const { tasks } = useTasks();

  const today = new Date();
  const [viewDate, setViewDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const currentYear = viewDate.getFullYear();
  const currentMonthIndex = viewDate.getMonth();

  const daysInCurrentMonth = getDaysInMonth(currentYear, currentMonthIndex);
  const firstDayOffset = getFirstDayOfMonth(currentYear, currentMonthIndex);

  // Previous month tail days
  const prevMonthIndex = currentMonthIndex === 0 ? 11 : currentMonthIndex - 1;
  const prevMonthYear = currentMonthIndex === 0 ? currentYear - 1 : currentYear;
  const daysInPrevMonth = getDaysInMonth(prevMonthYear, prevMonthIndex);

  const prevMonthDays: number[] = [];
  for (let i = firstDayOffset - 1; i >= 0; i--) {
    prevMonthDays.push(daysInPrevMonth - i);
  }

  // Current month days
  const currentMonthDays = Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1);

  // Next month lead days to fill 35 or 42 grid cells
  const totalCells = prevMonthDays.length + currentMonthDays.length;
  const trailingCells = (7 - (totalCells % 7)) % 7;
  const nextMonthDays = Array.from({ length: trailingCells }, (_, i) => i + 1);

  const handlePrevMonth = () => {
    setViewDate(new Date(currentYear, currentMonthIndex - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(currentYear, currentMonthIndex + 1, 1));
  };

  const handleTodayClick = () => {
    const now = new Date();
    setViewDate(now);
    setSelectedDate(now);
  };

  // Find if date has tasks
  const hasTasksOnDate = (year: number, month: number, day: number) => {
    const iso = formatDateToIso(new Date(year, month, day));
    return tasks.some((t) => t.dueDate === iso && !t.completed);
  };

  return (
    <WidgetContainer
      id="calendar-widget"
      title="Calendar"
      icon={<CalendarIcon className="w-3.5 h-3.5" />}
      headerAction={
        <div className="flex items-center gap-1">
          <button
            onClick={handleTodayClick}
            title="Jump to Today"
            className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-medium text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            <span>Today</span>
          </button>
          <div className="flex items-center">
            <button
              onClick={handlePrevMonth}
              aria-label="Previous month"
              className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleNextMonth}
              aria-label="Next month"
              className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      }
    >
      <div className="select-none">
        {/* Month & Year Banner */}
        <div className="text-center font-medium text-xs sm:text-sm text-neutral-200 mb-2.5 flex items-center justify-center gap-1.5">
          <span>{MONTHS[currentMonthIndex]}</span>
          <span className="font-mono text-neutral-400 tabular-nums">{currentYear}</span>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-neutral-500 mb-1">
          {WEEKDAYS.map((wd) => (
            <div key={wd} className="py-0.5">
              {wd}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {/* Prev month days */}
          {prevMonthDays.map((d) => (
            <div
              key={`prev-${d}`}
              className="py-1 text-neutral-600 dark:text-neutral-600 font-mono text-[11px]"
            >
              {d}
            </div>
          ))}

          {/* Current month days */}
          {currentMonthDays.map((d) => {
            const thisDate = new Date(currentYear, currentMonthIndex, d);
            const isToday = isSameDay(thisDate, today);
            const isSelected = isSameDay(thisDate, selectedDate);
            const hasTasks = hasTasksOnDate(currentYear, currentMonthIndex, d);

            return (
              <button
                key={`curr-${d}`}
                onClick={() => setSelectedDate(thisDate)}
                className={`relative py-1 rounded-lg font-mono text-xs transition-all flex flex-col items-center justify-center ${
                  isSelected
                    ? `${accentTheme.buttonClass} font-bold`
                    : isToday
                    ? 'border border-cyan-400/80 text-cyan-300 font-semibold bg-cyan-950/30'
                    : 'text-neutral-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span>{d}</span>
                {/* Dot for tasks indicator */}
                {hasTasks && (
                  <span
                    className={`absolute bottom-0.5 w-1 h-1 rounded-full ${
                      isSelected ? 'bg-white' : accentTheme.dotColor
                    }`}
                  />
                )}
              </button>
            );
          })}

          {/* Next month days */}
          {nextMonthDays.map((d) => (
            <div
              key={`next-${d}`}
              className="py-1 text-neutral-600 dark:text-neutral-600 font-mono text-[11px]"
            >
              {d}
            </div>
          ))}
        </div>
      </div>
    </WidgetContainer>
  );
};
