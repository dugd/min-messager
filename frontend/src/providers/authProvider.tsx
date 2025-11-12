import type { PropsWithChildren } from 'react';
import { AuthCtx } from '../context/authContext';
import { useAuthState } from '../hooks/useAuthState';

export function AuthProvider({ children }: PropsWithChildren) {
    const value = useAuthState();
    return <AuthCtx.Provider value={value}> {children}</AuthCtx.Provider>;
}
