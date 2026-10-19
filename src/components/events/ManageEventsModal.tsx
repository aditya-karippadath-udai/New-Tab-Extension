import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  Flame,
  Gift,
  Target,
  Briefcase,
  PartyPopper,
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

export const ManageEventsModal: React.FC = () => {
  const {
    events,
    activeEventId,
    isManageModalOpen,
    closeManageModal,
    openAddModal,
    deleteEvent,
    selectActiveEvent,
  } = useEvents();
  const { accentTheme } = useSettings();

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  if (!isManageModalOpen) return null;

  const now = new Date();

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
      <div
        className="w-full max-w-xl bg-neutral-900/95 dark:bg-neutral-950/95 border border-white/10 rounded-2xl shadow-2xl p-5 sm:p-6 text-neutral-100 flex flex-col max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${accentTheme.bgActive}`}>
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-white">
                All Event Countdowns
              </h3>
              <p className="text-xs text-neutral-400">
                Manage your scheduled events and countdown timers
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                closeManageModal();
                openAddModal();
              }}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold ${accentTheme.buttonClass} transition-all`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Event</span>
            </button>
            <button
              onClick={closeManageModal}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="mt-4 flex-1 overflow-y-auto space-y-2.5 pr-1">
          {events.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-xl border border-dashed border-white/10">
              <Calendar className="w-10 h-10 mx-auto text-neutral-600 mb-2.5" />
              <p className="text-sm font-medium text-neutral-300">No events added yet</p>
              <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
                Add milestones, birthdays, holidays or deadlines to show live countdowns below the clock.
              </p>
              <button
                onClick={() => {
                  closeManageModal();
                  openAddModal();
                }}
                className={`mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold ${accentTheme.buttonClass}`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Your First Event</span>
              </button>
            </div>
          ) : (
            events.map((evt) => {
              const countdown = calculateCountdown(evt, now);
              const isActive = evt.id === activeEventId;
              const Icon = evt.category ? CATEGORY_ICONS[evt.category] || Flag : Flag;
              const isConfirming = confirmDeleteId === evt.id;

              return (
                <div
                  key={evt.id}
                  className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                    isActive
                      ? 'bg-white/[0.07] border-cyan-500/40 shadow-xs'
                      : 'bg-white/[0.03] border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-xl border shrink-0 ${
                        isActive
                          ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                          : 'bg-white/5 border-white/10 text-neutral-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-white truncate">
                          {evt.title}
                        </span>
                        {isActive && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-cyan-500/30 text-cyan-200 border border-cyan-500/40">
                            Active on Clock
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-neutral-400 mt-0.5">
                        <span className="text-neutral-300">{countdown.formattedTargetDate}</span>
                        {evt.time && (
                          <>
                            <span>•</span>
                            <span className="font-mono">{evt.time}</span>
                          </>
                        )}
                        <span>•</span>
                        <span
                          className={`font-medium ${
                            countdown.isToday
                              ? 'text-amber-400 font-semibold'
                              : countdown.isPast
                              ? 'text-neutral-500'
                              : 'text-cyan-400'
                          }`}
                        >
                          {countdown.isPast
                            ? `Passed (${countdown.relativeText})`
                            : countdown.isToday
                            ? 'Today! 🎉'
                            : `${countdown.days}d ${countdown.hours}h ${countdown.minutes}m left`}
                        </span>
                      </div>

                      {evt.description && (
                        <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                          {evt.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {!isActive && (
                      <button
                        onClick={() => selectActiveEvent(evt.id)}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 transition-colors cursor-pointer"
                      >
                        Set Active
                      </button>
                    )}

                    {isConfirming ? (
                      <div className="flex items-center gap-1 bg-red-500/20 border border-red-500/40 rounded-lg p-1">
                        <button
                          onClick={() => deleteEvent(evt.id)}
                          className="px-2 py-0.5 text-[11px] font-bold rounded bg-red-600 hover:bg-red-500 text-white transition-colors"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-1.5 text-xs text-neutral-300 hover:text-white"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(evt.id)}
                        title="Delete event"
                        className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-neutral-500 shrink-0">
          <span>{events.length} event{events.length === 1 ? '' : 's'} scheduled</span>
          <button
            onClick={closeManageModal}
            className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-200 text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
