import React, { useCallback, useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Modal,
  FlatList,
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
  X,
  Clock,
  DollarSign,
  User,
  Eye,
  Calendar,
  Menu,
  Settings,
  HelpCircle,
  LogOut,
  Package,
  MessageCircle,
  Home as HomeIcon,
} from 'lucide-react-native';
import { appColors } from '../../../utils/appColors';
import { fetchItems } from '../../../api/items';
import { useAppSelector } from '../../../redux/hooks';
import { useGreeting } from '../../../hooks/useGreeting';
import { getSocket, connectSocket, requestBidDetails } from '../../../socket/socketService';
import { API_BASE_URL } from '../../../api/autentication';
import { getItem } from '../../../utils/methods';
import type { Socket } from 'socket.io-client';

interface VehicleBid {
  id: string;
  auctionId: string;
  auctionTitle: string;
  auctionImage: string;
  auctionImageAlt: string;
  currentBid: number;
  bidderCount: number;
  timeRemaining: string;
  status: 'hot' | 'active' | 'ending' | 'live' | 'upcoming' | 'sold' | 'pending';
  category: string;
  endTime?: string;
  startTime?: string;
  buyNowEnabled?: boolean;
  buyNowPrice?: number;
  seller?: string;
  sellerId?: string;
  vehicle?: {
    make: string;
    model: string;
    year: number;
    mileage: number;
    fuelType: string;
    transmission: string;
  };
}

interface BidDetail {
  id: string;
  amount: number;
  bidderEmail?: string;
  bidderName?: string;
  createdAt: string;
}

interface BidDetailsResponse {
  success: boolean;
  data?: {
    auction?: {
      id: string;
      title: string;
      currentBid?: number;
      photos?: string[];
      videos?: string[];
    };
    bids?: BidDetail[];
    total?: number;
  };
}

