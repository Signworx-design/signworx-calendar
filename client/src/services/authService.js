import { clearStoredSession, setStoredSession } from './apiClient';

export async function unlock(password) {
  const data = {
    token: password || 'local-session',
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
  };
  setStoredSession(data.token, data.expiresAt);
  return data;
}

export async function verifySession() {
  return { success: true };
}

export async function logoutSession() {
  clearStoredSession();
}
