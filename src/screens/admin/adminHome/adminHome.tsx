import React, { useCallback, useState } from 'react';
import {
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
import LiveAuctionCard from '../../../components/liveAuctionCard/liveAuctionCard';
import RecentlySoldVehicles from '../../../components/recentlySoldVehicles/recentlySoldVehicles';
import UpcomingAuctionCard from '../../../components/upcomingAuctionCard/upcomingAuctionCard';
import PendingAuctionCard from '../../../components/pendingAuctionCard/pendingAuctionCard';
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

export default function AdminHome() {
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

            {/* Live Auctions */}
            <View style={styles.sectionNoBackground}>
              <View style={styles.sectionHeaderRowNoPadding}>
                <View>
                  <Text style={styles.sectionTitle}>Live Auctions</Text>
                  <Text style={styles.sectionSubtitle}>
                    Real-time monitoring •{' '}
                    {items?.filter(item => item.status === 'live').length || 0}{' '}
                    active auction
                    {items?.filter(item => item.status === 'live').length !== 1
                      ? 's'
                      : ''}{' '}
                    • Updated {new Date().toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </Text>
                </View>
              </View>

              {items && items.filter(item => item.status === 'live').length > 0 ? (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.horizontalScrollContent}
                >
                  {items.filter(item => item.status === 'live').map(item => (
                    <LiveAuctionCard
                      key={item._id}
                      item={item}
                      onPress={() => {
                        navigation.navigate(screenNames.itemDetails, {
                          auctionId: item._id,
                          item,
                        });
                      }}
                    />
                  ))}
                </ScrollView>
              ) : (
                <View style={styles.emptyCard}>
                  <Text style={styles.emptyTitle}>No Live Auctions</Text>
                  <Text style={styles.emptySubtitle}>
                    There are currently no live auctions
                  </Text>
                </View>
              )}
            </View>

            {/* Upcoming Auctions */}
            <View style={styles.sectionNoBackground}>
              <View style={styles.sectionHeaderRowNoPadding}>
                <View>
                  <Text style={styles.sectionTitle}>Upcoming Auctions</Text>
                  <Text style={styles.sectionSubtitle}>
                    Scheduled auctions •{' '}
                    {items?.filter(item => item.status === 'upcoming').length || 0}{' '}
                    upcoming auction
                    {items?.filter(item => item.status === 'upcoming').length !== 1
                      ? 's'
                      : ''}
                  </Text>
                </View>
              </View>

              {items && items.filter(item => item.status === 'upcoming').length > 0 ? (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.horizontalScrollContent}
                >
                  {items.filter(item => item.status === 'upcoming').map(item => (
                    <UpcomingAuctionCard
                      key={item._id}
                      item={item}
                      onPress={() => {
                        navigation.navigate(screenNames.itemDetails, {
                          auctionId: item._id,
                          item,
                        });
                      }}
                    />
                  ))}
                </ScrollView>
              ) : (
                <View style={styles.emptyCard}>
                  <Text style={styles.emptyTitle}>No Upcoming Auctions</Text>
                  <Text style={styles.emptySubtitle}>
                    There are currently no upcoming auctions
                  </Text>
                </View>
              )}
            </View>

            {/* Pending Auctions */}
            <View style={styles.sectionNoBackground}>
              <View style={styles.sectionHeaderRowNoPadding}>
                <View>
                  <Text style={styles.sectionTitle}>Pending Auctions</Text>
                  <Text style={styles.sectionSubtitle}>
                    Awaiting approval •{' '}
                    {items?.filter(item => item.status === 'pending').length || 0}{' '}
                    pending auction
                    {items?.filter(item => item.status === 'pending').length !== 1
                      ? 's'
                      : ''}
                  </Text>
                </View>
              </View>

              {items && items.filter(item => item.status === 'pending').length > 0 ? (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.horizontalScrollContent}
                >
                  {items.filter(item => item.status === 'pending').map(item => (
                    <PendingAuctionCard
                      key={item._id}
                      item={item}
                      onPress={() => {
                        navigation.navigate(screenNames.itemDetails, {
                          auctionId: item._id,
                          item,
                        });
                      }}
                    />
                  ))}
                </ScrollView>
              ) : (
                <View style={styles.emptyCard}>
                  <Text style={styles.emptyTitle}>No Pending Auctions</Text>
                  <Text style={styles.emptySubtitle}>
                    There are currently no pending auctions
                  </Text>
                </View>
              )}
            </View>

            {/* Recently Sold Vehicles */}
            {items && items.filter(item => item.status === 'sold').length > 0 ? (
              <RecentlySoldVehicles
                items={items}
                onItemPress={item => {
                  navigation.navigate(screenNames.itemDetails, {
                    auctionId: item._id,
                    item,
                  });
                }}
                onViewWinner={item => {
                  // Navigate to winner details or show modal
                  navigation.navigate(screenNames.itemDetails, {
                    auctionId: item._id,
                    item,
                  });
                }}
              />
            ) : (
              <View style={styles.section}>
                <View style={styles.sectionHeaderRow}>
                  <View>
                    <Text style={styles.sectionTitle}>Recently Sold Vehicles</Text>
                    <Text style={styles.sectionSubtitle}>
                      Latest completed sales • 0 vehicles
                    </Text>
                  </View>
                </View>
                <View style={styles.emptyCard}>
                  <Text style={styles.emptyTitle}>No Sold Vehicles</Text>
                  <Text style={styles.emptySubtitle}>
                    There are currently no sold vehicles
                  </Text>
                </View>
              </View>
            )}
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
