import { apiRequest, clearStoredSession, setStoredSession } from './apiClient';

export async function unlock(password) {
  const data = await apiRequest('unlock.php', {
    method: 'POST',
    body: JSON.stringify({ password }),
  });
  setStoredSession(data.token, data.expiresAt);
  return data;
}

export async function verifySession() {
  return apiRequest('verify-session.php');
}

export async function logoutSession() {
  try {
    await apiRequest('logout.php', { method: 'POST' });
  } finally {
    clearStoredSession();
  }
}
