import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Header } from '../../components';
import { appColors } from '../../utils/appColors';
import type { User } from '../../utils/types';
import { Mail, Phone, MapPin, Heart } from 'lucide-react-native';
import { styles } from './styles';
import { fetchUserById } from '../../api/autentication';

interface RouteParams {
  user?: User;
  userId?: string;
}

export default function UserDetails() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const params: RouteParams = route.params || {};

  const [user, setUser] = useState<User | null>(params.user || null);
  const [loading, setLoading] = useState(!params.user && !!params.userId);
  const [error, setError] = useState<string | null>(null);
  const ROLE_LABELS: any = {
    0: 'Super Admin',
    1: 'Admin',
    2: 'Customer',
    3: 'Other',
    4: 'Broker',
  };
  // Fetch user if only userId is provided
  useEffect(() => {
    if (params.user) {
      // User already passed → nothing to do
      return;
    }

    if (!params.userId) {
      setError('No user information provided');
      return;
    }

    const loadUser = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedUser = await fetchUserById(
          (params.userId as string) ?? '',
        );

        console.log('fetchedUser', fetchedUser);

        setUser(fetchedUser?.data as User);
      } catch (err) {
        console.error('Failed to fetch user:', err);
        setError('Unable to load user profile');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [params.userId, params.user]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header titleKey="userProfile.title" />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={appColors.primary} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header titleKey="userProfile.title" />
        <View style={styles.center}>
          <Text style={styles.errorText}>{error || 'User not found'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const displayName = user.name || 'Unknown User';
  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const hasImage = !!user.profileImage;
  const favoriteCount = user.favorites?.length || 0;

  const handleEmailPress = () =>
    user.email && Linking.openURL(`mailto:${user.email}`);
  const handlePhonePress = () =>
    user.phone && Linking.openURL(`tel:${user.phone}`);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header titleKey="userProfile.title" />

      <ScrollView contentContainerStyle={styles.container}>
        {/* Avatar + Name */}
        <View style={styles.headerSection}>
          <View style={styles.avatarWrapper}>
            {hasImage ? (
              <Image
                source={{ uri: user.profileImage }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.initials}>{initials}</Text>
              </View>
            )}
          </View>

          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.roleBadge}>{ROLE_LABELS[user?.role] ?? ''}</Text>
          {/* {user.role && (
            // <Text style={styles.roleBadge}>{'user.role.toUpperCase()'}</Text>
            <></>
          )} */}
        </View>

        {/* Details Card */}
        <View style={styles.detailsCard}>
          {user.email && (
            <TouchableOpacity
              style={styles.detailRow}
              onPress={handleEmailPress}
            >
              <Mail size={20} color={appColors.textSecondary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Email</Text>
                <Text style={styles.detailValue}>{user.email}</Text>
              </View>
            </TouchableOpacity>
          )}

          {user.phone && (
            <TouchableOpacity
              style={styles.detailRow}
              onPress={handlePhonePress}
            >
              <Phone size={20} color={appColors.textSecondary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Phone</Text>
                <Text style={styles.detailValue}>{user.phone}</Text>
              </View>
            </TouchableOpacity>
          )}

          {user.address && (
            <View style={styles.detailRow}>
              <MapPin size={20} color={appColors.textSecondary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Address</Text>
                <Text style={styles.detailValue}>{user.address}</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
