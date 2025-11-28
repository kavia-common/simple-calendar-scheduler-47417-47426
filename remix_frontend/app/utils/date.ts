export type MonthMatrixCell = {
  date: Date;
  inMonth: boolean;
};

// PUBLIC_INTERFACE
export function getMonthMatrix(year: number, month: number): MonthMatrixCell[][] {
  /**
   * Generate a 6x7 matrix for the month view.
   * Starts the week on Sunday to match typical calendars.
   */
  const firstOfMonth = new Date(year, month, 1);
  const firstDayOfWeek = firstOfMonth.getDay(); // 0(Sun)..6(Sat)
  const startDate = new Date(year, month, 1 - firstDayOfWeek);

  const matrix: MonthMatrixCell[][] = [];
  for (let week = 0; week < 6; week++) {
    const row: MonthMatrixCell[] = [];
    for (let day = 0; day < 7; day++) {
      const idx = week * 7 + day;
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + idx);
      row.push({
        date: d,
        inMonth: d.getMonth() === month,
      });
    }
    matrix.push(row);
  }
  return matrix;
}

// PUBLIC_INTERFACE
export function toISODate(d: Date): string {
  /** Convert Date to YYYY-MM-DD in local time. */
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

// PUBLIC_INTERFACE
export function formatISODate(d: Date): string {
  /** Alias of toISODate for clarity in grid. */
  return toISODate(d);
}

// PUBLIC_INTERFACE
export function getToday(): Date {
  /** Today's date with time cleared to local midnight. */
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

// PUBLIC_INTERFACE
export function isSameDay(a: Date, b: Date): boolean {
  /** True if both dates share year/month/day. */
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// PUBLIC_INTERFACE
export function clampTimeOrder(start?: string, end?: string): { startTime?: string; endTime?: string } {
  /**
   * Ensure start <= end if both provided; if not, swap.
   * Times are "HH:MM".
   */
  if (start && end && start > end) {
    return { startTime: end, endTime: start };
  }
  return { startTime: start, endTime: end };
}
