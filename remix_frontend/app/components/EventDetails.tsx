import { useEffect, useState } from "react";
import type { CalendarEvent } from "~/utils/events.client";
import EventModal from "./EventModal";

interface Props {
  event: CalendarEvent;
  onClose: () => void;
  onEdit: () => void; // not used; kept for API symmetry
  onSave: (event: Omit<CalendarEvent, "id"> & Partial<Pick<CalendarEvent, "id">>) => void;
  onDelete: () => void;
}

// PUBLIC_INTERFACE
export default function EventDetails({ event, onClose, onSave, onDelete }: Props) {
  /** View event details with edit/delete; edit opens same form populated */
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (isEditing) {
    return (
      <EventModal
        eventToEdit={event}
        onCancel={() => setIsEditing(false)}
        onSave={(e) => { onSave(e); setIsEditing(false); }}
      />
    );
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Event details">
      <div className="modal p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{event.title}</h2>
          <button className="btn btn-outline" onClick={onClose} aria-label="Close details">Close</button>
        </div>
        <hr className="sep" />
        <div className="space-y-2">
          <div className="text-sm">
            <span className="font-semibold">Date:</span> {event.date}
          </div>
          <div className="text-sm">
            <span className="font-semibold">Time:</span> {event.startTime || "--"}{event.endTime ? ` - ${event.endTime}` : ""}
          </div>
          {event.description && (
            <div className="text-sm">
              <span className="font-semibold">Description:</span> {event.description}
            </div>
          )}
        </div>
        <hr className="sep" />
        <div className="flex items-center justify-end gap-2">
          <button className="btn btn-outline" onClick={() => setIsEditing(true)} aria-label="Edit event">Edit</button>
          <button className="btn" style={{background: "var(--color-error)", color: "white"}} onClick={onDelete} aria-label="Delete event">Delete</button>
        </div>
      </div>
    </div>
  );
}
