import { eventRangeLabel } from '../../utils/dateUtils';
import PriorityBadge from '../calendar/PriorityBadge';
import EmptyState from '../ui/EmptyState';

export default function UpcomingJobs({ events }) {
  return (
    <section className="border border-line bg-coal p-4">
      <h2 className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-white">Upcoming Jobs</h2>
      <div className="space-y-2">
        {events.length ? events.slice(0, 8).map((event) => (
          <article key={event.id} className="bg-black p-3">
            <div className="flex items-start justify-between gap-3"><h3 className="font-bold text-white">{event.title}</h3><PriorityBadge priority={event.priority} /></div>
            <p className="mt-1 text-sm text-gray-400">{eventRangeLabel(event)}</p>
          </article>
        )) : <EmptyState title="No upcoming jobs" text="Add work from the calendar or top bar." />}
      </div>
    </section>
  );
}
