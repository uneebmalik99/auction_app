import { API_BASE_URL } from './autentication';
import { getItem } from '../utils/methods';
import { AuctionItem } from '../utils/types';

// Generic fetch helper – mirrors the one in `autentication.ts`
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  console.log('request url', url);

  const response = await fetch(url, {
    headers: {
      // 'Content-Type': 'application/json',
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

// Payload for creating a new auction (omit fields set by backend)
// We keep `status` so the admin can choose upcoming/live/sold when creating.
export type CreateAuctionItemPayload = Omit<
  AuctionItem,
  '_id' | 'currentBid' | 'createdAt' | 'updatedAt'
>;

export interface ListItemsParams {
  page?: number;
  perPage?: number;
  search?: string;
  status?: string; // e.g. filter by status
}

// GET /api/items?search=&status=&page=&perPage=
// Update the path and query names to match your backend.
export async function fetchItems(
  params: ListItemsParams = {},
): Promise<AuctionItem[]> {
  const query = new URLSearchParams();

  if (params.search) query.append('search', params.search);
  if (params.status) query.append('status', params.status);
  if (params.page != null) query.append('page', String(params.page));
  if (params.perPage != null) query.append('perPage', String(params.perPage));

  const qs = query.toString();
  const path = qs ? `/api/auctions?${qs}` : '/api/auctions';

  return request<AuctionItem[]>('api/vehicles', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
  });
}

export async function fetchMyBidsItems(
  bidderId: string | number,
): Promise<AuctionItem[]> {
  return request<AuctionItem[]>(`api/bids?bidderId=${bidderId}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
  });
}

// GET /api/items/:id – fetch a single item by ID
export async function fetchItemById(id: number | string): Promise<AuctionItem> {
  return request<AuctionItem>(`/api/vehicles/${id}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
  });
}

// Lightweight image type compatible with react-native-image-picker assets
export interface UploadImage {
  uri: string;
  fileName?: string | null;
  type?: string | null;
}

// POST /api/vehicles – create a new auction item with images
export async function createAuctionItem(
  payload: CreateAuctionItemPayload,
  images: UploadImage[] = [],
): Promise<AuctionItem> {
  const token = await getItem<string>('auth_token');

  const formData = new FormData();

  // Scalars
  formData.append('title', payload.title);
  formData.append('make', payload.make);
  formData.append('model', payload.model);
  formData.append('year', String(payload.year));
  formData.append('vin', payload.vin);
  formData.append('mileage', String(payload.mileage));
  formData.append('horsePower', String(payload.horsePower ?? 0));
  formData.append('engineCapacity', payload.engineCapacity);
  formData.append('fuelType', payload.fuelType);
  formData.append('driveType', payload.driveType);
  formData.append('transmission', payload.transmission);
  formData.append('color', payload.color);
  formData.append('location', payload.location);
  formData.append('startingPrice', String(payload.startingPrice));
  formData.append('minimumBidIncrement', String(payload.minimumBidIncrement));
  if (payload.biddingStartsAt) {
    formData.append('biddingStartsAt', payload.biddingStartsAt);
  }
  if (payload.biddingEndsAt) {
    formData.append('biddingEndsAt', payload.biddingEndsAt);
  }
  if (payload.description) {
    formData.append('description', payload.description);
  }
  formData.append('status', payload.status);

  // Features as JSON string (adjust if your backend expects different)
  formData.append('features', JSON.stringify(payload.features ?? {}));
  formData.append('sellerNationality', payload.sellerNationality ?? '');
  formData.append('registrationCity', payload.registrationCity ?? '');
  // Append each selected image as multipart file under "photos"
  images.forEach((img, index) => {
    if (!img.uri) {
      return;
    }
    const name =
      img.fileName ||
      `photo-${index}.${(img.type && img.type.split('/')[1]) || 'jpg'}`;
    const type = img.type || 'image/jpeg';
    formData.append('photos', {
      uri: img.uri,
      name,
      type,
    } as any);
  });

  const headers: Record<string, string> = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
    (headers as any)['x-auth-token'] = token;
  }
  // IMPORTANT: do NOT set Content-Type header; fetch will set proper multipart boundary.

  const res = await fetch(`${API_BASE_URL}api/vehicles`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'multipart/form-data',
    },
    body: formData,
  });

  console.log('res', res);

  const data = await res.json();
  if (!res.ok) {
    throw new Error((data as any)?.message || 'Failed to create auction item.');
  }
  return data as AuctionItem;
}

