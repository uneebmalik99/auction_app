import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { styles } from './styles';
import { Header, ItemCard } from '../../../components';
import type { AuctionItem, RootNavigationProp } from '../../../utils/types';
import screenNames from '../../../routes/routes';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { toggleFavorite } from '../../../redux/profileSlice';
import { fetchItems } from '../../../api/items';
import { Bell } from 'lucide-react-native';
import { appColors } from '../../../utils/appColors';
import { handleFavorite } from '../../../api/favorites';
import { getItem } from '../../../utils/methods';
import { useNotifications } from '../../../hooks/useNotification';
import { useGreeting } from '../../../hooks/useGreeting';

export default function ClientHome() {
  const navigation = useNavigation<RootNavigationProp>();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.profile.user);
  const favoriteIds = useAppSelector(
    state => state.profile.user?.favorites ?? [],
  );

  const { notifications, unreadCount } = useNotifications(
    currentUser?.id?.toString() || '',
  );

  const greeting = useGreeting();

  // console.log('notifications', notifications);
  console.log('unreadCount', unreadCount);

  const [items, setItems] = useState<AuctionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const handleGoToNotifications = () => {
    navigation.navigate(screenNames.notifications);
  };

  const handleOpenItem = (item: AuctionItem) => {
    navigation.navigate(screenNames.itemDetails, {
      myBids: false, // not my bids
      auctionId: item._id,
      item,
    });
  };

  const filteredItems = useMemo(() => {
    const list = Array.isArray(items) ? items : [];
    return list.filter(item => item.status === 'live');
  }, [items]);

  console.log('filteredItems', filteredItems);
  console.log('items', items);
  console.log('favoriteIds', favoriteIds);

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

  const onRefresh = useCallback(() => {
    loadItems(true); // pass true to use refreshing state
  }, [loadItems]);

  // const loadItems = async () => {
  //   try {
  //     setLoading(true);
  //     setError(null);

  //     const apiItems: AuctionItem[] = await fetchItems();
  //     console.log('apiItems', apiItems);
  //     const vehicles = (apiItems as any)?.vehicles;
  //     const list: AuctionItem[] = Array.isArray(vehicles)
  //       ? (vehicles as AuctionItem[])
  //       : [];
  //     setItems(list);
  //     // setItems(apiItems?.vehicles ?? []);
  //   } catch (e) {
  //     // eslint-disable-next-line no-console
  //     console.error('Failed to load items', e);
  //     setError(
  //       e instanceof Error
  //         ? e.message
  //         : 'Unable to load items. Please try again.',
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const onRefresh = async () => {
  //   setRefreshing(true);
  //   try {
  //     void loadItems();
  //   } catch (e) {
  //     console.error('Refresh failed', e);
  //     Alert.alert('Error', 'Failed to refresh items');
  //   } finally {
  //     setRefreshing(false);
  //   }
  // };

  // useEffect(() => {
  //   loadItems();
  // }, [unreadCount]);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* <Header title="Client home" showBackButton={false} /> */}

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
        {/* Top row with greeting and profile shortcut */}
        <View style={styles.topRow}>
          <View>
            <Text style={styles.greetingLabel}>{greeting},</Text>
            <Text style={styles.greetingName}>{currentUser?.name}</Text>
          </View>
          <TouchableOpacity
            style={styles.notificationIconButton}
            activeOpacity={0.8}
            onPress={handleGoToNotifications}
          >
            <Bell
              size={20}
              color={
                unreadCount > 0 ? appColors.primary : appColors.textSecondary
              }
            />
          </TouchableOpacity>
        </View>

        {/* Auction items list */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Auction items</Text>
        </View>

        {loading ? (
          <View>
            <ActivityIndicator size="large" color={appColors.primary} />
          </View>
        ) : (
          <FlatList
            data={filteredItems}
            keyExtractor={item => item._id}
            scrollEnabled={false}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => {
              return (
                <ItemCard
                  item={item}
                  onPress={() => handleOpenItem(item)}
                  onToggleFavorite={async () => {
                    const token = await getItem<string>('auth_token');
                    const response = await handleFavorite(
                      item._id,
                      token || '',
                    );
                    console.log('response', response);

                    if (response.isFavorite) {
                      dispatch(toggleFavorite(item._id));
                    } else {
                      dispatch(toggleFavorite(item._id));
                    }
                  }}
                  isFavorite={favoriteIds.includes(item._id)}
                />
              );
            }}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>No items found</Text>
              </View>
            }
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
