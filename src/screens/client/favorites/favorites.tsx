import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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
import { appColors } from '../../../utils/appColors';
import { Heart, PlayCircle, Clock, X, Search } from 'lucide-react-native';
import { height, width } from '../../../utils/dimensions';
import { useI18n } from '../../../i18n';

export default function Favorites() {
  const { t } = useI18n();
  const dispatch = useAppDispatch();
  const favoriteIds = useAppSelector(
    state => state.profile.user?.favorites ?? [],
  );
  const navigation = useNavigation<RootNavigationProp>();

  const [items, setItems] = useState<AuctionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const favoriteItems = useMemo(() => {
    const allItems = (items as any)?.vehicles || items || [];
    return allItems.filter((item: any) =>
      favoriteIds?.includes(item._id),
    ) as AuctionItem[];
  }, [items, favoriteIds]);

  // Calculate stats
  const stats = useMemo(() => {
    const live = favoriteItems.filter(
      (item) => item.status === 'live',
    ).length;
    const upcoming = favoriteItems.filter(
      (item) => item.status === 'upcoming',
    ).length;
    return {
      total: favoriteItems.length,
      live,
      upcoming,
    };
  }, [favoriteItems]);

  const handleOpenItem = (item: AuctionItem) => {
    navigation.navigate(screenNames.itemDetails, {
      auctionId: item._id,
      item,
    });
  };

  const handleRemoveFavorite = async (item: AuctionItem) => {
    try {
      const token = await getItem<string>('auth_token');
      const response = await handleFavorite(item._id, token || '');
      dispatch(toggleFavorite(item._id));
    } catch (err) {
      console.error('Failed to remove favorite:', err);
      setError(t('favorites.failedToRemove'));
    }
  };

  const loadItems = async () => {
    try {
      setError(null);
      const apiItems: any = await fetchItems();
      console.log('apiItems', apiItems);
      const vehicles = apiItems?.vehicles || apiItems || [];
      setItems(Array.isArray(vehicles) ? vehicles : []);
    } catch (e) {
      console.error('Failed to load items favorites', e);
      setError(
        e instanceof Error
          ? e.message
          : t('favorites.unableToLoad'),
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      void loadItems();
    }, []),
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    void loadItems();
  }, []);

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header titleKey="favorites.title" showBackButton={false} />
        <View style={styles.loadingContainer}>
          <View style={styles.loadingSpinnerContainer}>
            <ActivityIndicator size="large" color={appColors.favorite} />
          </View>
          <Text style={styles.loadingText}>{t('favorites.loading')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header titleKey="favorites.title" showBackButton={false} />

      {/* Error Banner */}
      {error && (
        <View style={styles.errorBanner}>
          <View style={styles.errorBannerContent}>
            <View style={styles.errorBannerLeft}>
              <View style={styles.errorIconContainer}>
                <Text style={styles.errorIcon}>⚠</Text>
              </View>
              <Text style={styles.errorText}>{error}</Text>
            </View>
            <TouchableOpacity
              onPress={() => setError(null)}
              style={styles.errorCloseButton}
            >
              <X size={20} color={appColors.red} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[appColors.favorite]}
            tintColor={appColors.favorite}
          />
        }
      >
        {/* Page Header */}
        <View style={styles.headerContainer}>
          <View style={styles.headerContent}>
            <View style={styles.headerBadge}>
              <Heart size={16} color={appColors.favorite} fill={appColors.favorite} />
              <Text style={styles.headerBadgeText}>{t('favorites.yourCollection')}</Text>
            </View>
            <Text style={styles.headerTitle}>{t('favorites.favoriteVehicles')}</Text>
            <Text style={styles.headerSubtitle}>
              {t('favorites.subtitle')}
            </Text>
          </View>

          {/* Stats Bar */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <View style={[styles.statIconContainer, styles.statIconRed]}>
                <Heart size={18} color={appColors.favorite} fill={appColors.favorite} />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statValue}>{stats.total}</Text>
                <Text style={styles.statLabel}>{t('favorites.savedVehicles')}</Text>
              </View>
            </View>
            <View style={styles.statCard}>
              <View style={[styles.statIconContainer, styles.statIconGreen]}>
                <PlayCircle size={18} color={appColors.green} />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statValue}>{stats.live}</Text>
                <Text style={styles.statLabel}>{t('favorites.liveNow')}</Text>
              </View>
            </View>
            <View style={styles.statCard}>
              <View style={[styles.statIconContainer, styles.statIconAmber]}>
                <Clock size={18} color="#f59e0b" />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statValue}>{stats.upcoming}</Text>
                <Text style={styles.statLabel}>{t('favorites.upcoming')}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Favorites List */}
        {favoriteItems.length > 0 ? (
          <View style={styles.listContainer}>
            <FlatList
              data={favoriteItems}
              keyExtractor={(item) => item._id}
              contentContainerStyle={styles.contentContainer}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
              renderItem={({ item }) => {
                return (
                  <ItemCard
                    item={item}
                    onPress={() => handleOpenItem(item)}
                    onToggleFavorite={() => handleRemoveFavorite(item)}
                    isFavorite={favoriteIds.includes(item._id)}
                  />
                );
              }}
            />
          </View>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <View style={styles.emptyIconBackground} />
              <Heart size={80} color={appColors.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>{t('favorites.noFavoritesYet')}</Text>
            <Text style={styles.emptySubtitle}>
              {t('favorites.emptySubtitle')}
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => navigation.navigate(screenNames.customerHome)}
              activeOpacity={0.8}
            >
              <Search size={20} color={appColors.white} />
              <Text style={styles.emptyButtonText}>{t('favorites.browseAuctions')}</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
