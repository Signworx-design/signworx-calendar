export const EVENT_TYPES = ['installation', 'maintenance', 'quote', 'meeting', 'delivery', 'production', 'follow_up', 'apparel', 'vehicle_branding', 'signage', 'other'];
export const STATUSES = ['planned', 'in_progress', 'completed', 'cancelled', 'needs_attention'];
export const PRIORITIES = ['low', 'normal', 'high', 'urgent'];

export function labelize(value) {
  return String(value || '').replaceAll('_', ' ').toUpperCase();
}

export function validateEvent(event) {
  const errors = {};
  if (!event.title?.trim()) errors.title = 'Title is required.';
  if (!event.type) errors.type = 'Type is required.';
  if (!event.startDate) errors.startDate = 'Start date is required.';
  if (!event.endDate) errors.endDate = 'End date is required.';
  if (event.startDate && event.endDate && event.endDate < event.startDate) errors.endDate = 'End date cannot be before start date.';
  if (!event.status) errors.status = 'Status is required.';
  if (!event.priority) errors.priority = 'Priority is required.';
  return errors;
}
