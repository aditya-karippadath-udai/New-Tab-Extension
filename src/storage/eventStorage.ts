import { EventItem } from '../types';
import { getStorageItem, setStorageItem } from './browserStorage';

const EVENTS_KEY = 'auratab_events';
const ACTIVE_EVENT_ID_KEY = 'auratab_active_event_id';

export async function getEvents(): Promise<EventItem[]> {
  const events = await getStorageItem<EventItem[] | null>(EVENTS_KEY, null);
  if (events === null) {
    // Start clean with empty array
    await saveEvents([]);
    return [];
  }
  return events;
}

export async function saveEvents(events: EventItem[]): Promise<void> {
  await setStorageItem(EVENTS_KEY, events);
}

export async function getActiveEventId(): Promise<string | null> {
  return await getStorageItem<string | null>(ACTIVE_EVENT_ID_KEY, null);
}

export async function setActiveEventId(id: string | null): Promise<void> {
  await setStorageItem(ACTIVE_EVENT_ID_KEY, id);
}
