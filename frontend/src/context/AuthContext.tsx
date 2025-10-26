import { createContext, useContext } from 'react';
import { useAuthState } from '../hooks/useAuthState';
import type { AuthState } from '../types/auth';

const Ctx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const authState = useAuthState();

  return (
    <Ctx.Provider value={authState}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error('AuthContext missing');
  return v;
};
