import { useEffect, useRef, useState, type PropsWithChildren } from 'react';
import type Echo from 'laravel-echo';
import { EchoCtx } from '../context/echoContext';
import { createEchoInstance } from '../services/echo';
import { useAuth } from '../hooks/useAuth';
import { getToken } from '../utils/tokenStorage';
import { setEchoInstance } from '../api/shared/client';

export function EchoProvider({ children }: PropsWithChildren) {
  const [echo, setEcho] = useState<Echo<any> | null>(null);
  const echoRef = useRef<Echo<any> | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const token = getToken();

    if (user && token && !echoRef.current) {
      const echoInstance = createEchoInstance({ authToken: token });
      echoRef.current = echoInstance;
      setEcho(echoInstance);
      setEchoInstance(echoInstance);
    } else if (!user && echoRef.current) {
      echoRef.current.disconnect();
      echoRef.current = null;
      setEcho(null);
    }

    return () => {
      if (echoRef.current) {
        echoRef.current.disconnect();
        echoRef.current = null;
      }
    };
  }, [user]);

  return <EchoCtx.Provider value={{ echo }}>{children}</EchoCtx.Provider>;
}
