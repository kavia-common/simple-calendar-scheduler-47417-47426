type ViewMode = "month" | "week" | "day";

interface Props {
  monthLabel: string;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  view: ViewMode;
  setView: (v: ViewMode) => void;
}

// PUBLIC_INTERFACE
export default function HeaderNav({ monthLabel, onPrev, onNext, onToday, view, setView }: Props) {
  /** Top header bar with navigation and view toggles */
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">{monthLabel}</h1>
        <span className="badge">Ocean Professional</span>
      </div>
      <div className="flex items-center gap-2">
        <button className="btn btn-outline" onClick={onToday} aria-label="Go to today">Today</button>
        <button className="btn btn-outline" onClick={onPrev} aria-label="Previous month">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Prev
        </button>
        <button className="btn btn-outline" onClick={onNext} aria-label="Next month">
          Next
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="ml-2 inline-flex rounded-md border border-gray-200 overflow-hidden">
          {(["month","week","day"] as ViewMode[]).map(v => (
            <button
              key={v}
              className={`px-3 py-2 text-sm font-semibold transition ${view===v ? "bg-blue-50 text-blue-700" : "bg-white hover:bg-gray-50"}`}
              onClick={() => setView(v)}
              aria-pressed={view===v}
            >
              {v[0].toUpperCase()+v.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
