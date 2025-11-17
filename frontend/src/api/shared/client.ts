import axios from 'axios';
import { getToken } from '../../utils/tokenStorage';
import type Echo from 'laravel-echo';

let echoInstance: Echo | null = null;

export const setEchoInstance = (echo: Echo) => {
  echoInstance = echo;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    if (echoInstance?.socketId()) {
        config.headers['X-Socket-ID'] = echoInstance.socketId();
    }

    return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // TODO: handle unauthorized access, e.g., redirect to login
    }
    return Promise.reject(err);
  }
);

export default api;
