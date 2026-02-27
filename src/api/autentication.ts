// Simple auth API helpers using fetch
// Adjust API_BASE_URL and endpoint paths to match your backend.

// export const API_BASE_URL = 'http://192.168.18.144:3000/'; // TODO: replace
export const API_BASE_URL = 'http://151.247.196.129';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getItem } from '../utils/methods';
import { User } from '../utils/types';

export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignInResponse {
  token?: string;
  user: User;
  // include other fields from your backend if needed by the backend
}

export interface SignUpPayload {
  name: string;
  email: string;
  role?: string;
  password: string;
  password_confirmation?: string;
  phone?: string;
  address: string;
}

export interface SignUpResponse {
  user: User;
  token?: string;
}

export interface LogoutResponse {
  message?: string;
}

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
}

const AUTH_TOKEN_KEY = 'auth_token';

// In-memory auth token store (set on sign-in, cleared on logout)
let authToken: string | null = null;

// Restore token from AsyncStorage on app startup
export async function initAuthToken() {
  try {
    const stored = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    if (stored) {
      authToken = stored;
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('Failed to load auth token', e);
  }
}

// Set token in memory and persist/remove it for future sessions
export async function setAuthToken(token: string | null) {
  authToken = token;
  try {
    if (token) {
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('Failed to persist auth token', e);
  }
}

async function request<T>(path: string, options: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  const authHeaders: Record<string, string> = authToken
    ? { Authorization: `Bearer ${authToken}` }
    : {};

  console.log('authHeaders', authHeaders, url);
  console.log('options.headers', options.headers);

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...(options.headers || {}),
    },
    ...options,
  });

  console.log('request response', response);

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

export function signIn(payload: SignInPayload) {
  // Backend: POST /api/auth/login
  return request<SignInResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function signUp(payload: SignUpPayload) {
  // Backend: POST /api/auth/signup
  return request<SignUpResponse>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// GET /api/auth/me – fetch currently logged-in user
// Optionally accepts a token; if omitted, uses the in-memory authToken.
export function fetchCurrentUser(token?: string) {
  console.log('fetchCurrentUser token', token);

  const extraHeaders: Record<string, string> = token
    ? { Authorization: `Bearer ${token}` }
    : {};

  return request<User>('/api/auth/profile', {
    method: 'GET',
    headers: extraHeaders,
  });
}

export function fetchUserById(userId: string) {
  return request<User>(`/api/auth/users/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
  });
}

// Update current user's profile
// export function updateProfile(payload: UpdateProfilePayload, token?: string) {
//   const extraHeaders: Record<string, string> = {};
//   if (token) {
//     // send token in multiple common header keys to match backend expectations
//     extraHeaders.Authorization = `Bearer ${token}`;
//     (extraHeaders as any)['x-auth-token'] = token;
//   }
//   console.log('updateProfile headers', extraHeaders);
//   console.log('updateProfile payload', payload);

//   return request<User>('/api/auth/profile', {
//     method: 'PUT',
//     headers: {
//       ...extraHeaders,
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(payload),
//   });
// }

export function updateProfile(
  payload: User,
  // type from react-native-image-picker asset
  token?: string,
) {
  const extraHeaders: Record<string, string> = {};
  if (token) {
    extraHeaders.Authorization = `Bearer ${token}`;
    (extraHeaders as any)['x-auth-token'] = token;
  }

  // CASE 1: User is uploading an image → use FormData (multipart/form-data)
  if (payload.profileImage) {
    const formData = new FormData();

    // Append the image
    formData.append('profileImage', {
      uri: payload.profileImage || '',
      name: 'profile.jpg',
      type: 'image/jpeg',
    } as any);

    // Append other text fields
    if (payload?.name) formData.append('name', payload?.name);
    if (payload?.phone) formData.append('phone', payload?.phone);
    if (payload?.address) formData.append('address', payload?.address);
    // add more fields as needed

    console.log('Uploading profile with image (FormData)');

    return request<User>('/api/auth/profile', {
      method: 'PUT',
      headers: {
        ...extraHeaders,
        // DO NOT set Content-Type here!
        // Let the browser/React Native set it with the correct boundary
      },
      body: formData,
    });
  }

  // CASE 2: No image → regular JSON update (your original behavior)
  console.log('Updating profile (JSON)', payload);

  return request<User>('/api/auth/profile', {
    method: 'PUT',
    headers: {
      ...extraHeaders,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

// Logout current user
export function logout(token?: string) {
  const extraHeaders: Record<string, string> = {};
  if (token) {
    // send token in multiple common header keys to match backend expectations
    extraHeaders.Authorization = `Bearer ${token}`;
    (extraHeaders as any)['x-auth-token'] = token;
    (extraHeaders as any)['x-access-token'] = token;
  }

  // eslint-disable-next-line no-console
  console.log('logout headers', extraHeaders);

  return request<LogoutResponse>('/api/auth/logout', {
    method: 'POST',
    headers: extraHeaders,
  });
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
  confirmPassword: string,
) {
  const token = await getItem<string>('auth_token');

  const extraHeaders: Record<string, string> = {};
  if (token) {
    extraHeaders.Authorization = `Bearer ${token}`;
    (extraHeaders as any)['x-auth-token'] = token;
  }
  return request<void>('api/auth/reset-password', {
    method: 'POST',
    headers: {
      ...extraHeaders,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      currentPassword: currentPassword,
      newPassword: newPassword,
      confirmPassword: confirmPassword,
    }),
  });
}

export async function deleteAccount() {
  const token = getItem<string>('auth_token');
  const extraHeaders: Record<string, string> = {};
  if (token) {
    extraHeaders.Authorization = `Bearer ${token}`;
    (extraHeaders as any)['x-auth-token'] = token;
  }
  return request<void>('api/auth/delete-account', {
    method: 'DELETE',
    headers: extraHeaders,
  });
}
