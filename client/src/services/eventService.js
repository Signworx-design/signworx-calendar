import { apiRequest } from './apiClient';

export const listEvents = () => apiRequest('events-list.php').then((data) => data.events || []);
export const createEvent = (event) => apiRequest('events-create.php', { method: 'POST', body: JSON.stringify(event) }).then((data) => data.event);
export const updateEvent = (event) => apiRequest('events-update.php', { method: 'POST', body: JSON.stringify(event) }).then((data) => data.event);
export const deleteEvent = (id, userName) => apiRequest('events-delete.php', { method: 'POST', body: JSON.stringify({ id, userName }) });
