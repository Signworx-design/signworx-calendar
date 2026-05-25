import { CalendarPlus, RefreshCw } from 'lucide-react';
import Button from '../ui/Button';

export default function CalendarToolbar({ onAdd, onRefresh }) {
  return (
    <div className="flex flex-col justify-between gap-3 border-b border-signred/60 pb-4 md:flex-row md:items-center">
      <div>
        <h1 className="text-2xl font-black uppercase tracking-[0.18em] text-white">Operations Calendar</h1>
        <p className="mt-1 text-sm text-gray-400">Installations, production, quotes, branding and site work.</p>
      </div>
      <div className="flex gap-2">
        <Button variant="secondary" onClick={onRefresh}><RefreshCw size={16} />Refresh</Button>
        <Button onClick={onAdd}><CalendarPlus size={16} />Add Event</Button>
      </div>
    </div>
  );
}
