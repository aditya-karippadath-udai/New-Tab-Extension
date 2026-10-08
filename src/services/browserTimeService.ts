import { getStorageItem, setStorageItem } from '../storage/browserStorage';

export interface BrowserTimeStats {
  date: string; // YYYY-MM-DD
  activeMinutes: number;
  sessionsCount: number;
  focusMinutesCompleted: number;
  lastActiveTimestamp: number;
}

const STORAGE_KEY = 'auratab_browsertime';

function getTodayString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export async function getBrowserTimeStats(): Promise<BrowserTimeStats> {
  const today = getTodayString();
  const raw = await getStorageItem<BrowserTimeStats | null>(STORAGE_KEY, null);

  if (!raw || raw.date !== today) {
    const fresh: BrowserTimeStats = {
      date: today,
      activeMinutes: 1,
      sessionsCount: 1,
      focusMinutesCompleted: 0,
      lastActiveTimestamp: Date.now(),
    };
    await setStorageItem(STORAGE_KEY, fresh);
    return fresh;
  }

  // If returning in the same day, increment session if last active was > 30 mins ago
  const isNewSession = Date.now() - raw.lastActiveTimestamp > 30 * 60 * 1000;
  const updated: BrowserTimeStats = {
    ...raw,
    sessionsCount: isNewSession ? raw.sessionsCount + 1 : raw.sessionsCount,
    lastActiveTimestamp: Date.now(),
  };

  await setStorageItem(STORAGE_KEY, updated);
  return updated;
}

export async function recordFocusSession(minutes: number): Promise<BrowserTimeStats> {
  const stats = await getBrowserTimeStats();
  const updated: BrowserTimeStats = {
    ...stats,
    focusMinutesCompleted: stats.focusMinutesCompleted + minutes,
    lastActiveTimestamp: Date.now(),
  };
  await setStorageItem(STORAGE_KEY, updated);
  return updated;
}

export async function recordActiveMinute(): Promise<BrowserTimeStats> {
  const stats = await getBrowserTimeStats();
  const updated: BrowserTimeStats = {
    ...stats,
    activeMinutes: stats.activeMinutes + 1,
    lastActiveTimestamp: Date.now(),
  };
  await setStorageItem(STORAGE_KEY, updated);
  return updated;
}
