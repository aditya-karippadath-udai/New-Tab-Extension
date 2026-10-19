import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Calendar,
  Clock,
  Sparkles,
  Target,
  Gift,
  Flame,
  Briefcase,
  PartyPopper,
  Check,
} from 'lucide-react';
import { useEvents } from '../../context/EventContext';
import { useSettings } from '../../context/SettingsContext';
import { EventCategory } from '../../types';
import { formatDateToIso } from '../../utils/dateUtils';

const CATEGORIES: { id: EventCategory; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'milestone', label: 'Milestone', icon: Target },
  { id: 'birthday', label: 'Birthday', icon: Gift },
  { id: 'deadline', label: 'Deadline', icon: Flame },
  { id: 'meeting', label: 'Meeting', icon: Briefcase },
  { id: 'holiday', label: 'Holiday', icon: PartyPopper },
  { id: 'special', label: 'Special', icon: Sparkles },
];

const COLORS: { id: string; label: string; bg: string; ring: string }[] = [
  { id: 'cyan', label: 'Cyan', bg: 'bg-cyan-500', ring: 'ring-cyan-400' },
  { id: 'blue', label: 'Blue', bg: 'bg-blue-500', ring: 'ring-blue-400' },
  { id: 'purple', label: 'Purple', bg: 'bg-purple-500', ring: 'ring-purple-400' },
  { id: 'emerald', label: 'Emerald', bg: 'bg-emerald-500', ring: 'ring-emerald-400' },
  { id: 'amber', label: 'Amber', bg: 'bg-amber-500', ring: 'ring-amber-400' },
  { id: 'rose', label: 'Rose', bg: 'bg-rose-500', ring: 'ring-rose-400' },
];

export const AddEventDialog: React.FC = () => {
  const { isAddModalOpen, closeAddModal, addEvent, preselectedDate } = useEvents();
  const { accentTheme } = useSettings();

  const titleInputRef = useRef<HTMLInputElement>(null);

  const getTomorrowIso = () => {
    const tm = new Date();
    tm.setDate(tm.getDate() + 1);
    return formatDateToIso(tm);
  };

  const [title, setTitle] = useState('');
  const [date, setDate] = useState(getTomorrowIso());
  const [hasTime, setHasTime] = useState(false);
  const [time, setTime] = useState('09:00');
  const [category, setCategory] = useState<EventCategory>('milestone');
  const [color, setColor] = useState('cyan');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Sync preselected date if provided
  useEffect(() => {
    if (isAddModalOpen) {
      if (preselectedDate) {
        setDate(preselectedDate);
      } else {
        setDate(getTomorrowIso());
      }
      setTitle('');
      setHasTime(false);
      setTime('09:00');
      setCategory('milestone');
      setColor('cyan');
      setDescription('');
      setError(null);

      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 50);
    }
  }, [isAddModalOpen, preselectedDate]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAddModalOpen) {
        closeAddModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAddModalOpen, closeAddModal]);

  if (!isAddModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter an event title');
      titleInputRef.current?.focus();
      return;
    }
    if (!date) {
      setError('Please select an event date');
      return;
    }

    try {
      await addEvent({
        title: title.trim(),
        date,
        time: hasTime ? time : undefined,
        category,
        color,
        description: description.trim() || undefined,
      });
      closeAddModal();
    } catch (err) {
      console.error(err);
      setError('Failed to create event. Please try again.');
    }
  };

  const setDatePreset = (daysToAdd: number) => {
    const target = new Date();
    target.setDate(target.getDate() + daysToAdd);
    setDate(formatDateToIso(target));
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
      <div
        className="w-full max-w-lg bg-neutral-900/95 dark:bg-neutral-950/95 border border-white/10 rounded-2xl shadow-2xl p-5 sm:p-6 text-neutral-100 flex flex-col max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-xl ${accentTheme.bgActive}`}>
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-white">
                Add Event Countdown
              </h3>
              <p className="text-xs text-neutral-400">
                Track any day with an automatic live countdown
              </p>
            </div>
          </div>
          <button
            onClick={closeAddModal}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {error && (
            <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Event Title */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Event Title <span className="text-cyan-400">*</span>
            </label>
            <input
              ref={titleInputRef}
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g. Product Launch, Mom's Birthday, Paris Vacation"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-neutral-500 focus:outline-hidden focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all"
            />
          </div>

          {/* Event Date & Quick Presets */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-neutral-300">
                Event Date <span className="text-cyan-400">*</span>
              </label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setDatePreset(0)}
                  className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => setDatePreset(1)}
                  className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                >
                  Tomorrow
                </button>
                <button
                  type="button"
                  onClick={() => setDatePreset(7)}
                  className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                >
                  1 Week
                </button>
                <button
                  type="button"
                  onClick={() => setDatePreset(30)}
                  className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                >
                  1 Month
                </button>
              </div>
            </div>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-hidden focus:border-cyan-400 transition-all cursor-pointer"
            />
          </div>

          {/* Time toggle (All-day vs Specific time) */}
          <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-neutral-400" />
                <span className="text-xs font-medium text-neutral-300">Specific Time</span>
              </div>
              <button
                type="button"
                onClick={() => setHasTime(!hasTime)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  hasTime ? accentTheme.bgActive : 'bg-neutral-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    hasTime ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {hasTime && (
              <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2">
                <label className="text-xs text-neutral-400 shrink-0">Time:</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-hidden focus:border-cyan-400 font-mono"
                />
              </div>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-xs font-medium transition-all ${
                      isSelected
                        ? `${accentTheme.bgActive} border-white/30 text-white font-semibold shadow-xs`
                        : 'bg-white/5 border-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[10px]">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Tag */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Accent Color
            </label>
            <div className="flex items-center gap-2">
              {COLORS.map((c) => {
                const isSelected = color === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setColor(c.id)}
                    title={c.label}
                    className={`w-6 h-6 rounded-full ${c.bg} flex items-center justify-center transition-transform ${
                      isSelected ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Notes */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add any reminders, location, or notes..."
              className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-cyan-400 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-white/10">
            <button
              type="button"
              onClick={closeAddModal}
              className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-5 py-2 rounded-xl text-xs font-semibold ${accentTheme.buttonClass} transition-all cursor-pointer`}
            >
              Start Countdown
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
