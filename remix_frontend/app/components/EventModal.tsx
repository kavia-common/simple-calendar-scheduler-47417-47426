import React, { useEffect, useRef, useState } from "react";
import type { CalendarEvent } from "~/utils/events.client";

interface Props {
  dateDefault?: string;
  eventToEdit?: CalendarEvent | null;
  onCancel: () => void;
  onSave: (event: Omit<CalendarEvent, "id"> & Partial<Pick<CalendarEvent, "id">>) => void;
}

// PUBLIC_INTERFACE
export default function EventModal({ dateDefault, eventToEdit, onCancel, onSave }: Props) {
  /** Modal dialog to create or edit an event with focus trap & ESC close */
  const [title, setTitle] = useState(eventToEdit?.title ?? "");
  const [date, setDate] = useState(eventToEdit?.date ?? dateDefault ?? "");
  const [startTime, setStartTime] = useState(eventToEdit?.startTime ?? "");
  const [endTime, setEndTime] = useState(eventToEdit?.endTime ?? "");
  const [description, setDescription] = useState(eventToEdit?.description ?? "");
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const firstFieldRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onCancel();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onCancel]);

  useEffect(() => {
    firstFieldRef.current?.focus();
  }, []);

  function submit(ev: React.FormEvent) {
    ev.preventDefault();
    onSave({
      id: eventToEdit?.id,
      title: title.trim(),
      date,
      startTime: startTime || undefined,
      endTime: endTime || undefined,
      description: description.trim() || undefined,
    });
  }

  // rudimentary focus trap
  useEffect(() => {
    function handleTab(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (document.activeElement === last && !e.shiftKey) {
        e.preventDefault();
        first.focus();
      } else if (document.activeElement === first && e.shiftKey) {
        e.preventDefault();
        last.focus();
      }
    }
    document.addEventListener("keydown", handleTab);
    return () => document.removeEventListener("keydown", handleTab);
  }, []);

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={eventToEdit ? "Edit event" : "Create event"}>
      <div ref={dialogRef} className="modal p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">{eventToEdit ? "Edit Event" : "Create Event"}</h2>
          <button className="btn btn-outline" onClick={onCancel} aria-label="Close modal">Close</button>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="label" htmlFor="title">Title</label>
            <input ref={firstFieldRef} id="title" className="input mt-1" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Team sync" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="label" htmlFor="date">Date</label>
              <input id="date" type="date" className="input mt-1" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div>
              <label className="label" htmlFor="start">Start</label>
              <input id="start" type="time" className="input mt-1" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            </div>
            <div>
              <label className="label" htmlFor="end">End</label>
              <input id="end" type="time" className="input mt-1" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="label" htmlFor="desc">Description</label>
            <textarea id="desc" className="textarea mt-1" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Notes or details..." />
          </div>
          <hr className="sep" />
          <div className="flex items-center justify-end gap-2">
            <button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button>
            <button type="submit" className="btn btn-primary">{eventToEdit ? "Save changes" : "Create event"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
