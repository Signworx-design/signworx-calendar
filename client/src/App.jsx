import { Navigate, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import AppShell from './components/layout/AppShell';
import Button from './components/ui/Button';
import Input from './components/ui/Input';
import { useAuth } from './context/AuthContext';
import ActivityPage from './pages/ActivityPage';
import CalendarPage from './pages/CalendarPage';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';

function NameGate({ children }) {
  const { needsName, displayName, saveDisplayName } = useAuth();
  const [nextName, setNextName] = useState(displayName);
  if (!needsName) return children;
  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-4 text-white">
      <form onSubmit={(e) => { e.preventDefault(); saveDisplayName(nextName); }} className="w-full max-w-md border border-line bg-coal p-6 shadow-redline">
        <h1 className="border-b border-signred pb-4 text-xl font-black uppercase tracking-[0.18em]">Who is using the calendar?</h1>
        <div className="mt-5 grid gap-4">
          <Input label="Display name" value={nextName} placeholder="Boss, Admin, Wade, Production" onChange={(e) => setNextName(e.target.value)} autoFocus />
          <Button type="submit" disabled={!nextName.trim()}>Continue</Button>
        </div>
      </form>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<NameGate><AppShell /></NameGate>}>
        <Route index element={<DashboardPage />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="activity" element={<ActivityPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
