import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  RotateCcw,
  Plus,
  Trash2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { WidgetContainer } from './WidgetContainer';
import { useSettings } from '../../context/SettingsContext';
import { useTasks } from '../../context/TasksContext';
import { useEvents } from '../../context/EventContext';
import {
  WEEKDAYS,
  MONTHS,
  getDaysInMonth,
  getFirstDayOfMonth,
  isSameDay,
  formatDateToIso,
} from '../../utils/dateUtils';
import { calculateCountdown } from '../../utils/countdownUtils';

export const CalendarWidget: React.FC = () => {
  const { accentTheme } = useSettings();
  const { tasks } = useTasks();
  const { events, deleteEvent, selectActiveEvent, activeEventId, openAddModal } = useEvents();

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

  const selectedDateIso = formatDateToIso(selectedDate);

  // Find if date has tasks
  const hasTasksOnDate = (year: number, month: number, day: number) => {
    const iso = formatDateToIso(new Date(year, month, day));
    return tasks.some((t) => t.dueDate === iso && !t.completed);
  };

  // Find events on date
  const getEventsOnDate = (year: number, month: number, day: number) => {
    const iso = formatDateToIso(new Date(year, month, day));
    return events.filter((e) => e.date === iso);
  };

  const selectedDayEvents = events.filter((e) => e.date === selectedDateIso);

  return (
    <WidgetContainer
      id="calendar-widget"
      title="Calendar"
      icon={<CalendarIcon className="w-3.5 h-3.5" />}
      headerAction={
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => openAddModal(selectedDateIso)}
            title="Add event on selected date"
            className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-medium text-cyan-300 hover:text-white bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 transition-colors"
          >
            <Plus className="w-2.5 h-2.5" />
            <span>Event</span>
          </button>
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
      <div className="select-none flex flex-col justify-between">
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
            const dayEvents = getEventsOnDate(currentYear, currentMonthIndex, d);
            const hasEvents = dayEvents.length > 0;

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
                {/* Dots container */}
                <div className="absolute bottom-0.5 flex items-center gap-0.5">
                  {/* Dot for tasks indicator */}
                  {hasTasks && (
                    <span
                      className={`w-1 h-1 rounded-full ${
                        isSelected ? 'bg-white' : accentTheme.dotColor
                      }`}
                    />
                  )}
                  {/* Dot for event indicator */}
                  {hasEvents && (
                    <span
                      className={`w-1 h-1 rounded-full ${
                        isSelected ? 'bg-white' : 'bg-cyan-400 shadow-xs shadow-cyan-400/50'
                      }`}
                    />
                  )}
                </div>
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

        {/* Selected Day Events & Action Bar */}
        <div className="mt-3 pt-2.5 border-t border-white/5">
          <div className="flex items-center justify-between text-[11px] mb-1.5 text-neutral-400">
            <span className="font-medium text-neutral-300">
              {selectedDate.toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </span>
            <button
              onClick={() => openAddModal(selectedDateIso)}
              className="flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <Plus className="w-3 h-3" />
              <span>Add Event for this Day</span>
            </button>
          </div>

          {selectedDayEvents.length === 0 ? (
            <p className="text-[11px] text-neutral-500 italic py-0.5">
              No events scheduled for this day.
            </p>
          ) : (
            <div className="space-y-1 max-h-24 overflow-y-auto pr-0.5">
              {selectedDayEvents.map((evt) => {
                const cd = calculateCountdown(evt, today);
                const isActive = evt.id === activeEventId;

                return (
                  <div
                    key={evt.id}
                    className={`flex items-center justify-between px-2 py-1 rounded-lg text-[11px] border transition-colors ${
                      isActive
                        ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-200'
                        : 'bg-white/[0.03] border-white/5 text-neutral-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Sparkles className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span className="font-medium truncate">{evt.title}</span>
                      {evt.time && (
                        <span className="text-[10px] font-mono text-neutral-400 shrink-0">
                          {evt.time}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      <span className="text-[10px] text-neutral-400">
                        {cd.isToday ? 'Today' : cd.relativeText}
                      </span>
                      {!isActive && (
                        <button
                          onClick={() => selectActiveEvent(evt.id)}
                          title="Show on clock countdown"
                          className="px-1.5 py-0.2 rounded text-[10px] bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                        >
                          Show
                        </button>
                      )}
                      <button
                        onClick={() => deleteEvent(evt.id)}
                        title="Delete event"
                        className="p-0.5 text-neutral-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </WidgetContainer>
  );
};
