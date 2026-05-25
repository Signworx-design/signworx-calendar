import { eventRangeLabel } from '../../utils/dateUtils';
import StatusBadge from '../calendar/StatusBadge';
import EmptyState from '../ui/EmptyState';

export default function TodayJobs({ events }) {
  return (
    <section className="border border-line bg-coal p-4">
      <h2 className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-white">Today's Jobs</h2>
      <div className="space-y-2">
        {events.length ? events.map((event) => (
          <article key={event.id} className="border-l-2 border-signred bg-black p-3">
            <div className="flex items-start justify-between gap-3"><h3 className="font-bold text-white">{event.title}</h3><StatusBadge status={event.status} /></div>
            <p className="mt-1 text-sm text-gray-400">{event.clientName || 'No client'} · {eventRangeLabel(event)}</p>
          </article>
        )) : <EmptyState title="No jobs today" text="Today is clear in the shared calendar." />}
      </div>
    </section>
  );
}
