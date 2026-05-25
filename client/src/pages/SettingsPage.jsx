import { Save } from 'lucide-react';
import { useState } from 'react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { APP_VERSION } from '../config/api';
import { formatDateTime } from '../utils/dateUtils';

export default function SettingsPage() {
  const { displayName, saveDisplayName, expiresAt } = useAuth();
  const [name, setName] = useState(displayName);
  return (
    <div className="grid gap-4">
      <h1 className="border-b border-signred pb-4 text-2xl font-black uppercase tracking-[0.18em]">Settings</h1>
      <Card className="max-w-xl">
        <div className="grid gap-4">
          <Input label="Current display name" value={name} onChange={(e) => setName(e.target.value)} />
          <Button onClick={() => saveDisplayName(name)} disabled={!name.trim()}><Save size={16} />Save Name</Button>
          <div className="border-t border-line pt-4 text-sm text-gray-400">Access mode: <span className="text-white">No password screen</span></div>
          {expiresAt && <div className="text-sm text-gray-400">Stored session expires: <span className="text-white">{formatDateTime(expiresAt)}</span></div>}
          <div className="text-sm text-gray-400">App version: <span className="text-white">{APP_VERSION}</span></div>
        </div>
      </Card>
    </div>
  );
}
