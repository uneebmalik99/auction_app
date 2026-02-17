import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';

// Generic helpers for AsyncStorage

// Save any serializable value under a key
export async function saveItem<T>(key: string, value: T): Promise<void> {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Error saving item to AsyncStorage', key, error);
  }
}

// Get and parse a value by key
export async function getItem<T>(key: string): Promise<T | null> {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    if (jsonValue == null) {
      return null;
    }
    return JSON.parse(jsonValue) as T;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Error getting item from AsyncStorage', key, error);
    return null;
  }
}

// Remove a value by key
export async function removeItem(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Error removing item from AsyncStorage', key, error);
  }
}

// Toast helpers
export function showSuccessToast(message: string, description?: string) {
  Toast.show({
    type: 'success',
    text1: message,
    ...(description ? { text2: description } : {}),
  });
}

export function showErrorToast(message: string, description?: string) {
  Toast.show({
    type: 'error',
    text1: message,
    ...(description ? { text2: description } : {}),
  });
}

export function showInfoToast(message: string, description?: string) {
  Toast.show({
    type: 'info',
    text1: message,
    ...(description ? { text2: description } : {}),
  });
}

export function formatRemainingTime(
  targetTimestamp: number,
  currentTime = Date.now(),
) {
  const diff = Math.max(0, targetTimestamp - currentTime);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  if (days > 0) return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

export function fromateTimeAgo(date: string) {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: enUS,
  })
    .replace('about ', '')
    .replace('less than a minute ago', 'Just now');
}

export function hasTimeRemaining(
  endDate: string | Date | null | undefined,
): boolean {
  if (!endDate) return false;

  const endTime = new Date(endDate).getTime();
  const now = Date.now();

  // True if current time < end time
  return now < endTime;
}

// export const formatRemainingTime = (targetTime: number) => {
//   const now = Date.now();
//   const diff = targetTime - now;

//   if (diff <= 0) {
//     return 'Ended';
//   }

//   const totalSeconds = Math.floor(diff / 1000);
//   const days = Math.floor(totalSeconds / (24 * 3600));
//   const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
//   const minutes = Math.floor((totalSeconds % 3600) / 60);
//   const seconds = totalSeconds % 60;

//   const parts: string[] = [];

//   if (days > 0) {
//     parts.push(`${days}d`);
//   }
//   if (hours > 0 || days > 0) {
//     parts.push(`${hours}h`);
//   }
//   if (minutes > 0 || hours > 0 || days > 0) {
//     parts.push(`${minutes}m`);
//   }
//   parts.push(`${seconds}s`);

//   return parts.join(' ');
// };
