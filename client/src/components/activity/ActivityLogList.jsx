import { formatDateTime } from '../../utils/dateUtils';
import { labelize } from '../../utils/validation';
import EmptyState from '../ui/EmptyState';

export default function ActivityLogList({ activity, compact = false }) {
  if (!activity?.length) return <EmptyState title="No activity yet" text="Updates will appear here as work changes." />;
  return (
    <div className={`space-y-2 ${compact ? 'max-h-72 overflow-auto' : ''}`}>
      {activity.map((item) => (
        <article key={item.id} className="border border-line bg-coal p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-signred">{labelize(item.action)}</span>
            <span className="text-[11px] text-gray-500">{formatDateTime(item.createdAt)}</span>
          </div>
          <p className="mt-2 text-sm text-gray-100">{item.description}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.12em] text-gray-500">{item.changedByName}</p>
        </article>
      ))}
    </div>
  );
}
