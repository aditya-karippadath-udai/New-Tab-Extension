import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Timer, Sparkles, CheckCircle2 } from 'lucide-react';
import { WidgetContainer } from './WidgetContainer';
import { useSettings } from '../../context/SettingsContext';
import { recordFocusSession, getBrowserTimeStats, BrowserTimeStats } from '../../services/browserTimeService';

type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';

const TIMER_DURATIONS: Record<TimerMode, number> = {
  pomodoro: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

export const FocusTimerWidget: React.FC = () => {
  const { accentTheme } = useSettings();
  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [timeLeft, setTimeLeft] = useState<number>(TIMER_DURATIONS.pomodoro);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completedSessions, setCompletedSessions] = useState<number>(0);
  const [timeStats, setTimeStats] = useState<BrowserTimeStats | null>(null);

  const initialDuration = TIMER_DURATIONS[mode];
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    getBrowserTimeStats().then(setTimeStats);
  }, []);

  // Web Audio Synth chime when timer completes
  const playChime = () => {
    try {
      const ctx = audioCtxRef.current || new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = ctx;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch {
      // Audio autoplay policy fallback
    }
  };

  useEffect(() => {
    let interval: any = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsRunning(false);
            playChime();
            if (mode === 'pomodoro') {
              setCompletedSessions((s) => s + 1);
              recordFocusSession(25).then(setTimeStats);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode]);

  const switchMode = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(TIMER_DURATIONS[newMode]);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(TIMER_DURATIONS[mode]);
  };

  const toggleRunning = () => {
    setIsRunning(!isRunning);
  };

  // Format MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Progress for circle
  const progressFraction = Math.max(0, Math.min(1, 1 - timeLeft / initialDuration));
  const strokeRadius = 40;
  const circumference = 2 * Math.PI * strokeRadius;
  const strokeDashoffset = circumference * (1 - progressFraction);

  return (
    <WidgetContainer
      title="Focus Timer"
      icon={<Timer className={`w-4 h-4 ${accentTheme.textColor}`} />}
      headerAction={
        <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>{completedSessions} focus streak</span>
        </div>
      }
    >
      <div className="flex flex-col items-center justify-center p-2">
        {/* Mode selector pills */}
        <div className="flex items-center bg-black/30 dark:bg-black/40 border border-white/10 rounded-xl p-1 gap-1 mb-4 text-xs">
          <button
            onClick={() => switchMode('pomodoro')}
            className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              mode === 'pomodoro'
                ? `${accentTheme.bgActive} text-white shadow-sm`
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Pomodoro (25m)
          </button>
          <button
            onClick={() => switchMode('shortBreak')}
            className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              mode === 'shortBreak'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Short Break (5m)
          </button>
          <button
            onClick={() => switchMode('longBreak')}
            className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              mode === 'longBreak'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Long Break (15m)
          </button>
        </div>

        {/* Circular Clock Display */}
        <div className="relative w-36 h-36 flex items-center justify-center my-1">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Background track */}
            <circle
              cx="50"
              cy="50"
              r={strokeRadius}
              className="text-white/10"
              strokeWidth="5"
              stroke="currentColor"
              fill="transparent"
            />
            {/* Animated progress stroke */}
            <circle
              cx="50"
              cy="50"
              r={strokeRadius}
              className={`${
                mode === 'pomodoro'
                  ? 'text-cyan-400'
                  : mode === 'shortBreak'
                  ? 'text-emerald-400'
                  : 'text-purple-400'
              } transition-all duration-300`}
              strokeWidth="5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
            />
          </svg>

          {/* Time digits */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-bold font-mono tracking-wider text-white">
              {timeFormatted}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium mt-0.5">
              {isRunning ? 'Focusing' : timeLeft === 0 ? 'Done' : 'Paused'}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={toggleRunning}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold shadow-lg transition-all cursor-pointer ${
              isRunning
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                : `${accentTheme.bgActive} text-white shadow-cyan-500/20 hover:scale-105 active:scale-95`
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Start</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            title="Reset timer"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* BrowserTime stats integration summary */}
        {timeStats && (
          <div className="mt-4 pt-3 border-t border-white/5 w-full flex items-center justify-around text-[11px] text-neutral-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Today: <strong className="text-neutral-200">{timeStats.focusMinutesCompleted + completedSessions * 25}m</strong> focus</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Session #{timeStats.sessionsCount}</span>
            </div>
          </div>
        )}
      </div>
    </WidgetContainer>
  );
};
