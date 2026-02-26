import { API_BASE_URL } from './autentication';
import { getItem } from '../utils/methods';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 0 | 1 | 2 | 3 | 4;
  status: 'pending' | 'approved' | 'rejected';
  phone?: string | null;
  address?: string | null;
  profileImage?: string | null;
  permissions?: {
    canView: boolean;
    canCreate: boolean;
    canUpdate: boolean;
    canDelete: boolean;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface BrokerStats {
  liveAuctions: number;
  upcomingAuctions: number;
  soldAuctions: number;
  pendingAuctions: number;
  totalRevenue: number;
  totalVehicles: number;
}

export interface UsersResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  stats: {
    pending: number;
    approved: number;
    rejected: number;
    admin: number;
    staff: number;
    customer: number;
    broker: number;
  };
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

export async function fetchUsers(
  page: number = 1,
  limit: number = 10,
  role?: 'all' | 1 | 2 | 3 | 4,
  status?: 'all' | 'pending' | 'approved' | 'rejected',
): Promise<UsersResponse> {
  const roleParam = role === 'all' || !role ? '' : `&role=${role}` ;
  const statusParam = status === 'all' || !status ? '' : `&status=${status}` ;
  return request<UsersResponse>(
    `api/admin/users?page=${page}&limit=${limit}${roleParam}${statusParam}`,
    {
      method: 'GET',
    },
  );
}

export async function updateUserStatus(
  userId: string,
  status: 'approved' | 'rejected',
): Promise<{ success: boolean; message?: string }> {
  return request<{ success: boolean; message?: string }>('api/admin/users', {
    method: 'PATCH',
    body: JSON.stringify({ userId, status }),
  });
}

export async function createUser(payload: {
  name: string;
  email: string;
  password: string;
  role: 1 | 2 | 3 | 4;
  phone?: string;
  address?: string;
}): Promise<{ success: boolean; user?: User; message?: string }> {
  return request<{ success: boolean; user?: User; message?: string }>(
    'api/admin/users',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
  );
}

export async function fetchBrokerStats(
  brokerId: string,
): Promise<BrokerStats> {
  // Fetch all vehicles and filter by sellerId
  const token = await getItem<string>('auth_token');
  const response = await fetch(`${API_BASE_URL}api/vehicles?limit=1000`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch broker statistics');
  }

  const allVehicles = data.vehicles || [];
  const vehicles = allVehicles.filter((v: any) => v.sellerId === brokerId);

  const liveAuctions = vehicles.filter((v: any) => v.status === 'live').length;
  const upcomingAuctions = vehicles.filter(
    (v: any) => v.status === 'upcoming',
  ).length;
  const soldAuctions = vehicles.filter((v: any) => v.status === 'sold').length;
  const pendingAuctions = vehicles.filter(
    (v: any) => v.status === 'pending',
  ).length;

  const totalRevenue = vehicles
    .filter((v: any) => v.status === 'sold')
    .reduce((sum: number, v: any) => sum + (v.currentBid || 0), 0);

  return {
    liveAuctions,
    upcomingAuctions,
    soldAuctions,
    pendingAuctions,
    totalRevenue,
    totalVehicles: vehicles.length,
  };
}

export async function fetchUserPermissions(
  userId: string,
): Promise<User | null> {
  const response = await request<{ users: User[] }>('api/admin/permissions', {
    method: 'GET',
  });

  const userPerm = response.users.find((u: any) => u.id === userId);
  return userPerm || null;
}

export async function updateUserPermissions(
  userId: string,
  permissions: {
    canView: boolean;
    canCreate: boolean;
    canUpdate: boolean;
    canDelete: boolean;
  },
): Promise<{ success: boolean; message?: string }> {
  return request<{ success: boolean; message?: string }>(
    'api/admin/permissions',
    {
      method: 'PATCH',
      body: JSON.stringify({
        userId,
        permissions,
      }),
    },
  );
}
