import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { createEvent, deleteEvent, listEvents, updateEvent } from '../../services/eventService';
import CalendarToolbar from './CalendarToolbar';
import EventDetailsModal from './EventDetailsModal';
import EventFormModal from './EventFormModal';
import FiltersBar from './FiltersBar';

function toCalendarEvent(event) {
  const allDay = Boolean(Number(event.allDay));
  return {
    id: String(event.id),
    title: event.title,
    start: allDay || !event.startTime ? event.startDate : `${event.startDate}T${event.startTime}`,
    end: allDay || !event.endTime ? event.endDate : `${event.endDate}T${event.endTime}`,
    allDay,
    classNames: [`status-${event.status}`, `priority-${event.priority}`],
    extendedProps: event,
  };
}

export default function CalendarView() {
  const { displayName } = useAuth();
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({ search: '', status: '', type: '', priority: '' });
  const [addingDate, setAddingDate] = useState(null);
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);
  const [loadError, setLoadError] = useState('');

  async function load() {
    try {
      setLoadError('');
      setEvents(await listEvents());
    } catch (error) {
      console.error('Could not load events', error);
      setLoadError(error.message || 'Could not load events from the PHP API.');
    }
  }

  useEffect(() => {
    load();
    const handler = () => load();
    window.addEventListener('events:changed', handler);
    return () => window.removeEventListener('events:changed', handler);
  }, []);

  const filtered = useMemo(() => events.filter((event) => {
    const haystack = `${event.title} ${event.clientName} ${event.siteLocation} ${event.assignedTo}`.toLowerCase();
    return (!filters.search || haystack.includes(filters.search.toLowerCase()))
      && (!filters.status || event.status === filters.status)
      && (!filters.type || event.type === filters.type)
      && (!filters.priority || event.priority === filters.priority);
  }), [events, filters]);

  function withUser(event) {
    const name = displayName || 'Unknown User';
    return {
      ...event,
      userName: name,
      changedByName: name,
      createdByName: event.createdByName || name,
      updatedByName: name,
    };
  }

  async function save(event) {
    await updateEvent(withUser(event));
    setEditing(null);
    setSelected(null);
    await load();
  }

  async function remove(event) {
    if (!confirm(`Delete "${event.title}"? This cannot be undone.`)) return;
    await deleteEvent(event.id, displayName || 'Unknown User');
    setSelected(null);
    await load();
  }

  async function drag(info) {
    if (!confirm('Save this changed date?')) {
      info.revert();
      return;
    }
    try {
      const original = info.event.extendedProps;
      await updateEvent(withUser({
        ...original,
        startDate: info.event.startStr.slice(0, 10),
        endDate: (info.event.endStr || info.event.startStr).slice(0, 10),
      }));
      await load();
    } catch (error) {
      console.error('Could not save dragged event', error);
      alert(error.message || 'Could not save event. Check that the PHP API is running.');
      info.revert();
    }
  }

  return (
    <div className="space-y-4">
      <CalendarToolbar onAdd={() => setAddingDate(new Date().toISOString().slice(0, 10))} onRefresh={load} />
      <FiltersBar filters={filters} setFilters={setFilters} />
      {loadError && <div className="border border-signred bg-black p-3 text-sm text-red-200">{loadError}</div>}
      <section className="calendar-wrap border border-line bg-coal p-2 md:p-4">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
          initialView={window.innerWidth < 760 ? 'listWeek' : 'dayGridMonth'}
          headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,listWeek' }}
          events={filtered.map(toCalendarEvent)}
          dateClick={(info) => setAddingDate(info.dateStr)}
          eventClick={(info) => setSelected(info.event.extendedProps)}
          eventDrop={drag}
          editable
          height="auto"
          eventDisplay="block"
        />
      </section>
      <EventFormModal open={Boolean(addingDate)} startDate={addingDate} onClose={() => setAddingDate(null)} onSave={async (event) => {
        await createEvent(withUser(event));
        setAddingDate(null);
        await load();
      }} />
      <EventDetailsModal open={Boolean(selected)} event={selected} onClose={() => setSelected(null)} onEdit={() => { setEditing(selected); setSelected(null); }} onDelete={remove} />
      <EventFormModal open={Boolean(editing)} event={editing} onClose={() => setEditing(null)} onSave={save} />
    </div>
  );
}
