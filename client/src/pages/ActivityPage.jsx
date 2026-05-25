import { useEffect, useMemo, useState } from 'react';
import ActivityLogList from '../components/activity/ActivityLogList';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { listActivity } from '../services/activityService';
import { labelize } from '../utils/validation';

const ACTIONS = ['created', 'updated', 'status_changed', 'deleted', 'comment_added'];

export default function ActivityPage() {
  const [activity, setActivity] = useState([]);
  const [eventId, setEventId] = useState('');
  const [action, setAction] = useState('');

  useEffect(() => {
    listActivity(eventId).then(setActivity);
  }, [eventId]);

  const filtered = useMemo(() => activity.filter((item) => !action || item.action === action), [activity, action]);

  return (
    <div className="space-y-4">
      <h1 className="border-b border-signred pb-4 text-2xl font-black uppercase tracking-[0.18em]">Activity Log</h1>
      <div className="grid gap-3 border border-line bg-coal p-3 md:grid-cols-2">
        <Input label="Filter by event ID" type="number" value={eventId} onChange={(e) => setEventId(e.target.value)} />
        <Select label="Filter by action" value={action} onChange={(e) => setAction(e.target.value)}>
          <option value="">All actions</option>
          {ACTIONS.map((item) => <option key={item} value={item}>{labelize(item)}</option>)}
        </Select>
      </div>
      <ActivityLogList activity={filtered} />
    </div>
  );
}
