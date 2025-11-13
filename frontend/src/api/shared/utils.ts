import axios, { type AxiosResponse } from 'axios';
import api from './client';

// Generic GET and POST methods
export async function post<T>(path: string, body?: unknown): Promise<T> {
  try {
    const res: AxiosResponse<T> = await api.post(path, body);
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data || error.message);
    }
    throw error;
  }
}

export async function get<T>(path: string): Promise<T> {
  try {
    const res: AxiosResponse<T> = await api.get(path);
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data || error.message);
    }
    throw error;
  }
}

export async function patch<T>(path: string, body?: unknown): Promise<T> {
  try {
    const res: AxiosResponse<T> = await api.patch(path, body);
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data || error.message);
    }
    throw error;
  }
}