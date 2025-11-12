import { useContext } from 'react';
import { AuthCtx } from '../context/authContext';
import type { AuthState } from '../types/auth';

export const useAuth = (): AuthState => {
  const v = useContext(AuthCtx);
  if (!v) throw new Error('AuthContext missing');
  return v;
};
