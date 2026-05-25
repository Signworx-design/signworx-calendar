import Card from '../ui/Card';

export default function DashboardStats({ stats }) {
  const items = [
    ['Today', stats.today],
    ['Upcoming', stats.upcoming],
    ['Urgent', stats.urgent],
    ['Needs Attention', stats.needsAttention],
    ['Completed This Week', stats.completedWeek],
  ];
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {items.map(([label, value]) => (
        <Card key={label} className={label.includes('Urgent') || label.includes('Attention') ? 'border-signred' : ''}>
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500">{label}</div>
          <div className="mt-2 text-3xl font-black text-white">{value}</div>
        </Card>
      ))}
    </div>
  );
}
