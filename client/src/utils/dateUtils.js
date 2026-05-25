export function formatDateTime(value) {
  if (!value) return 'Not set';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-ZA', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

export function eventRangeLabel(event) {
  const start = event.startTime ? `${event.startDate} ${event.startTime}` : event.startDate;
  const end = event.endTime ? `${event.endDate} ${event.endTime}` : event.endDate;
  return start === end ? start : `${start} to ${end}`;
}

export function thisWeekRange() {
  const now = new Date();
  const day = now.getDay() || 7;
  const start = new Date(now);
  start.setDate(now.getDate() - day + 1);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 7);
  return { start, end };
}
