import { CalendarPlus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import ActivityLogList from '../components/activity/ActivityLogList';
import DashboardStats from '../components/dashboard/DashboardStats';
import TodayJobs from '../components/dashboard/TodayJobs';
import UpcomingJobs from '../components/dashboard/UpcomingJobs';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import EventFormModal from '../components/calendar/EventFormModal';
import { useAuth } from '../context/AuthContext';
import { listActivity } from '../services/activityService';
import { createEvent, listEvents } from '../services/eventService';
import { thisWeekRange } from '../utils/dateUtils';

export default function DashboardPage() {
  const { displayName } = useAuth();
  const [events, setEvents] = useState([]);
  const [activity, setActivity] = useState([]);
  const [adding, setAdding] = useState(false);

  async function load() {
    const [nextEvents, nextActivity] = await Promise.all([listEvents(), listActivity()]);
    setEvents(nextEvents);
    setActivity(nextActivity);
  }

  useEffect(() => {
    load();
    const handler = () => load();
    window.addEventListener('events:changed', handler);
    return () => window.removeEventListener('events:changed', handler);
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const { start, end } = thisWeekRange();
  const stats = useMemo(() => ({
    today: events.filter((event) => event.startDate <= today && event.endDate >= today).length,
    upcoming: events.filter((event) => event.startDate > today).length,
    urgent: events.filter((event) => event.priority === 'urgent').length,
    needsAttention: events.filter((event) => event.status === 'needs_attention').length,
    completedWeek: events.filter((event) => event.status === 'completed' && new Date(event.updatedAt) >= start && new Date(event.updatedAt) < end).length,
  }), [events, today, start, end]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-3 border-b border-signred pb-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-[0.18em]">Operations Dashboard</h1>
          <p className="mt-1 text-sm text-gray-400">Shared production and installation calendar control.</p>
        </div>
        <Button onClick={() => setAdding(true)}><CalendarPlus size={16} />Quick Add Event</Button>
      </div>
      <DashboardStats stats={stats} />
      <div className="grid gap-4 lg:grid-cols-2">
        <TodayJobs events={events.filter((event) => event.startDate <= today && event.endDate >= today)} />
        <UpcomingJobs events={events.filter((event) => event.startDate > today)} />
      </div>
      <Card>
        <h2 className="mb-3 text-sm font-black uppercase tracking-[0.18em]">Recent Activity</h2>
        <ActivityLogList activity={activity.slice(0, 6)} compact />
      </Card>
      <EventFormModal open={adding} onClose={() => setAdding(false)} onSave={async (event) => {
        const name = displayName || 'Unknown User';
        await createEvent({ ...event, userName: name, changedByName: name, createdByName: name, updatedByName: name });
        setAdding(false);
        await load();
      }} />
    </div>
  );
}
