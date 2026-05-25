import { labelize } from '../../utils/validation';

const styles = {
  planned: 'bg-zinc-800 text-zinc-200 border-zinc-600',
  in_progress: 'bg-signred text-white border-signred',
  completed: 'bg-emerald-950 text-emerald-200 border-emerald-700',
  cancelled: 'bg-zinc-900 text-zinc-400 border-zinc-700',
  needs_attention: 'bg-amber-950 text-amber-200 border-amber-600',
};

export default function StatusBadge({ status }) {
  return <span className={`inline-flex border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${styles[status] || styles.planned}`}>{labelize(status)}</span>;
}
