import { Search } from 'lucide-react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { EVENT_TYPES, PRIORITIES, STATUSES, labelize } from '../../utils/validation';

export default function FiltersBar({ filters, setFilters }) {
  const update = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));
  return (
    <div className="grid gap-3 border border-line bg-coal p-3 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-9 text-gray-500" size={16} />
        <Input label="Search" value={filters.search} onChange={(e) => update('search', e.target.value)} className="pl-9" placeholder="Client, site, title" />
      </div>
      <Select label="Status" value={filters.status} onChange={(e) => update('status', e.target.value)}>
        <option value="">All statuses</option>
        {STATUSES.map((item) => <option key={item} value={item}>{labelize(item)}</option>)}
      </Select>
      <Select label="Type" value={filters.type} onChange={(e) => update('type', e.target.value)}>
        <option value="">All types</option>
        {EVENT_TYPES.map((item) => <option key={item} value={item}>{labelize(item)}</option>)}
      </Select>
      <Select label="Priority" value={filters.priority} onChange={(e) => update('priority', e.target.value)}>
        <option value="">All priorities</option>
        {PRIORITIES.map((item) => <option key={item} value={item}>{labelize(item)}</option>)}
      </Select>
    </div>
  );
}
