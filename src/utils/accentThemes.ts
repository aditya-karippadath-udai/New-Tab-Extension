import { AccentColor } from '../types';

export interface AccentThemeDef {
  name: string;
  dotColor: string;
  glowColor: string;
  textColor: string;
  bgActive: string;
  borderHover: string;
  focusRing: string;
  buttonClass: string;
  progressBarColor: string;
}

export const ACCENT_THEMES: Record<AccentColor, AccentThemeDef> = {
  blue: {
    name: 'Electric Blue',
    dotColor: 'bg-blue-500',
    glowColor: 'rgba(59, 130, 246, 0.4)',
    textColor: 'text-blue-400',
    bgActive: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    borderHover: 'hover:border-blue-500/50',
    focusRing: 'focus:ring-2 focus:ring-blue-500/40',
    buttonClass: 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20',
    progressBarColor: 'bg-blue-500',
  },
  cyan: {
    name: 'Neon Cyan',
    dotColor: 'bg-cyan-400',
    glowColor: 'rgba(6, 182, 212, 0.4)',
    textColor: 'text-cyan-400',
    bgActive: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    borderHover: 'hover:border-cyan-500/50',
    focusRing: 'focus:ring-2 focus:ring-cyan-500/40',
    buttonClass: 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/20',
    progressBarColor: 'bg-cyan-400',
  },
  purple: {
    name: 'Cyber Violet',
    dotColor: 'bg-purple-500',
    glowColor: 'rgba(168, 85, 247, 0.4)',
    textColor: 'text-purple-400',
    bgActive: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    borderHover: 'hover:border-purple-500/50',
    focusRing: 'focus:ring-2 focus:ring-purple-500/40',
    buttonClass: 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/20',
    progressBarColor: 'bg-purple-500',
  },
  emerald: {
    name: 'Mint Emerald',
    dotColor: 'bg-emerald-400',
    glowColor: 'rgba(52, 211, 153, 0.4)',
    textColor: 'text-emerald-400',
    bgActive: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    borderHover: 'hover:border-emerald-500/50',
    focusRing: 'focus:ring-2 focus:ring-emerald-500/40',
    buttonClass: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20',
    progressBarColor: 'bg-emerald-400',
  },
  amber: {
    name: 'Solar Amber',
    dotColor: 'bg-amber-400',
    glowColor: 'rgba(251, 191, 36, 0.4)',
    textColor: 'text-amber-400',
    bgActive: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    borderHover: 'hover:border-amber-500/50',
    focusRing: 'focus:ring-2 focus:ring-amber-500/40',
    buttonClass: 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/20',
    progressBarColor: 'bg-amber-400',
  },
  rose: {
    name: 'Crimson Rose',
    dotColor: 'bg-rose-500',
    glowColor: 'rgba(244, 63, 94, 0.4)',
    textColor: 'text-rose-400',
    bgActive: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    borderHover: 'hover:border-rose-500/50',
    focusRing: 'focus:ring-2 focus:ring-rose-500/40',
    buttonClass: 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20',
    progressBarColor: 'bg-rose-500',
  },
};
