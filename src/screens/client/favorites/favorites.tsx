import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, SafeAreaView, Text, View } from 'react-native';
import { styles } from './sytles';
import { Header, ItemCard } from '../../../components';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { toggleFavorite } from '../../../redux/profileSlice';
import { fetchItems } from '../../../api/items';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import screenNames from '../../../routes/routes';
import { AuctionItem, RootNavigationProp } from '../../../utils/types';
import { handleFavorite } from '../../../api/favorites';
import { getItem } from '../../../utils/methods';

export default function Favorites() {
  const dispatch = useAppDispatch();
  const favoriteIds = useAppSelector(
    state => state.profile.user?.favorites ?? [],
  );
  const navigation = useNavigation<RootNavigationProp>();

  const [items, setItems] = useState<AuctionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('items', items);
  console.log('favoriteIds', favoriteIds);

  const favoriteItems = (items as any)?.vehicles?.filter((item: any) =>
    favoriteIds?.includes(item._id),
  );

  console.log('favoriteItems', favoriteItems);
  console.log('favoriteIds', favoriteIds);

  const handleOpenItem = (item: AuctionItem) => {
    navigation.navigate(screenNames.itemDetails, {
      auctionId: item._id,
      item,
    });
  };

  const loadItems = async () => {
    try {
      setLoading(true);
      setError(null);

      const apiItems: AuctionItem[] = await fetchItems();
      console.log('Favorites apiItems', apiItems);
      setItems(apiItems ?? []);
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
      <Header titleKey="favorites.title" showBackButton={false} />

      {loading ? (
        <Text style={styles.statusText}>Loading items...</Text>
      ) : error ? (
        <Text style={styles.statusText}>{error}</Text>
      ) : (
        <FlatList
          data={favoriteItems}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const startTime = item.biddingStartsAt
              ? Date.parse(item.biddingStartsAt)
              : undefined;
            const endTime = item.biddingEndsAt
              ? Date.parse(item.biddingEndsAt)
              : undefined;

            return (
              <ItemCard
                item={item}
                onPress={() => handleOpenItem(item)}
                onToggleFavorite={async () => {
                  const token = await getItem<string>('auth_token');
                  const response = await handleFavorite(item._id, token || '');
                  console.log('response', response);

                  if (response.isFavorite) {
                    dispatch(toggleFavorite(item._id));
                  } else {
                    dispatch(toggleFavorite(item._id));
                    // Alert.alert('Error', 'Failed to add favorite');
                  }
                }}
                isFavorite={favoriteIds.includes(item._id)}
              />
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No favorites yet</Text>
              <Text style={styles.emptySubtitle}>
                Save auctions you love to quickly find them later.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
