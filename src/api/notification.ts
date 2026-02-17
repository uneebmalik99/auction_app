import { getItem } from '../utils/methods';
import { Notification } from '../utils/types';
import { API_BASE_URL } from './autentication';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  let authToken = await getItem<string>('auth_token');
  const authHeaders: Record<string, string> = authToken
    ? { Authorization: `Bearer ${authToken}` }
    : {};

  console.log('request url', url);
  console.log('authHeaders', authToken);

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...(options.headers || {}),
    },
    ...options,
  });

  console.log('response', response);

  let data: unknown;
  try {
    data = await response.json();
  } catch (e) {
    // ignore JSON parse errors for empty responses
  }

  if (!response.ok) {
    const message =
      (data as any)?.message ||
      (data as any)?.error ||
      `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data as T;
}

/**
 * Fetch all notifications for the current user
 * @param markAsRead - optionally mark all as read when fetching
 * @returns array of notifications
 */
export async function fetchNotifications(): Promise<Notification[]> {
  try {
    const notifications = await request<Notification[]>(`api/notifications`, {
      method: 'GET',
    });

    return notifications ?? [];
  } catch (error: any) {
    console.error('Failed to fetch notifications:', error.message);
    throw error; // Let caller handle it (e.g., show toast)
  }
}

/**
 * Mark a specific notification as read
 */
export async function markNotificationAsRead(
  notificationId: string,
): Promise<void> {
  try {
    await request(`/api/notifications/${notificationId}/read`, {
      method: 'PATCH',
    });
  } catch (error: any) {
    console.error(
      `Failed to mark notification ${notificationId} as read:`,
      error.message,
    );
    throw error;
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead(): Promise<void> {
  try {
    await request('/api/notifications/read-all', {
      method: 'PATCH',
    });
  } catch (error: any) {
    console.error('Failed to mark all notifications as read:', error.message);
    throw error;
  }
}
