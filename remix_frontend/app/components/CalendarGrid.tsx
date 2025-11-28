import { formatISODate } from "~/utils/date";
import type { CalendarEvent } from "~/utils/events.client";

export interface DayCell {
  date: Date;
  inMonth: boolean;
}

interface Props {
  year: number;
  month: number; // 0-11
  weeks: DayCell[][];
  events: CalendarEvent[];
  selectedDate: string; // YYYY-MM-DD
  todayISO: string;
  onSelectDate: (dateISO: string) => void;
  onSelectEvent: (ev: CalendarEvent) => void;
  onQuickAdd: (dateISO: string) => void;
}

// PUBLIC_INTERFACE
export default function CalendarGrid(props: Props) {
  /** Month view grid with days and inline event pills */
  const { weeks, events, selectedDate, todayISO } = props;

  function eventsForDate(dateISO: string) {
    return events
      .filter((e) => e.date === dateISO)
      .sort((a, b) => (a.startTime || "").localeCompare(b.startTime || ""));
  }

  return (
    <div>
      <div className="grid grid-cols-7 gap-2 mb-2 px-1">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
          <div key={d} className="text-xs font-semibold text-gray-600 uppercase tracking-wide px-1">
            {d}
          </div>
        ))}
      </div>
      <div className="calendar-grid">
        {weeks.map((week, wi) =>
          week.map((cell, di) => {
            const iso = formatISODate(cell.date);
            const dayNum = cell.date.getDate();
            const isToday = iso === todayISO;
            const selected = selectedDate === iso;
            const dayEvents = eventsForDate(iso);

            return (
              <button
                key={`${wi}-${di}`}
                type="button"
                className={`calendar-cell ${cell.inMonth ? "" : "outside"} ${selected ? "ring-2 ring-blue-400" : ""}`}
                onClick={() => props.onSelectDate(iso)}
                aria-label={`Select ${iso}`}
              >
                <div className="flex items-center justify-between">
                  <span className="date-label">{dayNum}</span>
                  {isToday && <span className="today-indicator" aria-hidden="true" />}
                </div>
                <div className="mt-1 space-y-1">
                  {dayEvents.slice(0, 3).map((ev) => (
                    <div
                      key={ev.id}
                      role="button"
                      tabIndex={0}
                      className="event-pill"
                      onClick={(e) => { e.stopPropagation(); props.onSelectEvent(ev); }}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); props.onSelectEvent(ev); } }}
                      aria-label={`Open event ${ev.title}`}
                      title={`${ev.title}${ev.startTime ? " @ " + ev.startTime : ""}`}
                    >
                      {ev.startTime ? `${ev.startTime} ` : ""}{ev.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500 font-medium">+{dayEvents.length - 3} more</div>
                  )}
                </div>
                <div className="absolute bottom-2 right-2">
                  <button
                    type="button"
                    className="text-xs text-blue-600 hover:underline"
                    onClick={(e) => { e.stopPropagation(); props.onQuickAdd(iso); }}
                    aria-label={`Quick add event on ${iso}`}
                  >
                    Add
                  </button>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
