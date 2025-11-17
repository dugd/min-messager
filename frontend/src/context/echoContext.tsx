import { createContext } from 'react';
import type Echo from 'laravel-echo';

export interface EchoContextType {
  echo: Echo<any> | null;
}

export const EchoCtx = createContext<EchoContextType | undefined>(undefined);
