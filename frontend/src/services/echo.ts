import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
}

window.Pusher = Pusher;

export interface EchoConfig {
  authToken: string;
}

export const createEchoInstance = ({ authToken }: EchoConfig): Echo<any> => {
  return new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    wsHost: import.meta.env.VITE_PUSHER_HOST,
    wsPort: import.meta.env.VITE_PUSHER_PORT,
    wssPort: import.meta.env.VITE_PUSHER_PORT,
    forceTLS: false,
    encrypted: true,
    disableStats: true,
    enabledTransports: ['ws', 'wss'],
    cluster: 'mt1',
    auth: {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: 'application/json',
      },
    },
    authEndpoint: `${import.meta.env.VITE_API_URL}/broadcasting/auth`,
  });
};

export const disconnectEcho = (echoInstance: Echo<any> | null): void => {
  if (echoInstance) {
    echoInstance.disconnect();
  }
};
