import { API_BASE_URL } from '../config/api';

const TOKEN_KEY = 'signworx_session_token';
const EXPIRY_KEY = 'signworx_session_expires_at';

export function getStoredSession() {
  return {
    token: localStorage.getItem(TOKEN_KEY),
    expiresAt: localStorage.getItem(EXPIRY_KEY),
  };
}

export function setStoredSession(token, expiresAt) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(EXPIRY_KEY, expiresAt);
}

export function clearStoredSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EXPIRY_KEY);
}

export async function apiRequest(path, options = {}) {
  const { token } = getStoredSession();
  const url = `${API_BASE_URL}/${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(url, { ...options, headers });
  const text = await response.text();

  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    console.error('Invalid JSON from API', { url, status: response.status, body: text });
    throw new Error(`Invalid JSON from API: ${text}`);
  }

  if (!response.ok || data.success === false) {
    const message = data.message || data.error || `API request failed: ${response.status}`;
    console.error('API request failed', { url, status: response.status, message, data });
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    error.url = url;
    throw error;
  }
  return data;
}
