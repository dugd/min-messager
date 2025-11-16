import { useContext } from 'react';
import { EchoCtx, type EchoContextType } from '../context/echoContext';

export function useEcho(): EchoContextType {
  const context = useContext(EchoCtx);

  if (context === undefined) {
    throw new Error('useEcho must be used within an EchoProvider');
  }

  return context;
}
