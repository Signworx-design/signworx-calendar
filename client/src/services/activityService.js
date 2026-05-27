import { getSupabase } from '../lib/supabaseClient';

export async function listActivity(eventId) {
  let query = getSupabase()
    .from('activity_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);

  if (eventId) {
    query = query.eq('event_id', eventId);
  }

  const { data, error } = await query;
  if (error) {
    console.warn('Could not load activity logs', error);
    return [];
  }

  return (data || []).map((item) => ({
    id: item.id,
    eventId: item.event_id,
    action: item.action,
    description: item.description,
    changedByName: item.changed_by_name,
    createdAt: item.created_at,
  }));
}
