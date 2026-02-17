import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Button, Header, ItemCard, Tabs } from '../../../components';
import type { AuctionItemsTab, RootNavigationProp } from '../../../utils/types';
import screenNames from '../../../routes/routes';
import { styles } from './styles';
import {
  deleteAuctionItem,
  changeAuctionItemStatus,
  fetchItems,
} from '../../../api/items';
import { useAppSelector } from '../../../redux/hooks';
import { AuctionItem } from '../../../utils/types';
import { useI18n } from '../../../i18n';

export default function AuctionItems() {
  const [activeTab, setActiveTab] = useState<AuctionItemsTab>('active');

  const navigation = useNavigation<any>();
  const currentUser = useAppSelector(state => state.profile.user);
  const { t } = useI18n();
  const [items, setItems] = useState<AuctionItem[] | null>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tabs = useMemo(
    () => [
      { key: 'active', label: t('tabs.active') },
      { key: 'upcoming', label: t('tabs.upcoming') },
      { key: 'pending', label: t('tabs.pending') },
      { key: 'sold', label: t('tabs.sold') },
    ],
    [t],
  );

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchItems();

      console.log('data', data);

      // Backend response shape: { vehicles: AuctionItem[], pagination: {...} }
      const vehicles = (data as any)?.vehicles;
      const list: AuctionItem[] = Array.isArray(vehicles)
        ? (vehicles as AuctionItem[])
        : [];
      setItems(list);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to load auction items', e);
      setError(
        e instanceof Error
          ? e.message
          : t('auctionItems.loadFailed'),
      );
    } finally {
      setLoading(false);
    }
  }, [t]);

  // Load whenever the screen comes into focus (including first load)
  useFocusEffect(
    useCallback(() => {
      void loadItems();
    }, [loadItems, activeTab]),
  );

  const filteredItems = useMemo(() => {
    const list = Array.isArray(items) ? items : [];
    return list.filter(item => {
      if (activeTab === 'active') {
        return item?.status === 'live';
      }
      if (activeTab === 'upcoming') {
        return item?.status === 'upcoming';
      }
      if (activeTab === 'pending') {
        return item?.status === 'pending';
      }
      // auctioned
      return item?.status === 'sold';
    });
  }, [items, activeTab]);

  const formatStatus = (status: AuctionItem['status']) => {
    switch (status) {
      case 'live':
        return t('status.live');
      case 'upcoming':
        return t('status.pendingReview');
      case 'sold':
      default:
        return t('status.completed');
    }
  };

  const formatEndsIn = (item: AuctionItem) => {
    if (!item.biddingEndsAt) {
      return '—';
    }
    const end = new Date(item.biddingEndsAt).getTime();
    const now = Date.now();
    if (Number.isNaN(end)) {
      return '—';
    }
    if (end <= now) {
      return t('status.ended');
    }
    const diffMs = end - now;
    const totalMinutes = Math.floor(diffMs / (60 * 1000));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const handleOpenDetails = (item: AuctionItem) => {
    navigation.navigate(screenNames.itemDetails, {
      auctionId: item._id,
      item,
    });
  };

  const handleEditItem = (item: AuctionItem) => {
    navigation.navigate('AddAuctionItem', {
      mode: 'edit',
      item,
    });
  };

  const handleDeleteItem = (item: AuctionItem) => {
    Alert.alert(t('common.delete'), t('auctionItems.deleteConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        onPress: async () => {
          try {
            await deleteAuctionItem(item._id);
            await loadItems(); // refresh list
          } catch (e) {
            console.log('Delete failed', e);
            Alert.alert(
              t('common.error'),
              e instanceof Error ? e.message : t('auctionItems.deleteFailed'),
            );
          }
        },
      },
    ]);
  };

  const handleMarkAs = async (itemId: string, status: string) => {
    try {
      console.log('Mark as', itemId, status);
      await changeAuctionItemStatus(itemId, status);
      await loadItems(); // refresh list
    } catch (e) {
      console.log('Mark as failed', e);
      Alert.alert(
        t('common.error'),
        e instanceof Error ? e.message : `${t('auctionItems.markFailed')} ${status}`,
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header titleKey="auctionItems.title" showBackButton={false} />

      <View style={styles.headerRow}>
        <Text style={styles.title}>{t('auctionItems.manageListings')}</Text>

        <Button
          label={t('auctionItems.addAuctionItem')}
          onPress={() => navigation.navigate(screenNames.addAuctionItem)}
          buttonStyle={styles.addButton}
          textStyle={styles.addButtonText}
        />
      </View>

      {/* <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'active' && styles.tabButtonActive,
          ]}
          activeOpacity={0.8}
          onPress={() => setActiveTab('active')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'active' && styles.tabTextActive,
            ]}
          >
            Active
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'upcoming' && styles.tabButtonActive,
          ]}
          activeOpacity={0.8}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'upcoming' && styles.tabTextActive,
            ]}
          >
            Upcoming
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'pending' && styles.tabButtonActive,
          ]}
          activeOpacity={0.8}
          onPress={() => setActiveTab('pending')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'pending' && styles.tabTextActive,
            ]}
          >
            Pending
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'auctioned' && styles.tabButtonActive,
          ]}
          activeOpacity={0.8}
          onPress={() => setActiveTab('auctioned')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'auctioned' && styles.tabTextActive,
            ]}
          >
            Auctioned
          </Text>
        </TouchableOpacity>
      </View> */}

      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onTabPress={(key: string) => setActiveTab(key as AuctionItemsTab)}
      />

      {loading ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptySubtitle}>{t('auctionItems.loading')}</Text>
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            // Only allow editing when logged-in user id matches seller id
            const currentUserId = currentUser?.id;
            const canEdit =
              currentUserId != null &&
              item.sellerId != null &&
              String(currentUserId) === String(item.sellerId);

            return (
              <ItemCard
                item={item}
                onPress={() => handleOpenDetails(item)}
                onEdit={canEdit ? () => handleEditItem(item) : undefined}
                onDelete={canEdit ? () => handleDeleteItem(item) : undefined}
                mark={activeTab === 'pending' || activeTab === 'upcoming'}
                onMarkAs={status => handleMarkAs(item._id, status)}
                markAs={activeTab === 'upcoming' ? 'live' : 'sold'}
              />
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>{t('auctionItems.emptyTitle')}</Text>
              <Text style={styles.emptySubtitle}>
                {t('auctionItems.emptySubtitle')}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
