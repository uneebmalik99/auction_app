import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
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
import { Header } from '../../../components';
import LiveAuctionCard from '../../../components/liveAuctionCard/liveAuctionCard';
import UpcomingAuctionCard from '../../../components/upcomingAuctionCard/upcomingAuctionCard';
import type { AuctionItem, RootNavigationProp } from '../../../utils/types';
import screenNames from '../../../routes/routes';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { toggleFavorite } from '../../../redux/profileSlice';
import { fetchItems } from '../../../api/items';
import { Bell, Signal, Clock } from 'lucide-react-native';
import { appColors } from '../../../utils/appColors';
import { handleFavorite } from '../../../api/favorites';
import { getItem } from '../../../utils/methods';
import { useNotifications } from '../../../hooks/useNotification';
import { useGreeting } from '../../../hooks/useGreeting';
import { getSocket, connectSocket } from '../../../socket/socketService';
import type { Socket } from 'socket.io-client';
import { API_BASE_URL } from '../../../api/autentication';
import { height, width } from '../../../utils/dimensions';

export default function CustomerHome() {
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

  // Socket and real-time state
  const socketRef = useRef<Socket | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [liveAuctions, setLiveAuctions] = useState<AuctionItem[]>([]);
  const [upcomingAuctions, setUpcomingAuctions] = useState<AuctionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Store vehicle data from API for registrationCity
  const [apiVehicles, setApiVehicles] = useState<Map<string, Partial<AuctionItem>>>(new Map());
  
  // Timer state for countdowns
  const [timers, setTimers] = useState<Record<string, { endTime?: string; startTime?: string; timeRemaining: string }>>({});
  
  // Helper to create timer object
  const createTimer = (endTime?: string, startTime?: string, timeRemaining: string = '00:00') => {
    const timer: { endTime?: string; startTime?: string; timeRemaining: string } = { timeRemaining };
    if (endTime) timer.endTime = endTime;
    if (startTime) timer.startTime = startTime;
    return timer;
  };
  
  // Legacy state (keeping for compatibility)
  const [items, setItems] = useState<AuctionItem[]>([]);

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

  // Fetch vehicles from API to get registrationCity
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        console.log('[CustomerHome] Fetching vehicles from API...');
        const baseUrl = API_BASE_URL.replace(/\/+$/, '');
        const response = await fetch(`${baseUrl}/api/vehicles`);
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('[CustomerHome] Received vehicles:', data?.vehicles?.length || 0);
        
        if (data.vehicles && Array.isArray(data.vehicles)) {
          const vehicleMap = new Map<string, Partial<AuctionItem>>();
          
          data.vehicles.forEach((vehicle: any) => {
            const id = vehicle._id?.toString() || '';
            if (id) {
              vehicleMap.set(id, {
                _id: id,
                registrationCity: vehicle.registrationCity || '',
                location: vehicle.location || '',
                make: vehicle.make || '',
                model: vehicle.model || '',
                year: vehicle.year || 0,
                mileage: vehicle.mileage,
                fuelType: vehicle.fuelType,
                transmissionType: vehicle.transmissionType,
                color: vehicle.color,
              });
            }
          });
          
          setApiVehicles(vehicleMap);
          console.log('[CustomerHome] ✅ Stored', vehicleMap.size, 'vehicles in map');
        }
      } catch (error) {
        console.error('[CustomerHome] ❌ Error fetching vehicles:', error);
      }
    };
    
    fetchVehicles();
  }, []);

  // Socket.IO setup for real-time updates
  useEffect(() => {
    if (!currentUser) return;

    const socket = getSocket();
    if (!socket.connected) {
      connectSocket();
    }

    socketRef.current = socket;

    const userId = String(currentUser.id || (currentUser as any)._id || '');
    const userRole = String(currentUser.role ?? 'customer');

    // Join customer room
    socket.emit('join', {
      userId: String(userId),
      userRole,
    });

    socket.on('connect', () => {
      console.log('[CustomerHome] Socket connected:', socket.id);
      setSocketConnected(true);
      setError(null);
      setLoading(false);
    });

    socket.on('disconnect', (reason) => {
      console.warn('[CustomerHome] Socket disconnected:', reason);
      setSocketConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('[CustomerHome] Connection error:', error);
      setError('Failed to connect to real-time server');
      setLoading(false);
    });

    // Handle initial bids
    socket.on('initial_bids', (incoming: any[]) => {
      console.log('[CustomerHome] Received initial_bids:', incoming?.length || 0);
      if (!Array.isArray(incoming)) return;
      
      // Log first bid structure for debugging
      if (incoming.length > 0) {
        console.log('[CustomerHome] First bid sample:', JSON.stringify(incoming[0], null, 2));
      }
      console.log('live....', incoming);
      const normalized = incoming.map((bid) => {
        const bidId = bid.auctionId || bid.id || bid._id;
        const apiVehicle = apiVehicles.get(bidId);
        
        // Get transmission value from various possible sources
        const transmissionValue = apiVehicle?.transmissionType || 
          bid.vehicle?.transmission || 
          bid.vehicle?.transmissionType || 
          bid.transmissionType || 
          bid.transmission || 
          '';
        
        // Get all vehicle details with proper fallbacks
        const normalizedBid: AuctionItem = {
          _id: bidId,
          title: bid.auctionTitle || bid.title || bid.vehicle?.title || 'Vehicle',
          make: apiVehicle?.make || bid.vehicle?.make || bid.make || '',
          model: apiVehicle?.model || bid.vehicle?.model || bid.model || '',
          year: apiVehicle?.year || bid.vehicle?.year || bid.year || 0,
          vin: bid.vin || bid.vehicle?.vin || '',
          mileage: apiVehicle?.mileage || bid.vehicle?.mileage || bid.mileage || 0,
          horsePower: bid.horsePower || bid.vehicle?.horsePower || 0,
          engineCapacity: bid.engineCapacity || bid.vehicle?.engineCapacity || '',
          engineCylinder: bid.engineCylinder || bid.vehicle?.engineCylinder || '',
          noOfSeats: bid.noOfSeats || bid.vehicle?.noOfSeats || 0,
          warranty: bid.warranty || bid.vehicle?.warranty || false,
          serviceHistory: bid.serviceHistory || bid.vehicle?.serviceHistory || false,
          rimSize: bid.rimSize || bid.vehicle?.rimSize || '',
          fuelType: apiVehicle?.fuelType || bid.vehicle?.fuelType || bid.fuelType || '',
          driveType: bid.driveType || bid.vehicle?.driveType || '',
          roofType: bid.roofType || bid.vehicle?.roofType || '',
          bodyType: bid.bodyType || bid.vehicle?.bodyType || '',
          transmissionType: transmissionValue,
          color: apiVehicle?.color || bid.vehicle?.color || bid.color || '',
          registrationCity: apiVehicle?.registrationCity || bid.vehicle?.registrationCity || bid.registrationCity || '',
          noOfKeys: bid.noOfKeys || bid.vehicle?.noOfKeys || 0,
          location: apiVehicle?.location || bid.vehicle?.location || bid.location || '',
          startingPrice: bid.startingBid || bid.startingPrice || bid.vehicle?.startingPrice || 0,
          minimumBidIncrement: bid.minimumBidIncrement || bid.vehicle?.minimumBidIncrement || 1,
          biddingStartsAt: bid.startTime || bid.biddingStartsAt || bid.vehicle?.biddingStartsAt,
          biddingEndsAt: bid.endTime || bid.biddingEndsAt || bid.vehicle?.biddingEndsAt,
          description: bid.description || bid.vehicle?.description || '',
          photos: bid.photos || bid.vehicle?.photos || (bid.auctionImage ? [bid.auctionImage] : []) || [],
          videos: bid.videos || bid.vehicle?.videos || [],
          features: bid.features || bid.vehicle?.features || {},
          status: bid.status || bid.vehicle?.status || 'live',
          currentBid: bid.currentBid || bid.startingBid || bid.startingPrice || 0,
          createdAt: bid.createdAt || bid.vehicle?.createdAt || new Date().toISOString(),
          updatedAt: bid.updatedAt || bid.vehicle?.updatedAt || new Date().toISOString(),
          sellerId: bid.sellerId || bid.seller?.id || bid.vehicle?.sellerId,
          firstOwner: bid.firstOwner || bid.vehicle?.firstOwner || false,
          sellerNationality: bid.sellerNationality || bid.vehicle?.sellerNationality || '',
        };

        return normalizedBid;
      });

      // Log first normalized item for debugging
      if (normalized.length > 0) {
        console.log('[CustomerHome] First normalized bid:', {
          id: normalized[0]._id,
          title: normalized[0].title,
          make: normalized[0].make,
          model: normalized[0].model,
          year: normalized[0].year,
          transmission: normalized[0].transmissionType,
          location: normalized[0].location,
          registrationCity: normalized[0].registrationCity,
          photos: normalized[0].photos?.length || 0,
          currentBid: normalized[0].currentBid,
          startingPrice: normalized[0].startingPrice,
        });
      }

      // Separate live and upcoming
      const live = normalized.filter(b => b.status === 'live');
      const upcoming = normalized.filter(b => b.status === 'upcoming');
      
      setLiveAuctions(live);
      setUpcomingAuctions(upcoming);
      setItems([...live, ...upcoming]);

      // Set up timers
      const newTimers: Record<string, { endTime?: string; startTime?: string; timeRemaining: string }> = {};
      normalized.forEach(bid => {
        if (bid.biddingEndsAt && bid.status === 'live') {
          newTimers[bid._id] = createTimer(
            typeof bid.biddingEndsAt === 'string' ? bid.biddingEndsAt : bid.biddingEndsAt.toISOString(),
            undefined,
            '00:00'
          );
        }
        if (bid.biddingStartsAt && bid.status === 'upcoming') {
          newTimers[bid._id] = createTimer(
            undefined,
            typeof bid.biddingStartsAt === 'string' ? bid.biddingStartsAt : bid.biddingStartsAt.toISOString(),
            '00:00'
          );
        }
      });
      setTimers(prev => ({ ...prev, ...newTimers }));
    });

    // Handle bid updates
    socket.on('bid_update', (update: any) => {
      if (!update?.auctionId) return;

      console.log('[CustomerHome] bid_update:', {
        id: update.auctionId,
        newBid: update.currentBid || update.data?.auction?.currentBid,
      });

      const data = update.data?.auction || update;
      const apiVehicle = apiVehicles.get(update.auctionId);

      const transmissionValue = apiVehicle?.transmissionType || 
        data.vehicle?.transmission || 
        data.vehicle?.transmissionType || 
        data.transmissionType || 
        data.transmission || 
        '';

      const updated: AuctionItem = {
        _id: update.auctionId,
        title: data.title || update.auctionTitle || data.vehicle?.title || '',
        make: apiVehicle?.make || data.vehicle?.make || data.make || '',
        model: apiVehicle?.model || data.vehicle?.model || data.model || '',
        year: apiVehicle?.year || data.vehicle?.year || data.year || 0,
        vin: data.vin || data.vehicle?.vin || '',
        mileage: apiVehicle?.mileage || data.vehicle?.mileage || data.mileage || 0,
        horsePower: data.horsePower || data.vehicle?.horsePower || 0,
        engineCapacity: data.engineCapacity || data.vehicle?.engineCapacity || '',
        engineCylinder: data.engineCylinder || data.vehicle?.engineCylinder || '',
        noOfSeats: data.noOfSeats || data.vehicle?.noOfSeats || 0,
        warranty: data.warranty || data.vehicle?.warranty || false,
        serviceHistory: data.serviceHistory || data.vehicle?.serviceHistory || false,
        rimSize: data.rimSize || data.vehicle?.rimSize || '',
        fuelType: apiVehicle?.fuelType || data.vehicle?.fuelType || data.fuelType || '',
        driveType: data.driveType || data.vehicle?.driveType || '',
        roofType: data.roofType || data.vehicle?.roofType || '',
        bodyType: data.bodyType || data.vehicle?.bodyType || '',
        transmissionType: transmissionValue,
        color: apiVehicle?.color || data.vehicle?.color || data.color || '',
        registrationCity: apiVehicle?.registrationCity || data.vehicle?.registrationCity || data.registrationCity || '',
        noOfKeys: data.noOfKeys || data.vehicle?.noOfKeys || 0,
        location: apiVehicle?.location || data.vehicle?.location || data.location || '',
        startingPrice: data.startingPrice || update.startingBid || data.vehicle?.startingPrice || 0,
        minimumBidIncrement: data.minimumBidIncrement || data.vehicle?.minimumBidIncrement || 1,
        biddingStartsAt: data.biddingStartsAt || update.startTime || data.vehicle?.biddingStartsAt,
        biddingEndsAt: data.biddingEndsAt || update.endTime || data.endTime || data.vehicle?.biddingEndsAt,
        description: data.description || data.vehicle?.description || '',
        photos: data.photos ?? update.photos ?? data.vehicle?.photos ?? [],
        videos: data.videos ?? update.videos ?? data.vehicle?.videos ?? [],
        features: data.features || data.vehicle?.features || {},
        status: 'live',
        currentBid: update.currentBid ?? data.currentBid ?? 0,
        createdAt: data.createdAt || data.vehicle?.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || data.vehicle?.updatedAt || new Date().toISOString(),
        sellerId: data.sellerId || update.sellerId || data.vehicle?.sellerId,
        firstOwner: data.firstOwner || data.vehicle?.firstOwner || false,
        sellerNationality: data.sellerNationality || data.vehicle?.sellerNationality || '',
      };

      setLiveAuctions(prev => {
        const idx = prev.findIndex(b => b._id === update.auctionId);
        if (idx !== -1) {
          const newList = [...prev];
          newList[idx] = { ...newList[idx], ...updated };
          return newList;
        }
        return [updated, ...prev];
      });

      if (update.endTime) {
        setTimers(prev => ({
          ...prev,
          [update.auctionId]: {
            endTime: update.endTime,
            timeRemaining: update.timeRemaining || '00:00',
          },
        }));
      }
    });

    // Handle auction status changes (upcoming → live)
    socket.on('auction_status_changed', (data: any) => {
      if (data.status === 'live') {
        // Move from upcoming to live
        setUpcomingAuctions(prev => {
          const moved = prev.find(bid => bid._id === data.auctionId);
          if (moved) {
            setLiveAuctions(prevLive => [...prevLive, { ...moved, status: 'live' }]);
            return prev.filter(bid => bid._id !== data.auctionId);
          }
          return prev;
        });
      }
    });

    return () => {
      // Don't disconnect socket on unmount (shared instance)
      // Just remove listeners
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.off('initial_bids');
      socket.off('bid_update');
      socket.off('auction_status_changed');
    };
  }, [currentUser, apiVehicles]);

  // Timer effect for countdowns
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveAuctions((prev) =>
        prev.map((bid) => {
          const endStr = bid.biddingEndsAt 
            ? (typeof bid.biddingEndsAt === 'string' ? bid.biddingEndsAt : bid.biddingEndsAt.toISOString())
            : timers[bid._id]?.endTime;
          
          if (!endStr) return bid;

          const diff = new Date(endStr).getTime() - Date.now();
          if (diff <= 0) {
            return { ...bid, status: 'sold' as const };
          }

          return bid;
        })
      );

      setUpcomingAuctions((prev) =>
        prev.map((bid) => {
          const startStr = bid.biddingStartsAt
            ? (typeof bid.biddingStartsAt === 'string' ? bid.biddingStartsAt : bid.biddingStartsAt.toISOString())
            : timers[bid._id]?.startTime;
          
          if (!startStr) return bid;

          const diff = new Date(startStr).getTime() - Date.now();
          if (diff <= 0) {
            // Auction should start - will be handled by status change event
            return bid;
          }

          return bid;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [timers]);

  const filteredItems = useMemo(() => {
    return liveAuctions;
  }, [liveAuctions]);

  console.log('liveAuctions', liveAuctions.length);
  console.log('upcomingAuctions', upcomingAuctions.length);
  console.log('favoriteIds', favoriteIds);

  // Refresh handler - reconnect socket to get fresh data
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    const socket = socketRef.current;
    if (socket && socket.connected) {
      // Request fresh data from socket
      const userId = String(currentUser?.id || (currentUser as any)?._id || '');
      const userRole = String(currentUser?.role ?? 'customer');
      socket.emit('join', {
        userId: String(userId),
        userRole,
      });
    } else if (socket) {
      // Reconnect if disconnected
      connectSocket();
    }
    setTimeout(() => setRefreshing(false), 1000);
  }, [currentUser]);

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
      {/* <Header title="Customer home" showBackButton={false} /> */}

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

        {/* Live Auctions Section */}
        <View style={styles.liveAuctionsHeader}>
          <View style={styles.liveAuctionsHeaderTop}>
            <View style={styles.liveAuctionsIconBox}>
              <Signal size={24} color={appColors.primary} />
            </View>
            <Text style={styles.liveAuctionsTitle}>Live Vehicle Auctions</Text>
          </View>
          <Text style={styles.liveAuctionsSubtitle}>
            {socketConnected
              ? `${liveAuctions.length} live auctions • real-time`
              : 'Connecting...'}
          </Text>
        </View>

        {loading ? (
          <View style={{ paddingVertical: 20 }}>
            <ActivityIndicator size="large" color={appColors.primary} />
          </View>
        ) : (
          <FlatList
            data={liveAuctions}
            keyExtractor={item => item._id}
            horizontal={true}
            scrollEnabled={true}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={true}
            contentContainerStyle={{
              paddingLeft: width(6),
              paddingRight: width(6),
              paddingBottom: height(2),
            }}
            renderItem={({ item }) => {
              return (
                <LiveAuctionCard
                  item={item}
                  onPress={() => handleOpenItem(item)}
                  onViewBidDetails={(vehicleId) => {
                    handleOpenItem(item);
                  }}
                />
              );
            }}
            ListEmptyComponent={
              <View style={[styles.emptyState, { width: width(100), paddingHorizontal: width(6) }]}>
                <Text style={styles.emptyTitle}>No live auctions right now</Text>
                <Text style={styles.emptySubtitle}>Check back soon for new auctions!</Text>
              </View>
            }
          />
        )}

        {/* Upcoming Auctions Section */}
        {upcomingAuctions.length > 0 && (
          <>
            <View style={[styles.sectionHeaderRow, { marginTop: height(3) }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Clock size={20} color={appColors.textSecondary} />
                <Text style={styles.sectionTitle}>Upcoming Auctions</Text>
              </View>
            </View>

            <FlatList
              data={upcomingAuctions}
              keyExtractor={item => item._id}
              horizontal={false}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
              renderItem={({ item }) => {
                return (
                  <View style={{ marginBottom: height(2), width: '100%', alignItems: 'center' }}>
                    <UpcomingAuctionCard
                      item={item}
                      onPress={() => handleOpenItem(item)}
                    />
                  </View>
                );
              }}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Text style={styles.emptyTitle}>No upcoming auctions</Text>
                </View>
              }
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
