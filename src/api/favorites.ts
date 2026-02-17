import { API_BASE_URL } from './autentication';
import { User } from '../utils/types';

async function request<T>(
  path: string,
  options: RequestInit,
  token?: string,
): Promise<T> {
  const extraHeaders: Record<string, string> = {};
  if (token) {
    // send token in multiple common header keys to match backend expectations
    extraHeaders.Authorization = `Bearer ${token}`;
    (extraHeaders as any)['x-auth-token'] = token;
  }
  const url = `${API_BASE_URL}${path}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...extraHeaders,
    },
    ...options,
  });
  let data: unknown;
  try {
    data = await response.json();
  } catch (e) {
    // ignore JSON parse errors for empty responses
  }
  return data as T;
}

export function handleFavorite(itemId: string, token?: string) {
  return request<any>('/api/favorites', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ vehicleId: itemId }),
  });
}
