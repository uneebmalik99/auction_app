import { API_BASE_URL } from '../../../../api/autentication';
import { getItem } from '../../../../utils/methods';
import type { Vehicle } from './types';

export async function fetchSoldVehicles(): Promise<Vehicle[]> {
  try {
    const token = await getItem<string>('auth_token');
    const response = await fetch(`${API_BASE_URL}api/vehicles?status=sold&limit=1000`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    const data = await response.json();
    return data.vehicles || [];
  } catch (err) {
    console.error('Failed to fetch sold vehicles:', err);
    throw err;
  }
}

export async function fetchPendingVehicles(): Promise<Vehicle[]> {
  try {
    const token = await getItem<string>('auth_token');
    const response = await fetch(`${API_BASE_URL}api/vehicles?status=pending&limit=100`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    const data = await response.json();
    return data.vehicles || [];
  } catch (err) {
    console.error('Failed to fetch pending vehicles:', err);
    return [];
  }
}

export async function markVehicleAsSold(
  vehicleId: string,
  buyerInfo: {
    winnerName: string;
    winnerEmail: string;
    winnerPhone: string;
  },
): Promise<void> {
  try {
    const token = await getItem<string>('auth_token');
    const response = await fetch(`${API_BASE_URL}api/vehicles/${vehicleId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        status: 'sold',
        winnerName: buyerInfo.winnerName,
        winnerEmail: buyerInfo.winnerEmail,
        winnerPhone: buyerInfo.winnerPhone,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to mark vehicle as sold');
    }
  } catch (err) {
    console.error('Failed to mark vehicle as sold:', err);
    throw err;
  }
}
