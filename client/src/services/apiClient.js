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
