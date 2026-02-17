// src/hooks/useCurrentLocation.ts

import { useState, useEffect } from 'react';
import { Alert, PermissionsAndroid, Platform, Permission } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

export interface Location {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number | null;
  speed?: number | null;
  timestamp: number;
}

export interface LocationResult {
  location: Location | null;
  loading: boolean;
  error: string | null;
  requestLocation: () => void; // Manually trigger if needed
}

const LOCATION_PERMISSION: Permission =
  Platform.OS === 'android'
    ? PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    : PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION;

export function useCurrentLocation(
  autoFetch: boolean = true, // Fetch automatically on mount?
): LocationResult {
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<string | null>(null);

  const requestPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'ios') {
      // iOS handles permission via Info.plist
      return true;
    }

    try {
      const granted = await PermissionsAndroid.request(LOCATION_PERMISSION, {
        title: 'Location Permission',
        message: 'This app needs access to your location to work properly.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      });

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else {
        setError('Location permission denied');
        Alert.alert('Permission Denied', 'Location access is required.');
        return false;
      }
    } catch (err) {
      console.warn('Permission error:', err);
      setError('Failed to request location permission');
      return false;
    }
  };

  const fetchLocation = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    Geolocation.getCurrentPosition(
      position => {
        const { coords, timestamp } = position;
        setLocation({
          latitude: coords.latitude,
          longitude: coords.longitude,
          accuracy: coords.accuracy ?? undefined,
          altitude: coords.altitude ?? null,
          speed: coords.speed ?? null,
          timestamp,
        });
        setLoading(false);
      },
      err => {
        let message = 'Failed to get location';
        switch (err.code) {
          case 1:
            message = 'Location permission denied';
            break;
          case 2:
            message = 'Location unavailable';
            break;
          case 3:
            message = 'Location request timed out';
            break;
        }
        setError(message);
        Alert.alert('Location Error', message);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  };

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      fetchLocation();
    }
  }, [autoFetch]);

  return {
    location,
    loading,
    error,
    requestLocation: fetchLocation, // Allow manual trigger
  };
}
