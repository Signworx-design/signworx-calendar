import { Activity, CalendarDays, Home, Plus, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const links = [
  ['/', Home, 'Home'],
  ['/calendar', CalendarDays, 'Calendar'],
  ['/activity', Activity, 'Activity'],
  ['/settings', Settings, 'Settings'],
];

export default function MobileNav({ onAdd }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-5 border-t border-signred bg-black md:hidden">
      {links.map(([to, Icon, label]) => (
        <NavLink key={to} to={to} className={({ isActive }) => `flex flex-col items-center gap-1 px-1 py-3 text-[10px] uppercase tracking-[0.12em] ${isActive ? 'text-signred' : 'text-gray-400'}`}>
          <Icon size={18} />
          {label}
        </NavLink>
      ))}
      <button onClick={onAdd} className="flex flex-col items-center gap-1 bg-signred px-1 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
        <Plus size={18} />
        Add
      </button>
    </nav>
  );
}
