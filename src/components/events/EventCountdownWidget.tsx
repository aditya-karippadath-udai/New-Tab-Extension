import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  List,
  Sparkles,
  PartyPopper,
  Flame,
  Gift,
  Target,
  Briefcase,
  Flag,
} from 'lucide-react';
import { useEvents } from '../../context/EventContext';
import { useSettings } from '../../context/SettingsContext';
import { calculateCountdown } from '../../utils/countdownUtils';
import { EventCategory } from '../../types';

const CATEGORY_ICONS: Record<EventCategory, React.ComponentType<{ className?: string }>> = {
  milestone: Target,
  birthday: Gift,
  deadline: Flame,
  meeting: Briefcase,
  holiday: PartyPopper,
  special: Sparkles,
};

const CATEGORY_LABELS: Record<EventCategory, string> = {
  milestone: 'Milestone',
  birthday: 'Birthday',
  deadline: 'Deadline',
  meeting: 'Meeting',
  holiday: 'Holiday',
  special: 'Special Event',
};

const COLOR_MAP: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  cyan: {
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    text: 'text-cyan-400',
    glow: 'shadow-cyan-500/10',
  },
  blue: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    glow: 'shadow-blue-500/10',
  },
  purple: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    text: 'text-purple-400',
    glow: 'shadow-purple-500/10',
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    glow: 'shadow-emerald-500/10',
  },
  amber: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    glow: 'shadow-amber-500/10',
  },
  rose: {
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    text: 'text-rose-400',
    glow: 'shadow-rose-500/10',
  },
};

