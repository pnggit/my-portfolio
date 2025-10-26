import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext({ isAdmin: false, login: async () => false, logout: () => {} });

function parseProperties(text) {
  const result = {};
  text.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const idx = trimmed.indexOf('=');
    if (idx > -1) {
      const key = trimmed.slice(0, idx).trim();
      const value = trimmed.slice(idx + 1).trim();
      result[key] = value;
    }
  });
  return result;
}

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const persisted = localStorage.getItem('isAdmin');
    if (persisted === 'true') setIsAdmin(true);
  }, []);

  const login = async (username, password) => {
    try {
      const res = await fetch('/admin.properties');
      if (!res.ok) throw new Error('Failed to load properties');
      const text = await res.text();
      const props = parseProperties(text);
      const ok = username === props.username && password === props.password;
      if (ok) {
        setIsAdmin(true);
        localStorage.setItem('isAdmin', 'true');
        return true;
      }
      return false;
    } catch (e) {
      console.error('Login error:', e);
      return false;
    }
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem('isAdmin');
  };

  const value = useMemo(() => ({ isAdmin, login, logout }), [isAdmin]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}