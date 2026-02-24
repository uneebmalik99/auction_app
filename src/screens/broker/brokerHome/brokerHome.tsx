import React, { useCallback, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { styles } from './styles';
import { AuctionItemRow, FloatingActionButton } from '../../../components';
import type { AuctionItem, RootNavigationProp } from '../../../utils/types';
import screenNames from '../../../routes/routes';
import {
  Bell,
  Gavel,
  AlertCircle,
  Megaphone,
  HandCoins,
} from 'lucide-react-native';
import { appColors } from '../../../utils/appColors';
import { fetchItems } from '../../../api/items';
import { useAppSelector } from '../../../redux/hooks';
import { useGreeting } from '../../../hooks/useGreeting';

export default function BrokerHome() {
  const navigation = useNavigation<RootNavigationProp>();
  const currentUser = useAppSelector(state => state.profile.user);
  const greeting = useGreeting();
  const [items, setItems] = useState<AuctionItem[] | null>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const handleViewAllAuctions = () => {
    navigation.navigate(screenNames.adminAuctionItems);
  };

  const handleGoToNotifications = () => {
    navigation.navigate(screenNames.notifications);
  };

  const stats = [
    {
      id: '1',
      label: 'Live',
      value: items?.filter(item => item?.status === 'live').length ?? 0,
      icon: Gavel,
    },

    {
      id: '2',
      label: 'Upcoming',
      value: items?.filter(item => item?.status === 'upcoming').length ?? 0,
      icon: Megaphone,
    },

    {
      id: '3',
      label: 'Pending',
      value: items?.filter(item => item?.status === 'pending').length ?? 0,
      icon: AlertCircle,
    },

    {
      id: '4',
      label: 'Sold',
      value: items?.filter(item => item?.status === 'sold').length ?? 0,
      icon: HandCoins,
    },
  ];

  const loadItems = useCallback(async (isRefresh: boolean = false) => {
    try {
      if (!isRefresh) setLoading(true);
      else setRefreshing(true);

      setError(null);

      const data = await fetchItems();
      const vehicles = (data as any)?.vehicles;
        const list: AuctionItem[] = Array.isArray(vehicles) ? vehicles : [];
        
      setItems(list);
      setLoading(false);
    } catch (e) {
      console.error('Failed to load auction items', e);
      setError(
        e instanceof Error
          ? e.message
          : 'Unable to load auction items. Please try again.',
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Load on first mount and when screen gains focus
  useFocusEffect(
    useCallback(() => {
      loadItems();
    }, [loadItems]),
  );

  // Pull-to-refresh handler
  const onRefresh = useCallback(() => {
    loadItems(true); // pass true to use refreshing state
  }, [loadItems]);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* <Header title="Admin" showBackButton={false} /> */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[appColors.primary]} // Android
            tintColor={appColors.primary} // iOS
            title="Refreshing..." // iOS only
            titleColor={appColors.textMuted}
          />
        }
      >
        {/* Header Row */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greetingLabel}>{greeting},</Text>
            <Text style={styles.greetingName}>{currentUser?.name}</Text>
          </View>
          <TouchableOpacity
            style={styles.notificationIconButton}
            activeOpacity={0.8}
            onPress={handleGoToNotifications}
          >
            <Bell size={24} color={appColors.textSecondary} />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={appColors.primary} />
        ) : (
          <View>
            {/* Stats */}
            <View style={styles.statsRow}>
              {stats.map(item => (
                <View key={item.id} style={styles.statCard}>
                  {item.icon && (
                    <item.icon
                      size={28}
                      color={appColors.primary}
                      style={{ marginBottom: 8 }}
                    />
                  )}
                  <Text style={styles.statLabel}>{item.label}</Text>
                  <Text style={styles.statValue}>{item.value}</Text>
                </View>
              ))}
            </View>

            {/* Recent Auctions */}
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>
                  Auctions {items?.length}
                </Text>
                <TouchableOpacity onPress={handleViewAllAuctions}>
                  <Text style={styles.sectionLink}>View all</Text>
                </TouchableOpacity>
              </View>

              <FlatList
                data={items}
                keyExtractor={item => item._id}
                scrollEnabled={false}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => <AuctionItemRow item={item} />}
                ListEmptyComponent={
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyTitle}>No items found</Text>
                  </View>
                }
              />
            </View>
          </View>
        )}
      </ScrollView>
      <FloatingActionButton
        size={60}
        onPress={() => navigation.navigate(screenNames.addAuctionItem)}
      />
    </SafeAreaView>
  );
}
