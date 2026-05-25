import { LockKeyhole } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function PasswordPage() {
  const { isUnlocked, unlockApp } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  if (isUnlocked) return <Navigate to="/" replace />;

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await unlockApp(password);
    } catch {
      setError('Wrong password. Access was not unlocked.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-4 text-white">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#050505_0%,#111_48%,#050505_100%)]" />
      <motion.form initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} onSubmit={submit} className="relative w-full max-w-md border border-line bg-coal p-6 shadow-redline">
        <div className="mb-6 border-b border-signred pb-5">
          <div className="text-2xl font-black uppercase tracking-[0.24em]">Signworx</div>
          <div className="mt-1 text-xs font-bold uppercase tracking-[0.28em] text-signred">Private Calendar Access</div>
        </div>
        <div className="mb-5 flex items-center gap-3 text-gray-300"><LockKeyhole className="text-signred" /><span className="text-sm">Enter the shared private password to continue.</span></div>
        <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} error={error} autoFocus />
        <Button type="submit" className="mt-4 w-full" disabled={loading}>{loading ? 'Unlocking' : 'Unlock Calendar'}</Button>
      </motion.form>
    </main>
  );
}
