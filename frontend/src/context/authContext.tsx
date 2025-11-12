import { createContext } from 'react';
import type { AuthState } from '../types/auth';

export const AuthCtx = createContext<AuthState | null>(null);
