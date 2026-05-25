import { CalendarPlus } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

const links = [
  ['/', 'Dashboard'],
  ['/calendar', 'Calendar'],
  ['/activity', 'Activity'],
  ['/settings', 'Settings'],
];

export default function TopNav({ onAdd }) {
  const { displayName } = useAuth();
  return (
    <header className="sticky top-0 z-40 border-b border-signred bg-black">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <NavLink to="/" className="shrink-0">
          <div className="text-lg font-black uppercase tracking-[0.22em] text-white">Signworx <span className="text-signred">Calendar</span></div>
          <div className="text-[10px] font-bold uppercase tracking-[0.26em] text-gray-500">{displayName || 'Private Operations'}</div>
        </NavLink>
        <nav className="hidden items-center gap-5 md:flex">
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} className={({ isActive }) => `text-xs font-bold uppercase tracking-[0.2em] transition ${isActive ? 'text-signred' : 'text-gray-300 hover:text-white'}`}>{label}</NavLink>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Button onClick={onAdd}><CalendarPlus size={16} />Add Event</Button>
        </div>
      </div>
    </header>
  );
}
