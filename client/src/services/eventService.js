import { getSupabase } from '../lib/supabaseClient';

function toAppEvent(row) {
  return {
    id: row.id,
    title: row.title || '',
    type: row.type || 'installation',
    clientName: row.client_name || '',
    siteLocation: row.site_location || '',
    startDate: row.start_date || '',
    endDate: row.end_date || row.start_date || '',
    startTime: '',
    endTime: '',
    allDay: row.all_day ? 1 : 0,
    assignedTo: row.assigned_to || '',
    status: row.status || 'planned',
    priority: row.priority || 'normal',
    notes: row.notes || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    createdByName: '',
    updatedByName: '',
  };
}

function toSupabaseEvent(event) {
  return {
    title: event.title?.trim(),
    type: event.type || null,
    client_name: event.clientName || null,
    site_location: event.siteLocation || null,
    start_date: event.startDate,
    end_date: event.endDate || event.startDate,
    assigned_to: event.assignedTo || null,
    status: event.status || null,
    priority: event.priority || null,
    all_day: Boolean(event.allDay),
    notes: event.notes || null,
    updated_at: new Date().toISOString(),
  };
}

function assertValidEvent(event) {
  if (!event.title?.trim()) {
    throw new Error('Title is required.');
  }
  if (!event.startDate) {
    throw new Error('Start date is required.');
  }
}

function raise(error) {
  if (error) {
    throw new Error(error.message || 'Supabase request failed.');
  }
}

async function logActivity(event, action, description) {
  try {
    await getSupabase()
      .from('activity_logs')
      .insert({
        event_id: event.id,
        action,
        description,
        changed_by_name: event.updatedByName || event.createdByName || event.changedByName || event.userName || 'Calendar',
      });
  } catch (error) {
    console.warn('Could not write activity log', error);
  }
}

export async function listEvents() {
  const { data, error } = await getSupabase()
    .from('events')
    .select('*')
    .order('start_date', { ascending: true })
    .order('created_at', { ascending: false });

  raise(error);
  return (data || []).map(toAppEvent);
}

export async function getEvents() {
  return listEvents();
}

export async function createEvent(event) {
  assertValidEvent(event);
  const { data, error } = await getSupabase()
    .from('events')
    .insert(toSupabaseEvent(event))
    .select()
    .single();

  raise(error);
  await logActivity({ ...event, id: data.id }, 'created', `Created event: ${data.title}`);
  window.dispatchEvent(new CustomEvent('events:changed'));
  return toAppEvent(data);
}

export async function updateEvent(eventOrId, nextEvent) {
  const id = typeof eventOrId === 'object' ? eventOrId.id : eventOrId;
  const event = typeof eventOrId === 'object' ? eventOrId : nextEvent;
  if (!id) {
    throw new Error('Event id is required.');
  }
  assertValidEvent(event);

  const { data, error } = await getSupabase()
    .from('events')
    .update(toSupabaseEvent(event))
    .eq('id', id)
    .select()
    .single();

  raise(error);
  await logActivity({ ...event, id }, 'updated', `Updated event: ${data.title}`);
  window.dispatchEvent(new CustomEvent('events:changed'));
  return toAppEvent(data);
}

export async function deleteEvent(id) {
  if (!id) {
    throw new Error('Event id is required.');
  }

  const { data: existing } = await getSupabase()
    .from('events')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  const { error } = await getSupabase()
    .from('events')
    .delete()
    .eq('id', id);

  raise(error);
  if (existing) {
    await logActivity(toAppEvent(existing), 'deleted', `Deleted event: ${existing.title}`);
  }
  window.dispatchEvent(new CustomEvent('events:changed'));
  return { deletedId: id };
}
