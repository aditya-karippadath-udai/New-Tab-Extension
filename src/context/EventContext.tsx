import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { EventItem } from '../types';
import {
  getEvents,
  saveEvents,
  getActiveEventId,
  setActiveEventId as persistActiveEventId,
} from '../storage/eventStorage';

interface EventContextType {
  events: EventItem[];
  activeEventId: string | null;
  activeEvent: EventItem | null;
  isLoading: boolean;
  isAddModalOpen: boolean;
  isManageModalOpen: boolean;
  preselectedDate: string | null;
  addEvent: (eventData: Omit<EventItem, 'id' | 'createdAt'>) => Promise<EventItem>;
  deleteEvent: (id: string) => Promise<void>;
  selectActiveEvent: (id: string | null) => Promise<void>;
  openAddModal: (date?: string) => void;
  closeAddModal: () => void;
  openManageModal: () => void;
  closeManageModal: () => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [activeEventId, setActiveEventIdState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [preselectedDate, setPreselectedDate] = useState<string | null>(null);

  // Initialize events from storage
  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      try {
        const [storedEvents, storedActiveId] = await Promise.all([
          getEvents(),
          getActiveEventId(),
        ]);
        if (isMounted) {
          setEvents(storedEvents);
          setActiveEventIdState(storedActiveId);
        }
      } catch (err) {
        console.error('Failed to load events:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    init();
    return () => {
      isMounted = false;
    };
  }, []);

  // Compute active event:
  // 1. If activeEventId matches an event in list, use it.
  // 2. Otherwise pick the closest upcoming event (or most recent).
  const activeEvent = useMemo(() => {
    if (events.length === 0) return null;

    if (activeEventId) {
      const found = events.find((e) => e.id === activeEventId);
      if (found) return found;
    }

    // Default to the event with the nearest upcoming date, or first event
    const nowTime = Date.now();
    const sorted = [...events].sort((a, b) => {
      const timeA = new Date(`${a.date}T${a.time || '00:00'}:00`).getTime();
      const timeB = new Date(`${b.date}T${b.time || '00:00'}:00`).getTime();
      const diffA = timeA - nowTime;
      const diffB = timeB - nowTime;

      // Prefer future events first
      if (diffA >= 0 && diffB >= 0) return diffA - diffB;
      if (diffA >= 0) return -1;
      if (diffB >= 0) return 1;
      // If both past, most recent past first
      return diffB - diffA;
    });

    return sorted[0] || null;
  }, [events, activeEventId]);

  const addEvent = async (eventData: Omit<EventItem, 'id' | 'createdAt'>): Promise<EventItem> => {
    const newEvent: EventItem = {
      ...eventData,
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: Date.now(),
    };

    const updated = [newEvent, ...events];
    setEvents(updated);
    await saveEvents(updated);

    // Auto-select this newly created event as active countdown
    setActiveEventIdState(newEvent.id);
    await persistActiveEventId(newEvent.id);

    return newEvent;
  };

  const deleteEvent = async (id: string): Promise<void> => {
    const updated = events.filter((e) => e.id !== id);
    setEvents(updated);
    await saveEvents(updated);

    if (activeEventId === id) {
      const nextActiveId = updated.length > 0 ? updated[0].id : null;
      setActiveEventIdState(nextActiveId);
      await persistActiveEventId(nextActiveId);
    }
  };

  const selectActiveEvent = async (id: string | null): Promise<void> => {
    setActiveEventIdState(id);
    await persistActiveEventId(id);
  };

  const openAddModal = (date?: string) => {
    setPreselectedDate(date || null);
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setPreselectedDate(null);
  };

  const openManageModal = () => {
    setIsManageModalOpen(true);
  };

  const closeManageModal = () => {
    setIsManageModalOpen(false);
  };

  return (
    <EventContext.Provider
      value={{
        events,
        activeEventId,
        activeEvent,
        isLoading,
        isAddModalOpen,
        isManageModalOpen,
        preselectedDate,
        addEvent,
        deleteEvent,
        selectActiveEvent,
        openAddModal,
        closeAddModal,
        openManageModal,
        closeManageModal,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = (): EventContextType => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};