export default function AdminHome() {
  const navigation = useNavigation<RootNavigationProp>();
  const currentUser = useAppSelector(state => state.profile.user);
  const greeting = useGreeting();
  const [items, setItems] = useState<AuctionItem[] | null>([]);
  const [bids, setBids] = useState<VehicleBid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const [timers, setTimers] = useState<Record<string, { endTime: string; timeRemaining: string }>>({});
  const [showBidDetailsModal, setShowBidDetailsModal] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [bidDetails, setBidDetails] = useState<BidDetailsResponse['data'] | null>(null);
  const [bidDetailsLoading, setBidDetailsLoading] = useState(false);
  const [soldVehicles, setSoldVehicles] = useState<AuctionItem[]>([]);
  const [soldVehiclesLoading, setSoldVehiclesLoading] = useState(false);
  const [vehicleStats, setVehicleStats] = useState({
    live: 0,
    pending: 0,
    upcoming: 0,
    sold: 0,
  });
  const [statsLoading, setStatsLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const handleViewAllAuctions = () => {
    navigation.navigate(screenNames.adminAuctionItems);
  };

  const handleGoToNotifications = () => {
    navigation.navigate(screenNames.notifications);
  };

  const handleDrawerItemPress = (screen: string) => {
    setDrawerVisible(false);
    if (screen === 'home') {
      // Already on home
    } else if (screen === 'vehicles') {
      navigation.navigate(screenNames.adminAuctionItems);
    } else if (screen === 'chats') {
      // Navigate to chats tab - handled by bottom tab navigator
      // You can use navigation.navigate if needed
    } else if (screen === 'profile') {
      navigation.navigate(screenNames.profile);
    } else if (screen === 'settings') {
      // Navigate to settings if exists
    } else if (screen === 'help') {
      navigation.navigate(screenNames.helpSupport);
    } else if (screen === 'logout') {
      // Handle logout
    }
  };

  const handleStatCardClick = (type: 'live' | 'pending' | 'upcoming' | 'sold') => {
    // Navigate to filtered view - you may need to update AdminAuctionItems to accept params
    navigation.navigate(screenNames.adminAuctionItems);
  };

  const stats = [
    {
      id: '1',
      label: 'Live',
      value: statsLoading ? '...' : vehicleStats.live,
      icon: Gavel,
      onClick: () => handleStatCardClick('live'),
    },
    {
      id: '2',
      label: 'Upcoming',
      value: statsLoading ? '...' : vehicleStats.upcoming,
      icon: Megaphone,
      onClick: () => handleStatCardClick('upcoming'),
    },
    {
      id: '3',
      label: 'Pending',
      value: statsLoading ? '...' : vehicleStats.pending,
      icon: AlertCircle,
      onClick: () => handleStatCardClick('pending'),
    },
    {
      id: '4',
      label: 'Sold',
      value: statsLoading ? '...' : vehicleStats.sold,
      icon: HandCoins,
      onClick: () => handleStatCardClick('sold'),
    },
  ];

  // Fetch vehicle statistics
  const fetchVehicleStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const token = await getItem<string>('auth_token');
      const response = await fetch(`${API_BASE_URL}api/vehicles?limit=1000`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await response.json();
      if (data.vehicles) {
        const stats = {
          live: data.vehicles.filter((v: any) => v.status === 'live').length,
          pending: data.vehicles.filter((v: any) => v.status === 'pending').length,
          upcoming: data.vehicles.filter((v: any) => v.status === 'upcoming').length,
          sold: data.vehicles.filter((v: any) => v.status === 'sold').length,
        };
        setVehicleStats(stats);
      }
    } catch (err) {
      console.error('Failed to fetch vehicle stats:', err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Fetch recently sold vehicles
  const fetchSoldVehicles = useCallback(async () => {
    try {
      setSoldVehiclesLoading(true);
      const token = await getItem<string>('auth_token');
      const response = await fetch(`${API_BASE_URL}api/vehicles?status=sold&limit=4`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await response.json();
      if (data.vehicles) {
        const sorted = data.vehicles
          .sort((a: any, b: any) => {
            const dateA = new Date(a.updatedAt || a.createdAt).getTime();
            const dateB = new Date(b.updatedAt || b.createdAt).getTime();
            return dateB - dateA;
          })
          .slice(0, 4);
        setSoldVehicles(sorted);
      }
    } catch (err) {
      console.error('Failed to fetch sold vehicles:', err);
    } finally {
      setSoldVehiclesLoading(false);
    }
  }, []);

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

  // Convert AuctionItem to VehicleBid format
  const convertToVehicleBid = (item: AuctionItem): VehicleBid => {
    return {
      id: item._id,
      auctionId: item._id,
      auctionTitle: item.title,
      auctionImage: item.photos?.[0] || '',
      auctionImageAlt: `${item.make} ${item.model}`.trim() || 'Vehicle',
      currentBid: typeof item.currentBid === 'number' ? item.currentBid : parseFloat(String(item.currentBid || item.startingPrice || 0)),
      bidderCount: 0, // Will be updated from socket
      timeRemaining: '',
      status: item.status as any,
      category: `${item.make} ${item.model} ${item.year}`.trim() || 'Vehicle',
      endTime: item.biddingEndsAt ? new Date(item.biddingEndsAt).toISOString() : undefined,
      startTime: item.biddingStartsAt ? new Date(item.biddingStartsAt).toISOString() : undefined,
      buyNowEnabled: false,
      vehicle: {
        make: item.make,
        model: item.model,
        year: typeof item.year === 'number' ? item.year : parseInt(String(item.year || 0)),
        mileage: typeof item.mileage === 'number' ? item.mileage : parseFloat(String(item.mileage || 0)),
        fuelType: item.fuelType || '',
        transmission: item.transmissionType || '',
      },
    };
  };

  // Socket.IO setup
  useEffect(() => {
    if (!currentUser) return;

    const socket = getSocket();
    if (!socket.connected) {
      connectSocket();
    }

    socketRef.current = socket;

    const userId = String(currentUser.id || (currentUser as any)._id || '');
    const userRole = String(currentUser.role ?? 'admin');

    // Join admin room with viewAllVehicles
    socket.emit('join', {
      userId: String(userId),
      userRole,
      viewAllVehicles: true,
    });

    socket.on('connect', () => {
      console.log('[Admin] Socket connected:', socket.id);
      setSocketConnected(true);
      setError(null);
    });

    socket.on('disconnect', (reason) => {
      console.warn('[Admin] Socket disconnected:', reason);
      setSocketConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('[Admin] Connection error:', error);
      setError('Failed to connect to real-time server');
    });

    socket.on('initial_bids', (incomingBids: VehicleBid[]) => {
      console.log('[Admin] Received initial_bids:', incomingBids.length);
      if (Array.isArray(incomingBids)) {
        const bidsWithCounts = incomingBids.map((bid) => ({
          ...bid,
          bidderCount: bid.bidderCount || 0,
          startTime: (bid as any).startTime,
        }));
        setBids(bidsWithCounts);
        setLastUpdated(new Date());

        const newTimers: Record<string, { endTime: string; timeRemaining: string }> = {};
        bidsWithCounts.forEach((bid) => {
          if (bid.endTime && !bid.buyNowEnabled) {
            newTimers[bid.auctionId] = {
              endTime: bid.endTime,
              timeRemaining: bid.timeRemaining || '00:00',
            };
          }
        });
        setTimers((prev) => ({ ...prev, ...newTimers }));
      }
    });

    socket.on('bid_update', (updatedBid: VehicleBid & { endTime?: string; fullData?: any }) => {
      console.log('[Admin] Received bid_update:', updatedBid.auctionId, updatedBid.currentBid);

      if (!updatedBid || !updatedBid.auctionId) return;

      const isRestartedAuction = (updatedBid as any).restarted === true;

      setBids((prevBids) => {
        const existingBid = prevBids.find((b) => b.auctionId === updatedBid.auctionId);

        if (!existingBid && !isRestartedAuction) {
          console.log(`[Admin] Adding new live vehicle ${updatedBid.auctionId} to dashboard`);
        }

        if (updatedBid.endTime) {
          setTimers((prev) => ({
            ...prev,
            [updatedBid.auctionId]: {
              endTime: updatedBid.endTime!,
              timeRemaining: updatedBid.timeRemaining || '00:00',
            },
          }));
        }

        const completeBid: VehicleBid = {
          id: updatedBid.id || existingBid?.id || updatedBid.auctionId,
          auctionId: updatedBid.auctionId,
          auctionTitle: updatedBid.auctionTitle || existingBid?.auctionTitle || updatedBid.fullData?.title || 'Vehicle Auction',
          auctionImage: updatedBid.auctionImage || existingBid?.auctionImage || updatedBid.fullData?.photos?.[0] || '',
          auctionImageAlt: updatedBid.auctionImageAlt || existingBid?.auctionImageAlt || `${updatedBid.fullData?.make || ''} ${updatedBid.fullData?.model || ''}`.trim() || 'Vehicle',
          currentBid: updatedBid.currentBid ?? existingBid?.currentBid ?? updatedBid.fullData?.currentBid ?? 0,
          bidderCount: updatedBid.bidderCount ?? existingBid?.bidderCount ?? updatedBid.fullData?.bidderCount ?? 0,
          timeRemaining: (updatedBid as any).buyNowEnabled ? '' : (updatedBid.timeRemaining || existingBid?.timeRemaining || '00:00'),
          status: updatedBid.status || existingBid?.status || 'active',
          category: updatedBid.category || existingBid?.category || `${updatedBid.fullData?.make || ''} ${updatedBid.fullData?.model || ''} ${updatedBid.fullData?.year || ''}`.trim() || 'Vehicle',
          endTime: (updatedBid as any).buyNowEnabled ? undefined : (updatedBid.endTime || existingBid?.endTime || updatedBid.fullData?.biddingEndsAt),
          startTime: (updatedBid as any).startTime || existingBid?.startTime || updatedBid.fullData?.biddingStartsAt,
          buyNowEnabled: (updatedBid as any).buyNowEnabled ?? existingBid?.buyNowEnabled ?? updatedBid.fullData?.buyNowEnabled,
          buyNowPrice: (updatedBid as any).buyNowPrice ?? existingBid?.buyNowPrice ?? updatedBid.fullData?.buyNowPrice,
          vehicle: {
            make: updatedBid.vehicle?.make || existingBid?.vehicle?.make || updatedBid.fullData?.make || '',
            model: updatedBid.vehicle?.model || existingBid?.vehicle?.model || updatedBid.fullData?.model || '',
            year: updatedBid.vehicle?.year ?? existingBid?.vehicle?.year ?? updatedBid.fullData?.year ?? 0,
            mileage: updatedBid.vehicle?.mileage ?? existingBid?.vehicle?.mileage ?? updatedBid.fullData?.mileage ?? 0,
            fuelType: updatedBid.vehicle?.fuelType || existingBid?.vehicle?.fuelType || updatedBid.fullData?.fuelType || '',
            transmission: updatedBid.vehicle?.transmission || existingBid?.vehicle?.transmission || updatedBid.fullData?.transmission || '',
          },
        };

        if (existingBid) {
          return prevBids.map((b) =>
            b.auctionId === updatedBid.auctionId ? completeBid : b
          );
        } else {
          console.log('[Admin] ✅ Adding new/restarted vehicle to dashboard:', updatedBid.auctionId);
          return [completeBid, ...prevBids];
        }
      });

      setLastUpdated(new Date());
    });

    socket.on('auction_completed', (data: any) => {
      console.log('[Admin] Received auction_completed:', data);
      if (data && data.auctionId && data.status === 'pending') {
        setBids((prevBids) =>
          prevBids.map((bid) =>
            bid.auctionId === data.auctionId
              ? { ...bid, status: 'pending', timeRemaining: '00:00' }
              : bid
          )
        );
        console.log(`[Admin] Updated vehicle ${data.auctionId} status to 'pending'`);
        fetchVehicleStats();
      }
    });

    socket.on('bid_details_response', (response: BidDetailsResponse) => {
      if (response.success && response.data) {
        console.log('═══════ BID DETAILS MEDIA DEBUG ═══════');
        console.log('Auction ID:', response.data.auction?.id);
        console.log('Videos received?:', Array.isArray(response.data.auction?.videos));
        console.log('Videos length:', response.data.auction?.videos?.length ?? 0);
        console.log('First video URL:', response.data.auction?.videos?.[0] || '— none —');
        console.log('Photos length:', response.data.auction?.photos?.length ?? 0);
        console.log('═══════ END DEBUG ═══════');
        setBidDetails(response.data);
        setBidDetailsLoading(false);
      } else {
        setError('Failed to load bid details');
        setBidDetailsLoading(false);
      }
    });

    socket.on('bid_details_error', (errorResponse: any) => {
      setError(errorResponse.message || 'Failed to load bid details');
      setBidDetailsLoading(false);
    });

    return () => {
      socket.off('bid_details_response');
      socket.off('bid_details_error');
      socket.off('auction_completed');
      socket.off('bid_update');
      socket.off('initial_bids');
    };
  }, [currentUser, fetchVehicleStats]);

  // Timer logic for upcoming and live auctions
  useEffect(() => {
    const interval = setInterval(() => {
      setBids((prev) =>
        prev.map((bid) => {
          // Skip Buy Now vehicles
          if (bid.buyNowEnabled) {
            return { ...bid, timeRemaining: '' };
          }

          // Skip completed auctions
          if (bid.status === 'pending' || bid.status === 'sold') {
            return { ...bid, timeRemaining: '00:00' };
          }

          // FOR UPCOMING AUCTIONS: Calculate time until START
          if (bid.status === 'upcoming' && bid.startTime) {
            const start = new Date(bid.startTime);
            const now = new Date();
            const diff = start.getTime() - now.getTime();

            if (diff <= 0) {
              return { ...bid, timeRemaining: '00:00' };
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            const timeRemaining =
              hours > 0
                ? `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
                : `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

            return { ...bid, timeRemaining };
          }

          // FOR LIVE AUCTIONS: Calculate time until END
          const endTimeStr = bid.endTime || timers[bid.auctionId]?.endTime;
          if (!endTimeStr) return bid;

          const endTime = new Date(endTimeStr);
          const now = new Date();
          const diff = endTime.getTime() - now.getTime();

          if (diff <= 0) {
            return { ...bid, timeRemaining: '00:00' };
          }

          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);

          const timeRemaining =
            hours > 0
              ? `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
              : `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

          return { ...bid, timeRemaining };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [timers]);

  // Handle bid details modal updates
  useEffect(() => {
    if (!socketRef.current) return;

    const socket = socketRef.current;

    const handleBidUpdateForModal = (updatedBid: any) => {
      if (showBidDetailsModal && selectedVehicleId && selectedVehicleId === updatedBid.auctionId) {
        requestBidDetails(selectedVehicleId);
      }
    };

    socket.on('bid_update', handleBidUpdateForModal);

    return () => {
      socket.off('bid_update', handleBidUpdateForModal);
    };
  }, [showBidDetailsModal, selectedVehicleId]);

  const handleViewBidDetails = (vehicleId: string) => {
    try {
      const vehicle = bids.find((b) => b.auctionId === vehicleId);
      if (vehicle?.buyNowEnabled) {
        console.log('[Admin] Buy Now vehicle - bid details not available');
        return;
      }

      setSelectedVehicleId(vehicleId);
      setShowBidDetailsModal(true);
      setBidDetailsLoading(true);
      setBidDetails(null);
      setError(null);

      const timeoutId = setTimeout(() => {
        setBidDetailsLoading(false);
        setError('Request timeout. Please try again.');
      }, 10000);

      if (socketRef.current?.connected && vehicleId) {
        requestBidDetails(vehicleId);
      } else {
        clearTimeout(timeoutId);
        setError('Socket not connected. Please refresh the page.');
        setBidDetailsLoading(false);
      }
    } catch (error) {
      console.error('[Admin] Error in handleViewBidDetails:', error);
      setError('Failed to load bid details');
      setBidDetailsLoading(false);
    }
  };

  // Load on first mount and when screen gains focus
  useFocusEffect(
    useCallback(() => {
      loadItems();
      fetchVehicleStats();
      fetchSoldVehicles();
    }, [loadItems, fetchVehicleStats, fetchSoldVehicles]),
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
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.menuButton}
              activeOpacity={0.8}
              onPress={() => setDrawerVisible(true)}
            >
              <Menu size={24} color={appColors.textSecondary} />
            </TouchableOpacity>
            
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
                <TouchableOpacity
                  key={item.id}
                  style={styles.statCard}
                  onPress={item.onClick}
                  activeOpacity={0.7}
                >
                  {item.icon && (
                    <item.icon
                      size={28}
                      color={appColors.primary}
                      style={{ marginBottom: 8 }}
                    />
                  )}
                  <Text style={styles.statLabel}>{item.label}</Text>
                  <Text style={styles.statValue}>{item.value}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Unified Auctions Section */}
            <View style={styles.sectionNoBackground}>
              <View style={styles.sectionHeaderRowNoPadding}>
                <View>
                  <Text style={styles.sectionTitle}>Auctions</Text>
                  <Text style={styles.sectionSubtitle}>
                    Real-time monitoring • {bids.length} active auction{bids.length !== 1 ? 's' : ''}
                    {lastUpdated && (
                      <Text> • Updated {lastUpdated.toLocaleTimeString()}</Text>
                    )}
                  </Text>
                </View>
              </View>

              {bids.length > 0 ? (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.horizontalScrollContent}
                >
                  {bids.map((bid) => {
                    // Convert VehicleBid back to AuctionItem for card components
                    const item: AuctionItem = {
                      _id: bid.auctionId,
                      title: bid.auctionTitle,
                      make: bid.vehicle?.make || '',
                      model: bid.vehicle?.model || '',
                      year: bid.vehicle?.year || 0,
                      vin: '',
                      mileage: bid.vehicle?.mileage || 0,
                      horsePower: 0,
                      engineCapacity: '',
                      engineCylinder: '',
                      noOfSeats: 0,
                      warranty: false,
                      serviceHistory: false,
                      rimSize: '',
                      fuelType: bid.vehicle?.fuelType || '',
                      driveType: '',
                      roofType: '',
                      bodyType: '',
                      transmissionType: bid.vehicle?.transmission || '',
                      color: '',
                      registrationCity: '',
                      noOfKeys: 0,
                      location: '',
                      startingPrice: bid.currentBid,
                      minimumBidIncrement: 0,
                      biddingStartsAt: bid.startTime,
                      biddingEndsAt: bid.endTime,
                      description: '',
                      photos: bid.auctionImage ? [bid.auctionImage] : [],
                      features: {},
                      status: bid.status as any,
                      currentBid: bid.currentBid,
                      createdAt: '',
                      updatedAt: '',
                      firstOwner: false,
                      sellerNationality: '',
                    };

                    if (bid.status === 'live') {
                      return (
                        <LiveAuctionCard
                          key={bid.auctionId}
                          item={item}
                          onPress={() => {
                            navigation.navigate(screenNames.itemDetails, {
                              auctionId: bid.auctionId,
                              item,
                            });
                          }}
                          onViewBidDetails={handleViewBidDetails}
                        />
                      );
                    } else if (bid.status === 'upcoming') {
                      return (
                        <UpcomingAuctionCard
                          key={bid.auctionId}
                          item={item}
                          onPress={() => {
                            navigation.navigate(screenNames.itemDetails, {
                              auctionId: bid.auctionId,
                              item,
                            });
                          }}
                        />
                      );
                    } else if (bid.status === 'pending') {
                      return (
                        <PendingAuctionCard
                          key={bid.auctionId}
                          item={item}
                          onPress={() => {
                            navigation.navigate(screenNames.itemDetails, {
                              auctionId: bid.auctionId,
                              item,
                            });
                          }}
                        />
                      );
                    }
                    return null;
                  })}
                </ScrollView>
              ) : (
                <View style={styles.emptyCard}>
                  <Text style={styles.emptyTitle}>No Live Auctions</Text>
                  <Text style={styles.emptySubtitle}>
                    Check back soon for new vehicles
                  </Text>
                </View>
              )}
            </View>

            {/* Recently Sold Vehicles */}
            <View style={styles.sectionNoBackground}>
              <View style={styles.sectionHeaderRowNoPadding}>
                <View>
                  <Text style={styles.sectionTitle}>Recently Sold Vehicles</Text>
                  <Text style={styles.sectionSubtitle}>
                    Latest completed sales • {soldVehicles.length} vehicle{soldVehicles.length !== 1 ? 's' : ''}
                  </Text>
                </View>
              </View>

              {soldVehiclesLoading ? (
                <View style={styles.emptyCard}>
                  <ActivityIndicator size="large" color={appColors.primary} />
                </View>
              ) : soldVehicles.length > 0 ? (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.horizontalScrollContent}
                >
                  {soldVehicles.map((vehicle) => (
                    <RecentlySoldVehicles
                      key={vehicle._id}
                      items={[vehicle]}
                      onItemPress={item => {
                        navigation.navigate(screenNames.itemDetails, {
                          auctionId: item._id,
                          item,
                        });
                      }}
                      onViewWinner={item => {
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
                  <Text style={styles.emptyTitle}>No Sold Vehicles</Text>
                  <Text style={styles.emptySubtitle}>
                    Completed sales will appear here
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>
      <FloatingActionButton
        size={60}
        onPress={() => navigation.navigate(screenNames.addAuctionItem)}
      />

      {/* Bid Details Modal */}
      <Modal
        visible={showBidDetailsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setShowBidDetailsModal(false);
          setSelectedVehicleId(null);
          setBidDetails(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Bid Details</Text>
                {bidDetails && (
                  <Text style={styles.modalSubtitle}>
                    {bidDetails.auction?.title} • {bidDetails.total || 0} Total Bids
                  </Text>
                )}
              </View>
              <TouchableOpacity
                onPress={() => {
                  setShowBidDetailsModal(false);
                  setSelectedVehicleId(null);
                  setBidDetails(null);
                }}
                style={styles.modalCloseButton}
              >
                <X size={24} color={appColors.white} />
              </TouchableOpacity>
            </View>

            {/* Stats Row */}
            {bidDetails && (
              <View style={styles.modalStatsRow}>
                <View style={styles.modalStatCard}>
                  <Text style={styles.modalStatLabel}>Auction Title</Text>
                  <Text style={styles.modalStatValue} numberOfLines={1}>
                    {bidDetails.auction?.title || 'N/A'}
                  </Text>
                </View>
                <View style={styles.modalStatCard}>
                  <Text style={styles.modalStatLabel}>Current Bid</Text>
                  <Text style={styles.modalStatValue}>
                    ${bidDetails.auction?.currentBid?.toLocaleString() || '0'}
                  </Text>
                </View>
                <View style={styles.modalStatCard}>
                  <Text style={styles.modalStatLabel}>Total Bids</Text>
                  <Text style={styles.modalStatValue}>{bidDetails.total || 0}</Text>
                </View>
              </View>
            )}

            {/* Bid List */}
            <ScrollView style={styles.modalBidList} showsVerticalScrollIndicator={true}>
              {bidDetailsLoading ? (
                <View style={styles.modalLoadingContainer}>
                  <ActivityIndicator size="large" color={appColors.primary} />
                  <Text style={styles.modalLoadingText}>Loading bid details...</Text>
                </View>
              ) : bidDetails && bidDetails.bids && bidDetails.bids.length > 0 ? (
                <View style={styles.bidListContainer}>
                  {bidDetails.bids.map((bid, index) => (
                    <View
                      key={bid.id || index}
                      style={[
                        styles.bidItem,
                        index === 0 && styles.winningBidItem,
                      ]}
                    >
                      {index === 0 && (
                        <View style={styles.winningBadge}>
                          <Text style={styles.winningBadgeText}>🏆 Winning Bid</Text>
                        </View>
                      )}
                      <View style={styles.bidItemContent}>
                        <View style={styles.bidItemHeader}>
                          <View style={[styles.bidRank, index === 0 && styles.winningRank]}>
                            <Text style={styles.bidRankText}>#{index + 1}</Text>
                          </View>
                          <View style={styles.bidItemInfo}>
                            <View style={styles.bidItemRow}>
                              <User size={14} color={appColors.textMuted} />
                              <Text style={styles.bidderEmail} numberOfLines={1}>
                                {bid.bidderEmail || 'Anonymous'}
                              </Text>
                            </View>
                            <View style={styles.bidItemRow}>
                              <DollarSign size={16} color={appColors.green} />
                              <Text style={[styles.bidAmount, index === 0 && styles.winningBidAmount]}>
                                ${bid.amount.toLocaleString()}
                              </Text>
                            </View>
                            <View style={styles.bidItemRow}>
                              <Clock size={12} color={appColors.textMuted} />
                              <Text style={styles.bidDate}>
                                {new Date(bid.createdAt).toLocaleDateString()}
                              </Text>
                              <Text style={styles.bidTime}>
                                {new Date(bid.createdAt).toLocaleTimeString()}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <View style={styles.modalEmptyContainer}>
                  <Text style={styles.modalEmptyText}>No Bids Yet</Text>
                  <Text style={styles.modalEmptySubtext}>
                    This auction hasn't received any bids
                  </Text>
                </View>
              )}
            </ScrollView>

            {/* Modal Footer */}
            <View style={styles.modalFooter}>
              <Text style={styles.modalFooterText}>
                {bidDetails && bidDetails.bids && bidDetails.bids.length > 0 ? (
                  <>
                    Showing <Text style={styles.modalFooterBold}>{bidDetails.bids.length}</Text> of{' '}
                    <Text style={styles.modalFooterBold}>{bidDetails.total || 0}</Text> bids
                  </>
                ) : (
                  'No bids to display'
                )}
              </Text>
              <TouchableOpacity
                style={styles.modalCloseButtonFooter}
                onPress={() => {
                  setShowBidDetailsModal(false);
                  setSelectedVehicleId(null);
                  setBidDetails(null);
                }}
              >
                <Text style={styles.modalCloseButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Drawer Navigation */}
      <Modal
        visible={drawerVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setDrawerVisible(false)}
      >
        <TouchableOpacity
          style={styles.drawerOverlay}
          activeOpacity={1}
          onPress={() => setDrawerVisible(false)}
        >
          <View style={styles.drawerContent}>
            <View style={styles.drawerHeader}>
              <View>
                <Text style={styles.drawerUserName}>{currentUser?.name}</Text>
                <Text style={styles.drawerUserEmail}>{currentUser?.email}</Text>
              </View>
              <TouchableOpacity
                onPress={() => setDrawerVisible(false)}
                style={styles.drawerCloseButton}
              >
                <X size={24} color={appColors.textPrimary} />
              </TouchableOpacity>
            </View>

            <View style={styles.drawerMenu}>
              <TouchableOpacity
                style={styles.drawerMenuItem}
                onPress={() => handleDrawerItemPress('home')}
                activeOpacity={0.7}
              >
                <HomeIcon size={20} color={appColors.textPrimary} />
                <Text style={styles.drawerMenuItemText}>Home</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.drawerMenuItem}
                onPress={() => handleDrawerItemPress('vehicles')}
                activeOpacity={0.7}
              >
                <Package size={20} color={appColors.textPrimary} />
                <Text style={styles.drawerMenuItemText}>Vehicles</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.drawerMenuItem}
                onPress={() => handleDrawerItemPress('chats')}
                activeOpacity={0.7}
              >
                <MessageCircle size={20} color={appColors.textPrimary} />
                <Text style={styles.drawerMenuItemText}>Chats</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.drawerMenuItem}
                onPress={() => handleDrawerItemPress('profile')}
                activeOpacity={0.7}
              >
                <User size={20} color={appColors.textPrimary} />
                <Text style={styles.drawerMenuItemText}>Profile</Text>
              </TouchableOpacity>

              <View style={styles.drawerDivider} />

              <TouchableOpacity
                style={styles.drawerMenuItem}
                onPress={() => handleDrawerItemPress('help')}
                activeOpacity={0.7}
              >
                <HelpCircle size={20} color={appColors.textPrimary} />
                <Text style={styles.drawerMenuItemText}>Help & Support</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.drawerMenuItem, styles.drawerMenuItemLogout]}
                onPress={() => handleDrawerItemPress('logout')}
                activeOpacity={0.7}
              >
                <LogOut size={20} color={appColors.red} />
                <Text style={[styles.drawerMenuItemText, styles.drawerMenuItemTextLogout]}>
                  Logout
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}
