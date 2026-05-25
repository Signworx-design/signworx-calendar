import { apiRequest } from './apiClient';

export const listActivity = (eventId) => {
  const suffix = eventId ? `?eventId=${eventId}` : '';
  return apiRequest(`activity-list.php${suffix}`).then((data) => data.activity || []);
};