export const EventCountdownWidget: React.FC = () => {
  const {
    events,
    activeEvent,
    deleteEvent,
    selectActiveEvent,
    openAddModal,
    openManageModal,
  } = useEvents();
  const { accentTheme } = useSettings();

  // Tick clock every second for live countdown
  const [now, setNow] = useState<Date>(new Date());
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // If no events exist, show a minimal, sleek "+ Add Event Countdown" action
  if (!activeEvent || events.length === 0) {
    return (
      <div className="w-full flex justify-center mt-2 mb-1 animate-fade-in">
        <button
          onClick={() => openAddModal()}
          className="group flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-xs text-neutral-400 hover:text-neutral-200 transition-all backdrop-blur-md shadow-xs cursor-pointer"
        >
          <Calendar className="w-3.5 h-3.5 text-neutral-400 group-hover:text-cyan-400 transition-colors" />
          <span className="font-medium">+ Add Event Countdown</span>
        </button>
      </div>
    );
  }

  // Calculate live countdown for active event
  const countdown = calculateCountdown(activeEvent, now);
  const colorStyle = COLOR_MAP[activeEvent.color || 'cyan'] || COLOR_MAP.cyan;
  const CategoryIcon = activeEvent.category ? (CATEGORY_ICONS[activeEvent.category] || Flag) : Flag;
  const categoryLabel = activeEvent.category ? CATEGORY_LABELS[activeEvent.category] : 'Event';

  // Find index for carousel cycling
  const currentIndex = events.findIndex((e) => e.id === activeEvent.id);
  const handlePrevEvent = () => {
    if (events.length <= 1) return;
    const prevIndex = (currentIndex - 1 + events.length) % events.length;
    selectActiveEvent(events[prevIndex].id);
    setShowConfirmDelete(false);
  };

  const handleNextEvent = () => {
    if (events.length <= 1) return;
    const nextIndex = (currentIndex + 1) % events.length;
    selectActiveEvent(events[nextIndex].id);
    setShowConfirmDelete(false);
  };

  const handleDelete = async () => {
    await deleteEvent(activeEvent.id);
    setShowConfirmDelete(false);
  };

  return (
    <div className="w-full max-w-xl mx-auto mt-2 mb-2 px-2 select-none animate-fade-in">
      <div
        className={`relative overflow-hidden rounded-2xl p-3.5 sm:p-4 bg-neutral-900/60 dark:bg-black/40 backdrop-blur-xl border ${colorStyle.border} shadow-lg ${colorStyle.glow} transition-all duration-300`}
      >
        {/* Subtle accent gradient background */}
        <div
          className={`absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl pointer-events-none opacity-20 ${colorStyle.bg}`}
        />

        {/* Top bar: Event Title, Category & Actions */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className={`p-1.5 rounded-xl ${colorStyle.bg} border ${colorStyle.border} ${colorStyle.text} shrink-0`}
            >
              <CategoryIcon className="w-3.5 h-3.5" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-sm sm:text-base font-semibold text-white truncate tracking-tight">
                  {activeEvent.title}
                </h4>
                <span
                  className={`hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-medium border ${colorStyle.bg} ${colorStyle.border} ${colorStyle.text}`}
                >
                  {categoryLabel}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                <span>{countdown.formattedTargetDate}</span>
                {activeEvent.time && (
                  <>
                    <span>•</span>
                    <span className="font-mono">{activeEvent.time}</span>
                  </>
                )}
                <span>•</span>
                <span className={`${countdown.isToday ? 'text-amber-400 font-semibold' : colorStyle.text}`}>
                  {countdown.relativeText}
                </span>
              </div>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Prev / Next arrows if multiple events */}
            {events.length > 1 && (
              <div className="flex items-center bg-white/5 border border-white/10 rounded-lg p-0.5">
                <button
                  onClick={handlePrevEvent}
                  title="Previous event"
                  className="p-1 rounded text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <ChevronLeft className="w-3 h-3" />
                </button>
                <span className="text-[10px] font-mono px-1 text-neutral-400">
                  {currentIndex + 1}/{events.length}
                </span>
                <button
                  onClick={handleNextEvent}
                  title="Next event"
                  className="p-1 rounded text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Manage Events modal */}
            <button
              onClick={openManageModal}
              title="All Events"
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <List className="w-3.5 h-3.5" />
            </button>

            {/* Add Event */}
            <button
              onClick={() => openAddModal()}
              title="Add New Event"
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>

            {/* Delete button */}
            {showConfirmDelete ? (
              <div className="flex items-center gap-1 bg-red-500/20 border border-red-500/30 rounded-lg px-1.5 py-0.5">
                <span className="text-[10px] text-red-300 font-medium">Delete?</span>
                <button
                  onClick={handleDelete}
                  className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-red-600 hover:bg-red-500 text-white transition-colors"
                >
                  Yes
                </button>
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="px-1 text-[10px] text-neutral-300 hover:text-white"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowConfirmDelete(true)}
                title="Delete this event"
                className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Live Countdown Segment Cards */}
        {countdown.isToday ? (
          <div className="py-2.5 px-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PartyPopper className="w-5 h-5 text-amber-400 animate-bounce" />
              <div>
                <p className="text-xs sm:text-sm font-semibold text-amber-300">
                  Today is the day! 🎉
                </p>
                <p className="text-[11px] text-neutral-300">
                  {activeEvent.title} is happening today!
                </p>
              </div>
            </div>
            {activeEvent.time && !countdown.isPast && (
              <div className="flex items-center gap-2 font-mono text-xs tabular-nums text-amber-300">
                <span>{countdown.hours}h</span>
                <span>{countdown.minutes}m</span>
                <span>{countdown.seconds}s</span>
              </div>
            )}
          </div>
        ) : countdown.isPast ? (
          <div className="py-2.5 px-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="text-xs text-neutral-400">
              <span className="font-medium text-neutral-300">Event has passed</span>
              <span className="ml-2 text-neutral-500 font-mono">({countdown.relativeText})</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDelete}
                className="px-2 py-1 rounded-lg text-[11px] font-medium bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors"
              >
                Remove
              </button>
              <button
                onClick={() => openAddModal()}
                className={`px-2 py-1 rounded-lg text-[11px] font-medium ${accentTheme.buttonClass}`}
              >
                Set Next Event
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
            {/* Days */}
            <div className="p-2 sm:p-2.5 rounded-xl bg-white/[0.04] border border-white/5 flex flex-col items-center justify-center">
              <span className="font-mono text-xl sm:text-2xl md:text-3xl font-bold tabular-nums text-white tracking-tight">
                {String(countdown.days).padStart(2, '0')}
              </span>
              <span className="text-[9px] sm:text-[10px] font-medium tracking-wider uppercase text-neutral-400 mt-0.5">
                Days
              </span>
            </div>

            {/* Hours */}
            <div className="p-2 sm:p-2.5 rounded-xl bg-white/[0.04] border border-white/5 flex flex-col items-center justify-center">
              <span className="font-mono text-xl sm:text-2xl md:text-3xl font-bold tabular-nums text-white tracking-tight">
                {String(countdown.hours).padStart(2, '0')}
              </span>
              <span className="text-[9px] sm:text-[10px] font-medium tracking-wider uppercase text-neutral-400 mt-0.5">
                Hours
              </span>
            </div>

            {/* Minutes */}
            <div className="p-2 sm:p-2.5 rounded-xl bg-white/[0.04] border border-white/5 flex flex-col items-center justify-center">
              <span className="font-mono text-xl sm:text-2xl md:text-3xl font-bold tabular-nums text-white tracking-tight">
                {String(countdown.minutes).padStart(2, '0')}
              </span>
              <span className="text-[9px] sm:text-[10px] font-medium tracking-wider uppercase text-neutral-400 mt-0.5">
                Minutes
              </span>
            </div>

            {/* Seconds */}
            <div className="p-2 sm:p-2.5 rounded-xl bg-white/[0.04] border border-white/5 flex flex-col items-center justify-center">
              <span className={`font-mono text-xl sm:text-2xl md:text-3xl font-bold tabular-nums tracking-tight ${colorStyle.text}`}>
                {String(countdown.seconds).padStart(2, '0')}
              </span>
              <span className="text-[9px] sm:text-[10px] font-medium tracking-wider uppercase text-neutral-400 mt-0.5">
                Seconds
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
