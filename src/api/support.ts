import { getItem } from '../utils/methods';
import { API_BASE_URL } from './autentication';
import type { PickedImage } from '../hooks/useImagePicker';

export interface FaqItem {
  _id?: string;
  id?: string | number;
  question?: string;
  answer?: string;
  title?: string;
  description?: string;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  const token = await getItem<string>('auth_token');
  const authHeaders: Record<string, string> = token
    ? { Authorization: `Bearer ${token}` }
    : {};

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...(options.headers || {}),
    },
    ...options,
  });

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

function normalizeFaqsPayload(payload: any): FaqItem[] {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload as FaqItem[];

  // Common shapes: { faqs: [] } or { data: [] } or { results: [] }
  const possible =
    payload?.faqs ?? payload?.data ?? payload?.results ?? payload?.items;
  if (Array.isArray(possible)) return possible as FaqItem[];

  return [];
}

export async function fetchFaqs(): Promise<FaqItem[]> {
  // As requested: api/support/faqs
  const data = await request<any>('/api/support/faqs', { method: 'GET' });
  return normalizeFaqsPayload(data);
}

export interface CreateSupportTicketPayload {
  subject: string;
  category: string;
  priority: string;
  description: string;
}

export async function createSupportTicket(
  payload: CreateSupportTicketPayload,
  attachments: PickedImage[] = [],
): Promise<any> {
  const url = `${API_BASE_URL}/api/support/tickets`.replace(/\/+\/api/, '/api');

  const token = await getItem<string>('auth_token');
  const authHeaders: Record<string, string> = token
    ? { Authorization: `Bearer ${token}` }
    : {};

  const formData = new FormData();
  formData.append('subject', payload.subject);
  // Backend keys (as provided): cattegory, piroirty, attachementts
  formData.append('cattegory', payload.category);
  formData.append('category', payload.category);
  formData.append('piroirty', payload.priority);
  formData.append('priority', payload.priority);
  formData.append('description', payload.description);

  // Optional attachments
  attachments.forEach((file, index) => {
    if (!file?.uri) return;
    const name =
      file.fileName ||
      `attachment-${index}.${(file.type && file.type.split('/')[1]) || 'jpg'}`;
    const type = file.type || 'image/jpeg';
    formData.append('attachementts', {
      uri: file.uri,
      name,
      type,
    } as any);
  });

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      ...authHeaders,
      // IMPORTANT: do NOT set Content-Type; fetch will set boundary.
    },
    body: formData,
  });

  let data: unknown;
  try {
    data = await response.json();
  } catch (e) {
    // ignore
  }

  if (!response.ok) {
    const message =
      (data as any)?.message ||
      (data as any)?.error ||
      `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data as any;
}
