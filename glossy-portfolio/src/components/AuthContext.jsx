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

async function importAesGcmKeyFromEnv() {
  const b64 = import.meta.env.VITE_ADMIN_PASSWORD_KEY;
  if (!b64) throw new Error('Missing VITE_ADMIN_PASSWORD_KEY');
  const raw = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  if (raw.byteLength !== 32) throw new Error('Key must be 32 bytes');
  return await crypto.subtle.importKey('raw', raw, 'AES-GCM', false, ['decrypt']);
}

function base64ToUint8(b64) {
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
}

function concatUint8(a, b) {
  const out = new Uint8Array(a.length + b.length);
  out.set(a, 0);
  out.set(b, a.length);
  return out;
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

      // Validate username first
      if (username !== props.username) return false;

      if (props.algo !== 'aes-256-gcm') throw new Error('Unsupported algo');
      const key = await importAesGcmKeyFromEnv();
      const iv = base64ToUint8(props.iv);
      const tag = base64ToUint8(props.tag);
      const ct = base64ToUint8(props.ciphertext);
      const ctWithTag = concatUint8(ct, tag); // WebCrypto expects tag appended

      let decrypted;
      try {
        decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ctWithTag);
      } catch (decErr) {
        console.error('Decryption failed');
        return false;
      }

      const plaintext = new TextDecoder().decode(new Uint8Array(decrypted));
      const ok = password === plaintext;
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