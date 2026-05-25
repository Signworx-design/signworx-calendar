import { apiRequest } from './apiClient';

export const listComments = (eventId) => apiRequest(`comments-list.php?eventId=${eventId}`).then((data) => data.comments || []);
export const createComment = (payload) => apiRequest('comments-create.php', { method: 'POST', body: JSON.stringify(payload) }).then((data) => data.comment);
