import { Edit, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { createComment, listComments } from '../../services/commentService';
import { listActivity } from '../../services/activityService';
import { eventRangeLabel, formatDateTime } from '../../utils/dateUtils';
import { labelize } from '../../utils/validation';
import ActivityLogList from '../activity/ActivityLogList';
import Button from '../ui/Button';
import EmptyState from '../ui/EmptyState';
import Modal from '../ui/Modal';
import Textarea from '../ui/Textarea';
import PriorityBadge from './PriorityBadge';
import StatusBadge from './StatusBadge';

export default function EventDetailsModal({ open, event, onClose, onEdit, onDelete }) {
  const { displayName } = useAuth();
  const [comments, setComments] = useState([]);
  const [activity, setActivity] = useState([]);
  const [message, setMessage] = useState('');
  const [commentError, setCommentError] = useState('');

  useEffect(() => {
    async function load() {
      if (!event?.id) return;
      const [nextComments, nextActivity] = await Promise.all([listComments(event.id), listActivity(event.id)]);
      setComments(nextComments);
      setActivity(nextActivity);
    }
    if (open) load();
  }, [open, event]);

  if (!event) return null;

  async function addComment(e) {
    e.preventDefault();
    if (!message.trim()) return;
    setCommentError('');
    try {
      const name = displayName || 'Unknown User';
      const comment = await createComment({ eventId: event.id, message, userName: name, changedByName: name });
      setComments((prev) => [...prev, comment]);
      setMessage('');
      setActivity(await listActivity(event.id));
      window.dispatchEvent(new CustomEvent('events:changed'));
    } catch (error) {
      console.error('Could not save comment', error);
      setCommentError(error.message || 'Could not save comment.');
    }
  }

  return (
    <Modal open={open} title="Calendar Item" onClose={onClose} wide>
      <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
        <section>
          <div className="border-b border-signred/60 pb-3">
            <h2 className="text-2xl font-black uppercase tracking-[0.16em] text-white">{event.title}</h2>
            <div className="mt-3 flex flex-wrap gap-2"><StatusBadge status={event.status} /><PriorityBadge priority={event.priority} /></div>
          </div>
          <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
            {[
              ['Type', labelize(event.type)],
              ['Client', event.clientName || 'Not set'],
              ['Site', event.siteLocation || 'Not set'],
              ['When', eventRangeLabel(event)],
              ['Assigned', event.assignedTo || 'Not set'],
              ['Updated by', event.updatedByName || event.createdByName || 'Unknown'],
            ].map(([label, value]) => (
              <div key={label} className="border border-line bg-black p-3">
                <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500">{label}</dt>
                <dd className="mt-1 text-gray-100">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4 border border-line bg-black p-3">
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500">Notes</div>
            <p className="mt-2 whitespace-pre-wrap text-sm text-gray-200">{event.notes || 'No notes added.'}</p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={onEdit}><Edit size={16} />Edit</Button>
            <Button variant="danger" onClick={() => onDelete(event)}><Trash2 size={16} />Delete</Button>
            <Button variant="secondary" onClick={onClose}>Close</Button>
          </div>
        </section>
        <aside className="grid gap-4">
          <section className="border border-line bg-black p-3">
            <h3 className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-white">Comments</h3>
            <div className="max-h-52 space-y-2 overflow-auto">
              {comments.length ? comments.map((comment) => (
                <div key={comment.id} className="border border-line bg-coal p-3">
                  <div className="flex justify-between gap-2 text-[11px] uppercase tracking-[0.12em] text-gray-500"><span>{comment.userName}</span><span>{formatDateTime(comment.createdAt)}</span></div>
                  <p className="mt-2 text-sm text-gray-100">{comment.message}</p>
                </div>
              )) : <EmptyState title="No comments" text="Add the first update for this job." />}
            </div>
            <form onSubmit={addComment} className="mt-3 grid gap-2">
              <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Add a comment" />
              {commentError && <div className="border border-signred bg-black p-2 text-xs text-red-200">{commentError}</div>}
              <Button type="submit">Save Comment</Button>
            </form>
          </section>
          <section className="border border-line bg-black p-3">
            <h3 className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-white">Activity</h3>
            <ActivityLogList activity={activity} compact />
          </section>
        </aside>
      </div>
    </Modal>
  );
}
