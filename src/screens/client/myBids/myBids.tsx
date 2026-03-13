import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { styles } from './styles';
import { Header, Tabs } from '../../../components';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { fetchMyBidsItems } from '../../../api/items';
import { useAppSelector } from '../../../redux/hooks';
import screenNames from '../../../routes/routes';
import {
  AuctionItem,
  MyBidsTab,
  RootNavigationProp,
} from '../../../utils/types';
import { appColors } from '../../../utils/appColors';
import { FileText, DollarSign } from 'lucide-react-native';
import { height, width } from '../../../utils/dimensions';
import { useI18n } from '../../../i18n';

interface BidItem {
  id: string;
  amount: number;
  createdAt: string;
  vehicle: AuctionItem;
  auctionId: string;
  auctionTitle: string;
  auctionImage: string;
}

export default function MyBids() {
  const { t } = useI18n();
  const currentUser = useAppSelector(state => state.profile.user);
  const navigation = useNavigation<RootNavigationProp>();

  const [activeTab, setActiveTab] = useState<MyBidsTab>('active');
  const [myBids, setMyBids] = useState<BidItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpenItem = (bid: BidItem) => {
    navigation.navigate(screenNames.itemDetails, {
      myBids: true,
      auctionId: bid.auctionId || bid.vehicle?._id,
      item: bid.vehicle,
    });
  };

  const fetchMyBids = async () => {
    try {
      setLoading(true);
      setError(null);
      const bidderId = currentUser?.id || currentUser?.email;
      
      if (!bidderId) {
        setLoading(false);
        return;
      }

      const data: any = await fetchMyBidsItems(bidderId);
      
      if (Array.isArray(data.data)) {
        const allBids: BidItem[] = [];
        const now = new Date();
        
        data.data.forEach((vehicleGroup: any) => {
          if (vehicleGroup.bids && Array.isArray(vehicleGroup.bids)) {
            vehicleGroup.bids.forEach((bid: any) => {
              let vehicleStatus = vehicleGroup.vehicle?.status || 'upcoming';
              
              if (vehicleGroup.vehicle?.biddingEndsAt) {
                const endTime = new Date(vehicleGroup.vehicle.biddingEndsAt);
                const timeSinceEnd = now.getTime() - endTime.getTime();
                const twoDaysInMs = 2 * 24 * 60 * 60 * 1000;
                
                if (timeSinceEnd > 0) {
                  if (vehicleStatus === 'sold') {
                    vehicleStatus = 'sold';
                  } else if (timeSinceEnd > twoDaysInMs) {
                    vehicleStatus = 'live';
                  } else {
                    vehicleStatus = 'pending';
                  }
                }
              }
              
              allBids.push({
                ...bid,
                vehicle: {
                  ...vehicleGroup.vehicle,
                  status: vehicleStatus,
                },
                auctionId: vehicleGroup.vehicle?.id || vehicleGroup.vehicle?._id,
                auctionTitle: vehicleGroup.vehicle?.title || 
                             `${vehicleGroup.vehicle?.year} ${vehicleGroup.vehicle?.make} ${vehicleGroup.vehicle?.model}`,
                auctionImage: vehicleGroup.vehicle?.photos?.[0] || '',
              });
            });
          }
        });
        
        setMyBids(allBids);
      }
    } catch (err) {
      console.error('Failed to load my bids', err);
      setError(
        err instanceof Error
          ? err.message
          : t('myBids.unableToLoad'),
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filteredBids = useMemo(() => {
    return myBids.filter(bid => {
      if (activeTab === 'active') {
        return bid.vehicle?.status === 'live' || bid.vehicle?.status === 'upcoming';
      }
      // purchased/sold
      return bid.vehicle?.status === 'sold';
    });
  }, [myBids, activeTab]);

  useFocusEffect(
    useCallback(() => {
      void fetchMyBids();
    }, [currentUser]),
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    void fetchMyBids();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return { bg: appColors.green + '20', text: appColors.green, border: appColors.green + '30' };
      case 'sold':
        return { bg: appColors.textMuted + '20', text: appColors.textMuted, border: appColors.textMuted + '30' };
      case 'pending':
        return { bg: '#f59e0b20', text: '#f59e0b', border: '#f59e0b30' };
      default:
        return { bg: appColors.primary + '20', text: appColors.primary, border: appColors.primary + '30' };
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'live':
        return t('status.live');
      case 'sold':
        return t('tabs.sold');
      case 'pending':
        return t('tabs.pending');
      default:
        return t('tabs.upcoming');
    }
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header titleKey="myBids.title" showBackButton={false} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={appColors.primary} />
          <Text style={styles.loadingText}>{t('myBids.loading')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header titleKey="myBids.title" showBackButton={false} />

      {/* Stats Bar */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <FileText size={20} color={appColors.primary} />
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statValue}>{myBids.length}</Text>
            <Text style={styles.statLabel}>{t('myBids.totalBids')}</Text>
          </View>
        </View>
      </View>

      <Tabs
        tabs={[
          { key: 'active', label: t('myBids.activeBids') },
          { key: 'purchased', label: t('myBids.purchased') },
        ]}
        activeTab={activeTab}
        onTabPress={(key: string) => setActiveTab(key as MyBidsTab)}
      />

      <FlatList
        data={filteredBids}
        keyExtractor={(item, index) => item.id || `bid-${index}`}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[appColors.primary]}
            tintColor={appColors.primary}
          />
        }
        renderItem={({ item: bid }) => {
          const statusColors = getStatusColor(bid.vehicle?.status || 'upcoming');
          const statusLabel = getStatusLabel(bid.vehicle?.status || 'upcoming');
          
          return (
            <TouchableOpacity
              style={styles.bidCard}
              onPress={() => handleOpenItem(bid)}
              activeOpacity={0.8}
            >
              <View style={styles.bidCardContent}>
                {bid.auctionImage && (
                  <Image
                    source={{ uri: bid.auctionImage }}
                    style={styles.bidImage}
                    resizeMode="cover"
                  />
                )}
                <View style={styles.bidInfo}>
                  <View style={styles.bidHeader}>
                    <View style={styles.bidTitleContainer}>
                      <Text style={styles.bidTitle} numberOfLines={2}>
                        {bid.auctionTitle}
                      </Text>
                      {bid.vehicle && (
                        <Text style={styles.bidVehicleInfo}>
                          {bid.vehicle.year} {bid.vehicle.make} {bid.vehicle.model}
                        </Text>
                      )}
                    </View>
                    <View style={styles.bidAmountContainer}>
                      <Text style={styles.bidAmount}>
                        ${bid.amount.toLocaleString()}
                      </Text>
                      <Text style={styles.bidDate}>
                        {new Date(bid.createdAt).toLocaleDateString()} {new Date(bid.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.bidFooter}>
                    <View style={[styles.statusBadge, { backgroundColor: statusColors.bg, borderColor: statusColors.border }]}>
                      <Text style={[styles.statusText, { color: statusColors.text }]}>
                        {statusLabel}
                      </Text>
                    </View>
                    {bid.vehicle && (
                      <View style={styles.currentBidContainer}>
                        <DollarSign size={16} color={appColors.textMuted} />
                        <Text style={styles.currentBidLabel}>
                          {t('myBids.currentBid')} <Text style={styles.currentBidValue}>
                            ${(bid.vehicle.currentBid || bid.vehicle.startingPrice || 0).toLocaleString()}
                          </Text>
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <FileText size={64} color={appColors.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>
              {activeTab === 'active'
                ? t('myBids.noBidsYet')
                : t('myBids.noPurchasesYet')}
            </Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === 'active'
                ? t('myBids.emptySubtitleActive')
                : t('myBids.emptySubtitlePurchased')}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
