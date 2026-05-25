import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import TopNav from './TopNav';
import MobileNav from './MobileNav';
import EventFormModal from '../calendar/EventFormModal';
import { createEvent } from '../../services/eventService';
import { useAuth } from '../../context/AuthContext';

export default function AppShell() {
  const [adding, setAdding] = useState(false);
  const { displayName } = useAuth();

  async function save(event) {
    const name = displayName || 'Unknown User';
    await createEvent({ ...event, userName: name, changedByName: name, createdByName: name, updatedByName: name });
    setAdding(false);
    window.dispatchEvent(new CustomEvent('events:changed'));
  }

  return (
    <div className="min-h-screen bg-ink text-white">
      <TopNav onAdd={() => setAdding(true)} />
      <main className="mx-auto max-w-7xl px-4 pb-28 pt-5 md:pb-8">
        <Outlet />
      </main>
      <MobileNav onAdd={() => setAdding(true)} />
      <EventFormModal open={adding} onClose={() => setAdding(false)} onSave={save} />
    </div>
  );
}