// PUT /api/vehicles/:id – update an existing auction item (with optional images)
export async function updateAuctionItem(
  id: string,
  payload: Partial<CreateAuctionItemPayload>,
  images: UploadImage[] = [],
): Promise<AuctionItem> {
  const token = await getItem<string>('auth_token');

  const formData = new FormData();

  // Only append fields that are present in payload
  if (payload.title != null) formData.append('title', payload.title);
  if (payload.make != null) formData.append('make', payload.make);
  if (payload.model != null) formData.append('model', payload.model);
  if (payload.year != null) formData.append('year', String(payload.year));
  if (payload.vin != null) formData.append('vin', payload.vin);
  if (payload.mileage != null) {
    formData.append('mileage', String(payload.mileage));
  }
  if (payload.horsePower != null) {
    formData.append('horsePower', String(payload.horsePower));
  }
  if (payload.engineCapacity != null) {
    formData.append('engineCapacity', payload.engineCapacity);
  }
  if (payload.fuelType != null) formData.append('fuelType', payload.fuelType);
  if (payload.driveType != null)
    formData.append('driveType', payload.driveType);
  if (payload.transmission != null) {
    formData.append('transmission', payload.transmission);
  }
  if (payload.color != null) formData.append('color', payload.color);
  if (payload.location != null) formData.append('location', payload.location);
  if (payload.startingPrice != null) {
    formData.append('startingPrice', String(payload.startingPrice));
  }
  if (payload.minimumBidIncrement != null) {
    formData.append('minimumBidIncrement', String(payload.minimumBidIncrement));
  }
  if (payload.biddingStartsAt != null) {
    formData.append('biddingStartsAt', payload.biddingStartsAt);
  }
  if (payload.biddingEndsAt != null) {
    formData.append('biddingEndsAt', payload.biddingEndsAt);
  }
  if (payload.description != null) {
    formData.append('description', payload.description);
  }
  if (payload.status != null) {
    formData.append('status', payload.status);
  }

  if (payload.features != null) {
    formData.append('features', JSON.stringify(payload.features));
  }

  // Optional new images
  images.forEach((img, index) => {
    if (!img.uri) return;
    const name =
      img?.fileName ||
      `photo-${index}.${(img.type && img.type.split('/')[1]) || 'jpg'}`;
    const type = img.type || 'image/jpeg';
    formData.append('photos', {
      uri: img?.uri || '',
      name,
      type,
    } as any);
  });

  const headers: Record<string, string> = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
    (headers as any)['x-auth-token'] = token;
  }

  console.log('formData', formData);

  return request<AuctionItem>(`api/vehicles/${id}`, {
    method: 'PUT',
    headers,
    body: formData as any,
  });
}

// DELETE /api/vehicles/:id – delete an existing auction item
export async function deleteAuctionItem(id: string): Promise<AuctionItem> {
  console.log('deleteAuctionItem', id);
  const token = await getItem<string>('auth_token');

  const extraHeaders: Record<string, string> = {};
  if (token) {
    extraHeaders.Authorization = `Bearer ${token}`;
    (extraHeaders as any)['x-auth-token'] = token;
  }

  return request<AuctionItem>(`/api/vehicles/${id}`, {
    method: 'DELETE',
    headers: {
      ...extraHeaders,
      'Content-Type': 'application/json',
    },
  });
}

export async function changeAuctionItemStatus(
  itemId: string,
  status: string,
): Promise<AuctionItem> {
  const token = await getItem<string>('auth_token');

  return request<AuctionItem>(`api/vehicles/${itemId}/status`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: status }),
  });
}
