import { useEffect, useMemo, useRef, useState } from "react";
import type { MetaFunction } from "@remix-run/node";
import CalendarGrid from "~/components/CalendarGrid";
import HeaderNav from "~/components/HeaderNav";
import EventModal from "~/components/EventModal";
import EventDetails from "~/components/EventDetails";
import { listEvents, upsertEvent, deleteEventById, type CalendarEvent } from "~/utils/events.client";
import { formatISODate, getMonthMatrix, toISODate, getToday, clampTimeOrder } from "~/utils/date";

export const meta: MetaFunction = () => {
  return [
    { title: "Calendar Scheduler" },
    { name: "description", content: "Simple calendar scheduler" },
  ];
};

type ViewMode = "month" | "week" | "day";

export default function Index() {
  const today = useMemo(() => getToday(), []);
  const [current, setCurrent] = useState<{year: number; month: number}>(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const [view, setView] = useState<ViewMode>("month");
  const [selectedDate, setSelectedDate] = useState<string>(toISODate(new Date()));
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [detailsFor, setDetailsFor] = useState<CalendarEvent | null>(null);
  const fabRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setEvents(listEvents());
  }, []);

  const weeks = useMemo(
    () => getMonthMatrix(current.year, current.month),
    [current]
  );

  function refresh() {
    setEvents(listEvents());
  }

  function goPrev() {
    if (view === "month") {
      let m = current.month - 1;
      let y = current.year;
      if (m < 0) { m = 11; y -= 1; }
      setCurrent({ year: y, month: m });
    }
  }
  function goNext() {
    if (view === "month") {
      let m = current.month + 1;
      let y = current.year;
      if (m > 11) { m = 0; y += 1; }
      setCurrent({ year: y, month: m });
    }
  }
  function goToday() {
    const d = new Date();
    setCurrent({ year: d.getFullYear(), month: d.getMonth() });
    setSelectedDate(toISODate(d));
  }

  function onCreate(date?: string) {
    if (date) setSelectedDate(date);
    setShowCreate(true);
  }

  function onSave(ev: Omit<CalendarEvent, "id"> & Partial<Pick<CalendarEvent, "id">>) {
    const times = clampTimeOrder(ev.startTime, ev.endTime);
    upsertEvent({ ...ev, ...times });
    setShowCreate(false);
    setDetailsFor(null);
    refresh();
    fabRef.current?.focus();
  }

  function onDelete(id: string) {
    deleteEventById(id);
    setDetailsFor(null);
    refresh();
  }

  const monthStart = new Date(current.year, current.month, 1);
  const currentMonthLabel = monthStart.toLocaleString(undefined, { month: "long", year: "numeric" });

  const eventsForSelected = events
    .filter(e => e.date === selectedDate)
    .sort((a,b) => (a.startTime||"").localeCompare(b.startTime||""));

  return (
    <div className="px-4 pb-24">
      <div className="gradient-header rounded-2xl p-6 mb-6 border border-gray-200">
        <HeaderNav
          monthLabel={currentMonthLabel}
          onPrev={goPrev}
          onNext={goNext}
          onToday={goToday}
          view={view}
          setView={setView}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="card p-4 border border-gray-200">
            <CalendarGrid
              year={current.year}
              month={current.month}
              weeks={weeks}
              events={events}
              selectedDate={selectedDate}
              onSelectDate={(d) => setSelectedDate(d)}
              onSelectEvent={(e) => setDetailsFor(e)}
              onQuickAdd={(d) => onCreate(d)}
              todayISO={formatISODate(today)}
            />
          </div>
        </div>
        <aside className="side-panel p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Events on {selectedDate}</h3>
            <button className="btn btn-outline" onClick={() => onCreate(selectedDate)} aria-label="Add new event for selected date">
              + Add
            </button>
          </div>
          <hr className="sep" />
          <div className="space-y-2 mt-3">
            {eventsForSelected.length === 0 && (
              <p className="text-sm text-gray-600">No events for this date.</p>
            )}
            {eventsForSelected.map(ev => (
              <button
                key={ev.id}
                onClick={() => setDetailsFor(ev)}
                className="w-full text-left hover:bg-gray-50 border border-gray-200 p-3 rounded-lg transition"
                aria-label={`Open details for ${ev.title}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{ev.title}</span>
                  <span className="badge">{ev.startTime || "--"}{ev.endTime ? ` - ${ev.endTime}` : ""}</span>
                </div>
                {ev.description && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{ev.description}</p>
                )}
              </button>
            ))}
          </div>
        </aside>
      </div>

      <button
        ref={fabRef}
        className="fab"
        onClick={() => onCreate()}
        aria-label="Create event"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </button>

      {showCreate && (
        <EventModal
          dateDefault={selectedDate}
          onCancel={() => setShowCreate(false)}
          onSave={onSave}
        />
      )}

      {detailsFor && (
        <EventDetails
          event={detailsFor}
          onClose={() => setDetailsFor(null)}
          onEdit={() => {
            setShowCreate(true);
          }}
          onSave={onSave}
          onDelete={() => onDelete(detailsFor.id)}
        />
      )}
    </div>
  );
}
