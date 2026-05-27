import { getSupabase } from '../lib/supabaseClient';

function toAppComment(row) {
  return {
    id: row.id,
    eventId: row.event_id,
    message: row.message,
    userName: row.user_name,
    createdAt: row.created_at,
  };
}

export async function listComments(eventId) {
  const { data, error } = await getSupabase()
    .from('comments')
    .select('*')
    .eq('event_id', eventId)
    .order('created_at', { ascending: true });

  if (error) {
    console.warn('Could not load comments', error);
    return [];
  }

  return (data || []).map(toAppComment);
}

export async function createComment(payload) {
  const { data, error } = await getSupabase()
    .from('comments')
    .insert({
      event_id: payload.eventId,
      message: payload.message?.trim(),
      user_name: payload.userName || 'Unknown User',
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message || 'Could not save comment.');
  }

  try {
    await getSupabase()
      .from('activity_logs')
      .insert({
        event_id: payload.eventId,
        action: 'comment_added',
        description: 'Added comment',
        changed_by_name: payload.changedByName || payload.userName || 'Unknown User',
      });
  } catch (activityError) {
    console.warn('Could not write comment activity', activityError);
  }

  return toAppComment(data);
}
