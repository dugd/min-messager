import { createContext, useContext, useEffect, useState } from 'react';
import type { AuthUser } from '../services/api';
import { AuthApi } from '../services/api';


type AuthState = {
  user: AuthUser | null;
  loading: boolean;
  login: (email:string, password:string) => Promise<void>;
  register: (p:{name:string;username:string;email:string;password:string;password_confirmation:string}) => Promise<void>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<void>;
};

const Ctx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshMe = async () => {
    const token = localStorage.getItem('token');
    if (!token) { setUser(null); return; }
    try { setUser(await AuthApi.me()); } catch { setUser(null); }
  };

  useEffect(() => {
    refreshMe().finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const { user, token } = await AuthApi.login({ email, password });
    localStorage.setItem('token', token);
    setUser(user);
  };

  const register = async (p: {name:string;username:string;email:string;password:string;password_confirmation:string}) => {
    const { user, token } = await AuthApi.register(p);
    localStorage.setItem('token', token);
    setUser(user);
  };

  const logout = async () => {
    try { await AuthApi.logout(); } catch {}
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <Ctx.Provider value={{ user, loading, login, register, logout, refreshMe }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error('AuthContext missing');
  return v;
};
