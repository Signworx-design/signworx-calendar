import { useEffect, useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';
import { EVENT_TYPES, PRIORITIES, STATUSES, labelize, validateEvent } from '../../utils/validation';

const blank = {
  title: '',
  type: 'installation',
  clientName: '',
  siteLocation: '',
  startDate: new Date().toISOString().slice(0, 10),
  endDate: new Date().toISOString().slice(0, 10),
  startTime: '',
  endTime: '',
  allDay: 1,
  assignedTo: '',
  status: 'planned',
  priority: 'normal',
  notes: '',
};

export default function EventFormModal({ open, event, onClose, onSave, startDate }) {
  const [form, setForm] = useState(blank);
  const [errors, setErrors] = useState({});
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({ ...blank, ...(event || {}), startDate: event?.startDate || startDate || blank.startDate, endDate: event?.endDate || startDate || blank.endDate });
      setErrors({});
      setSaveError('');
    }
  }, [open, event, startDate]);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  async function submit(e) {
    e.preventDefault();
    const nextErrors = validateEvent(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setSaving(true);
    setSaveError('');
    try {
      await onSave(form);
    } catch (error) {
      console.error('Could not save event', error);
      setSaveError(error.message || 'Could not save event. Check that the PHP API is running.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} title={event?.id ? 'Edit Calendar Item' : 'Add Calendar Item'} onClose={onClose} wide>
      <form onSubmit={submit} className="grid gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Title" value={form.title} onChange={(e) => update('title', e.target.value)} error={errors.title} />
          <Select label="Type" value={form.type} onChange={(e) => update('type', e.target.value)} error={errors.type}>{EVENT_TYPES.map((item) => <option key={item} value={item}>{labelize(item)}</option>)}</Select>
          <Input label="Client name" value={form.clientName || ''} onChange={(e) => update('clientName', e.target.value)} />
          <Input label="Site location" value={form.siteLocation || ''} onChange={(e) => update('siteLocation', e.target.value)} />
          <Input label="Start date" type="date" value={form.startDate} onChange={(e) => update('startDate', e.target.value)} error={errors.startDate} />
          <Input label="End date" type="date" value={form.endDate} onChange={(e) => update('endDate', e.target.value)} error={errors.endDate} />
          {!form.allDay && <Input label="Start time" type="time" value={form.startTime || ''} onChange={(e) => update('startTime', e.target.value)} />}
          {!form.allDay && <Input label="End time" type="time" value={form.endTime || ''} onChange={(e) => update('endTime', e.target.value)} />}
          <Input label="Assigned to" value={form.assignedTo || ''} onChange={(e) => update('assignedTo', e.target.value)} />
          <Select label="Status" value={form.status} onChange={(e) => update('status', e.target.value)} error={errors.status}>{STATUSES.map((item) => <option key={item} value={item}>{labelize(item)}</option>)}</Select>
          <Select label="Priority" value={form.priority} onChange={(e) => update('priority', e.target.value)} error={errors.priority}>{PRIORITIES.map((item) => <option key={item} value={item}>{labelize(item)}</option>)}</Select>
          <label className="flex items-center gap-3 border border-line bg-black px-3 py-3 text-sm text-gray-200">
            <input type="checkbox" checked={Boolean(form.allDay)} onChange={(e) => update('allDay', e.target.checked ? 1 : 0)} />
            ALL DAY
          </label>
        </div>
        <Textarea label="Notes" value={form.notes || ''} onChange={(e) => update('notes', e.target.value)} />
        {saveError && (
          <div className="border border-signred bg-black p-3 text-sm text-red-200">
            Could not save event. Check that the PHP API is running.
            <div className="mt-1 text-xs text-red-300">{saveError}</div>
          </div>
        )}
        <div className="flex justify-end gap-2 border-t border-line pt-4">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={saving}>{saving ? 'Saving' : 'Save Event'}</Button>
        </div>
      </form>
    </Modal>
  );
}
