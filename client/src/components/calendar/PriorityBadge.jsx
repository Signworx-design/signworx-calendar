import { labelize } from '../../utils/validation';

const styles = {
  low: 'bg-zinc-900 text-zinc-400 border-zinc-700',
  normal: 'bg-zinc-800 text-zinc-100 border-zinc-500',
  high: 'bg-transparent text-red-200 border-signred',
  urgent: 'bg-signred text-white border-signred',
};

export default function PriorityBadge({ priority }) {
  return <span className={`inline-flex border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${styles[priority] || styles.normal}`}>{labelize(priority)}</span>;
}
