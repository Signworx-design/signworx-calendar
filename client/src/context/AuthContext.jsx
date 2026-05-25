import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { clearStoredSession, getStoredSession } from '../services/apiClient';
import { logoutSession, unlock } from '../services/authService';

const AuthContext = createContext(null);
const NAME_KEY = 'signworx_display_name';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredSession().token);
  const [expiresAt, setExpiresAt] = useState(() => getStoredSession().expiresAt);
  const [displayName, setDisplayNameState] = useState(() => localStorage.getItem(NAME_KEY) || '');
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (expiresAt && new Date(expiresAt) <= new Date()) {
      clearStoredSession();
      setToken(null);
      setExpiresAt(null);
    }
  }, [token, expiresAt]);

  async function unlockApp(password) {
    const data = await unlock(password);
    setToken(data.token);
    setExpiresAt(data.expiresAt);
    return data;
  }

  function saveDisplayName(name) {
    const clean = name.trim();
    localStorage.setItem(NAME_KEY, clean);
    setDisplayNameState(clean);
  }

  async function logout() {
    await logoutSession();
    setToken(null);
    setExpiresAt(null);
  }

  const value = useMemo(() => ({
    token,
    expiresAt,
    displayName,
    checking,
    isUnlocked: true,
    needsName: !displayName,
    unlockApp,
    saveDisplayName,
    logout,
  }), [token, expiresAt, displayName, checking]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
