export type CalendarEvent = {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime?: string;
  endTime?: string;
  description?: string;
};

const STORAGE_KEY = "calendar.events.v1";

// PUBLIC_INTERFACE
export function listEvents(): CalendarEvent[] {
  /** Return all events from localStorage. */
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CalendarEvent[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// PUBLIC_INTERFACE
export function getEvent(id: string): CalendarEvent | undefined {
  /** Get a single event by id. */
  return listEvents().find((e) => e.id === id);
}

// PUBLIC_INTERFACE
export function upsertEvent(data: Partial<CalendarEvent> & Pick<CalendarEvent, "title" | "date">): CalendarEvent {
  /** Create or update an event and persist to localStorage. */
  const events = listEvents();
  const id = data.id ?? cryptoRandomId();
  const next: CalendarEvent = {
    id,
    title: data.title,
    date: data.date,
    startTime: data.startTime,
    endTime: data.endTime,
    description: data.description,
  };
  const idx = events.findIndex((e) => e.id === id);
  if (idx >= 0) {
    events[idx] = next;
  } else {
    events.push(next);
  }
  persist(events);
  return next;
}

// PUBLIC_INTERFACE
export function deleteEventById(id: string): void {
  /** Delete an event by id from localStorage. */
  const events = listEvents().filter((e) => e.id !== id);
  persist(events);
}

function persist(events: CalendarEvent[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

function cryptoRandomId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    // @ts-expect-error - modern browsers
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
}
