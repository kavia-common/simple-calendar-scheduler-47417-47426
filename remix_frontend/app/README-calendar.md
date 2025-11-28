# Simple Calendar Scheduler (Remix)

This app provides a basic calendar with Month/Week/Day toggles (Month view implemented) and local event management.

Features:
- Month grid with navigation (Prev/Next/Today)
- Add events via floating action button (FAB) or "Add" on a day
- Event details with edit and delete
- Side panel lists events for the selected date
- Local persistence using `localStorage` (no backend required yet)
- Ocean Professional theme styling

How to use:
1. Open the app in your browser.
2. The current month is shown; today is indicated by a small blue dot.
3. Click a day to select it and see its events in the right panel.
4. Click the FAB (+) to add an event (title, date, start/end times, description).
5. Click an event in the calendar or side panel to view, edit, or delete it.
6. Events persist in your browser storage and will be restored on refresh.

Environment:
- The app ignores any backend env vars for now and uses `localStorage`. No additional configuration is required.
