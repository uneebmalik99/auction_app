import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { styles } from './styles';
import { Header, ItemCard, Tabs } from '../../../components';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { fetchItems, fetchMyBidsItems } from '../../../api/items';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { toggleFavorite } from '../../../redux/profileSlice';
import screenNames from '../../../routes/routes';
import {
  AuctionItem,
  MyBidsTab,
  RootNavigationProp,
} from '../../../utils/types';
import { handleFavorite } from '../../../api/favorites';
import { getItem } from '../../../utils/methods';
import { myBidsTabs } from '../../../utils/data';

export default function MyBids() {
  const currentUser = useAppSelector(state => state.profile.user);
  const favoriteIds = useAppSelector(
    state => state.profile.user?.favorites ?? [],
  );
  const navigation = useNavigation<RootNavigationProp>();
  const dispatch = useAppDispatch();

  const [activeTab, setActiveTab] = useState<MyBidsTab>('active');
  const [items, setItems] = useState<AuctionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleOpenItem = (item: AuctionItem) => {
    console.log('item', item);
    navigation.navigate(screenNames.itemDetails, {
      myBids: true, // not my bids
      auctionId: item._id,
      item: item,
    });
  };

  const filteredItems = useMemo(() => {
    const list = Array.isArray(items) ? items : [];
    return list.filter(item => {
      if (activeTab === 'active') {
        return (item as any)?.vehicle?.status === 'live';
      }

      // auctioned
      return (item as any)?.vehicle?.status === 'sold';
    });
  }, [items, activeTab]);

  const loadItems = async () => {
    try {
      setLoading(true);
      setError(null);

      const apiItems: any = await fetchMyBidsItems(currentUser?.id || '');
      console.log('My Bids apiItems', apiItems);
      setItems(apiItems?.data ?? []);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to load items', e);
      setError(
        e instanceof Error
          ? e.message
          : 'Unable to load items. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      void loadItems();
    }, []),
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header titleKey="myBids.title" showBackButton={false} />

      {/* <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'active' && styles.tabButtonActive,
          ]}
          onPress={() => setActiveTab('active')}
        >
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'active' && styles.tabLabelActive,
            ]}
          >
            Active bids
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'purchased' && styles.tabButtonActive,
          ]}
          onPress={() => setActiveTab('purchased')}
        >
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'purchased' && styles.tabLabelActive,
            ]}
          >
            Purchased
          </Text>
        </TouchableOpacity>
      </View> */}

      <Tabs
        tabs={myBidsTabs}
        activeTab={activeTab}
        onTabPress={(key: string) => setActiveTab(key as MyBidsTab)}
      />

      <FlatList
        data={filteredItems}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const vehicle = (item as any)?.vehicle;
          if (!vehicle) {
            return null;
          }
          return (
            <ItemCard
              item={vehicle}
              onPress={() => handleOpenItem(vehicle)}
              onToggleFavorite={async () => {
                const token = await getItem<string>('auth_token');
                const response = await handleFavorite(
                  vehicle?.id || '',
                  token || '',
                );
                console.log('response', response);

                if (response.isFavorite) {
                  dispatch(toggleFavorite(vehicle?.id || ''));
                } else {
                  dispatch(toggleFavorite(vehicle?.id || ''));
                }
              }}
              isFavorite={favoriteIds.includes(vehicle?.id || '')}
              messageChildren={
               activeTab === 'purchased' && (
        <TouchableOpacity 
          style={styles.chatButton}
          onPress={() => {
            navigation.navigate(screenNames.chatScreen, {
              vehicleId: vehicle?._id || '',
              vehicleTitle: vehicle?.title || '',
            });
            console.log('vehicle', vehicle, screenNames.chatScreen);
          }}
        >
          <Text style={styles.chatButtonText}>Message Admin</Text>
        </TouchableOpacity>
      )}
              
            />
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>
              {activeTab === 'active'
                ? 'No active bids yet'
                : 'No purchases yet'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === 'active'
                ? 'Start bidding on auctions to see them here.'
                : 'Once you win and complete payment, your purchases will show up here.'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
