import { EventItem } from '../types';

export interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  isToday: boolean;
  isPast: boolean;
  formattedTargetDate: string;
  relativeText: string;
}

/**
 * Returns target Date object from EventItem
 */
export function getEventTargetDate(event: EventItem): Date {
  const [yearStr, monthStr, dayStr] = event.date.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1;
  const day = parseInt(dayStr, 10);

  if (event.time && event.time.includes(':')) {
    const [hStr, mStr] = event.time.split(':');
    const hours = parseInt(hStr, 10) || 0;
    const minutes = parseInt(mStr, 10) || 0;
    return new Date(year, month, day, hours, minutes, 0, 0);
  }

  // If no time is set, set to start of that day (00:00:00)
  return new Date(year, month, day, 0, 0, 0, 0);
}

/**
 * Calculates countdown info for an event relative to now
 */
export function calculateCountdown(event: EventItem, now: Date = new Date()): CountdownResult {
  const target = getEventTargetDate(event);
  const diffMs = target.getTime() - now.getTime();
  const totalSeconds = Math.floor(diffMs / 1000);

  // Check if target is on the same calendar day as now
  const isSameCalendarDay =
    target.getFullYear() === now.getFullYear() &&
    target.getMonth() === now.getMonth() &&
    target.getDate() === now.getDate();

  // Format date display
  const formattedTargetDate = target.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: target.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });

  if (isSameCalendarDay) {
    if (!event.time || totalSeconds <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        totalSeconds: 0,
        isToday: true,
        isPast: false,
        formattedTargetDate,
        relativeText: 'Today is the day! 🎉',
      };
    }
  }

  if (totalSeconds < 0 && !isSameCalendarDay) {
    const absSec = Math.abs(totalSeconds);
    const passedDays = Math.floor(absSec / 86400);
    return {
      days: passedDays,
      hours: Math.floor((absSec % 86400) / 3600),
      minutes: Math.floor((absSec % 3600) / 60),
      seconds: absSec % 60,
      totalSeconds,
      isToday: false,
      isPast: true,
      formattedTargetDate,
      relativeText: passedDays === 0 ? 'Passed earlier today' : `${passedDays} day${passedDays === 1 ? '' : 's'} ago`,
    };
  }

  // Future countdown
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  let relativeText = `in ${days} day${days === 1 ? '' : 's'}`;
  if (days === 0) {
    relativeText = hours > 0 ? `in ${hours} hr ${minutes} min` : `in ${minutes} min`;
  } else if (days === 1) {
    relativeText = 'Tomorrow';
  }

  return {
    days,
    hours,
    minutes,
    seconds,
    totalSeconds,
    isToday: isSameCalendarDay,
    isPast: false,
    formattedTargetDate,
    relativeText,
  };
}
