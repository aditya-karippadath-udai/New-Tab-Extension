export const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function getDaysInMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate();
}

/**
 * Returns Monday-based day of week (0 = Monday, 6 = Sunday)
 */
export function getFirstDayOfMonth(year: number, monthIndex: number): number {
  const day = new Date(year, monthIndex, 1).getDay();
  // Sunday is 0 in JS, convert to Monday = 0: (day + 6) % 7
  return (day + 6) % 7;
}

export function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function formatDateToIso(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getGreeting(userName?: string): string {
  const hour = new Date().getHours();
  let greet = 'Good evening';
  if (hour >= 5 && hour < 12) {
    greet = 'Good morning';
  } else if (hour >= 12 && hour < 17) {
    greet = 'Good afternoon';
  } else if (hour >= 17 && hour < 22) {
    greet = 'Good evening';
  } else {
    greet = 'Burning the midnight oil';
  }

  return userName?.trim() ? `${greet}, ${userName.trim()}` : greet;
}
