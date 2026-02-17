// src/hooks/useAuctionBids.ts
import { useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import {
  joinAuctionRoom,
  leaveAuctionRoom,
  placeBid,
  requestBidDetails,
  getSocket,
} from '../socket/socketService';
import { useAppSelector } from '../redux/hooks';
import { useIsFocused } from '@react-navigation/native';

export interface BidEntry {
  _id?: string;
  id?: string;
  amount: number;
  bidderName?: string;
  createdAt?: string;
  [key: string]: any;
}

interface UseAuctionBidsOptions {
  auctionId: string | null;
  initialBid?: number;
}

export function useAuctionBids({
  auctionId,
  initialBid,
}: UseAuctionBidsOptions) {
  const user = useAppSelector(state => state.profile.user);
  const isFocused = useIsFocused();
const [isBidSuccess, setIsBidSuccess] = useState(false);
  const [currentBid, setCurrentBid] = useState<number | undefined>(initialBid);
  const [bids, setBids] = useState<BidEntry[]>([]);
  const socketRef = useRef(getSocket());

  useEffect(() => {
    if (!auctionId || !isFocused) {
      setBids([]);
      setCurrentBid(initialBid);
      return;
    }

    if (!socketRef.current?.connected) {
      console.log('Socket not connected → connecting now');
      socketRef.current?.connect();
    }

    console.log('useAuctionBids', auctionId, isFocused);
    console.log('user', user);
    console.log('socketRef', socketRef.current);

    // Join room and request initial data

    console.log('joining auction room', auctionId);

    joinAuctionRoom(auctionId);

    console.log('requesting bid details', auctionId);
    requestBidDetails(auctionId);

    const socket = socketRef.current;

    const handleBidDetails = (payload: BidEntry[]) => {
      console.log('Received bid_details_response:', payload);

      const newBids = payload?.data?.bids || payload?.bids || [];
      if (Array.isArray(newBids) && newBids.length > 0) {
        setBids(newBids);

        // Update currentBid from highest bid
        const highestBid = newBids[0].amount;
        if (highestBid > (currentBid ?? 0)) {
          setCurrentBid(highestBid);
        }
      }
    };

    const handleBidUpdate = (payload: any) => {
      console.log('Bid update received:', payload);

      let newBids: BidEntry[] = [];

      if (Array.isArray(payload)) {
        newBids = payload;
      } else if (payload?.data?.bids) {
        newBids = payload.data.bids;
      } else if (payload?.amount) {
        newBids = [payload];
      }

      if (newBids.length > 0) {
        setBids(prev => {
          const existing = new Set(prev.map(b => b._id || b.id));
          const filtered = newBids.filter(b => !existing.has(b._id || b.id));
          return [...filtered, ...prev]; // newest first
        });

        const highest = Math.max(...newBids.map(b => b.amount));
        setCurrentBid(prev => Math.max(prev || 0, highest));
      }
    };

    socket.on('bid_details_response', handleBidDetails);

    socket.on('bid_update', handleBidUpdate);

    return () => {
      socket.off('bid_update', handleBidUpdate);

      socket.off('bid_details_response', handleBidDetails);
      leaveAuctionRoom(auctionId);
    };
  }, [auctionId, isFocused, initialBid]);

  const submitBid = (auctionId: string, newBidAmount: number) => {
    if (!auctionId || !user || !socketRef.current?.connected) {
      Alert.alert('Error', 'Not connected. Please try again.');
      return;
    }

    if (newBidAmount <= (currentBid ?? 0)) {
      Alert.alert('Invalid Bid', 'Bid must be higher than current bid');
      return;
    }

    console.log('submitting bid', newBidAmount);
    console.log('auctionId', auctionId);
    console.log('user', user);
    console.log('socketRef', socketRef.current);
    console.log('payload', {
      auctionId: auctionId ?? '',
      amount: newBidAmount,
      bidderId: user?.id?.toString() || '',
      bidderName: user.name || '',
      bidderEmail: user.email || '',
    });

    placeBid({
      auctionId: auctionId ?? '',
      amount: newBidAmount,
      bidderId: user?.id?.toString() || '',
      bidderName: user.name || '',
      bidderEmail: user.email || '',
    });
  };

  return {
    currentBid,
    bids,
    placeBid: submitBid,
    isConnected: socketRef.current?.connected,
  };
}

// import { useEffect, useRef, useState } from 'react';
// import { Alert } from 'react-native';
// import { getBiddingSocket, type BidEntry } from '../socket/biddingSocket';
// import type { Socket } from 'socket.io-client';
// import { useAppSelector } from '../redux/hooks';
// import { useIsFocused } from '@react-navigation/native';

// interface UseAuctionBidsOptions {
//   auctionId: string | null;
//   initialBid?: number;
// }

// export function useAuctionBids({
//   auctionId,
//   initialBid,
// }: UseAuctionBidsOptions) {
//   const user = useAppSelector(state => state.profile.user);
//   const isFocused = useIsFocused();

//   const [currentBid, setCurrentBid] = useState<number | undefined>(initialBid);
//   const [bids, setBids] = useState<BidEntry[]>([]);
//   const socketRef = useRef<Socket | null>(null);

//   useEffect(() => {
//     if (!auctionId || !isFocused) {
//       return;
//     }

//     // Get or reuse socket
//     const socket = getBiddingSocket();
//     socketRef.current = socket;

//     // Ensure socket is connected (auto-connect if not)
//     if (!socket.connected) {
//       socket.connect();
//     }

//     // Function to fetch initial bid details
//     const fetchBidDetails = () => {
//       console.log('Fetching bid details for auction:', auctionId);
//       socket.emit('get_bid_details', {
//         auctionId,
//         sort: 'desc',
//         limit: 100,
//       });
//     };

//     // Handlers
//     const handleBidDetails = (payload: any) => {
//       console.log('Received bid_details_response:', payload);

//       const newBids = payload?.data?.bids || payload?.bids || [];
//       if (Array.isArray(newBids) && newBids.length > 0) {
//         setBids(newBids);

//         // Update currentBid from highest bid
//         const highestBid = newBids[0].amount;
//         if (highestBid > (currentBid ?? 0)) {
//           setCurrentBid(highestBid);
//         }
//       }
//     };

//     const handleBidUpdate = (payload: any) => {
//       console.log('Received bid_update:', payload);

//       // if (payload?.auctionId !== auctionId) return;

//       // Handle both single bid object or array
//       const incomingBids = Array.isArray(payload)
//         ? payload
//         : payload?.bids || (payload ? [payload] : []);

//       if (incomingBids.length === 0) return;

//       setBids(prev => {
//         const existingIds = new Set(prev.map(b => b._id || b.id));
//         const filteredNew = incomingBids.filter(
//           (b: BidEntry) => !existingIds.has(b._id || b.id),
//         );

//         if (filteredNew.length === 0) return prev;

//         return [...filteredNew, ...prev]; // newest first
//       });

//       // Update currentBid
//       const highestNew = Math.max(
//         ...incomingBids.map((b: any) => b.amount || 0),
//       );
//       setCurrentBid(prev => Math.max(prev || 0, highestNew));
//     };

//     // const handleBidUpdate = (payload: any) => {
//     //   console.log('Received bid_update:', payload);

//     //   if (payload?.auctionId !== auctionId) return;

//     //   // Handle both single bid object or array of bids
//     //   let incomingBids: BidEntry[] = [];

//     //   if (Array.isArray(payload)) {
//     //     incomingBids = payload;
//     //   } else if (payload && typeof payload === 'object') {
//     //     // If server sends a single bid object
//     //     incomingBids = [payload];
//     //   }

//     //   if (incomingBids.length === 0) return;

//     //   // Simple append (or prepend) — your preferred style
//     //   setBids(prev => [...incomingBids, ...prev]); // newest first

//     //   // Optional: Update currentBid from the new highest
//     //   const highestNew = Math.max(...incomingBids.map(b => b.amount || 0));
//     //   setCurrentBid(prev => {
//     //     const newMax = Math.max(prev || 0, highestNew);
//     //     return newMax > (prev || 0) ? newMax : prev;
//     //   });
//     // };

//     // Attach listeners
//     socket.on('bid_details_response', handleBidDetails);
//     socket.on('bid_update', handleBidUpdate);

//     // Also listen to common alternative events
//     // socket.on('new_bid', handleBidUpdate);
//     // socket.on('bid_placed', handleBidUpdate);

//     // Fetch initial data when connected
//     const handleConnect = () => {
//       console.log('Socket connected, fetching bid details');
//       fetchBidDetails();
//     };

//     socket.on('connect', handleConnect);

//     // If already connected, fetch immediately
//     if (socket.connected) {
//       fetchBidDetails();
//     }

//     // Cleanup
//     return () => {
//       socket.off('bid_details_response', handleBidDetails);
//       socket.off('bid_update', handleBidUpdate);
//       socket.off('new_bid', handleBidUpdate);
//       socket.off('bid_placed', handleBidUpdate);
//       socket.off('connect', handleConnect);

//       // Optional: Don't disconnect socket globally — it's shared
//       // socket.disconnect(); // ← Avoid this if socket is shared across app
//     };
//   }, [auctionId, isFocused]); // Removed 'bids' from deps!

//   const placeBid = (auctionId: string, amount: number) => {
//     if (!auctionId || !user || !socketRef.current) {
//       Alert.alert('Error', 'Not connected');
//       return;
//     }

//     const bidAmount = Number(amount);
//     const minAllowed =
//       (currentBid ?? initialBid ?? 0) + /* minimum increment from item */ 0;

//     if (isNaN(bidAmount) || bidAmount <= (currentBid ?? 0)) {
//       Alert.alert(
//         'Invalid Bid',
//         `Bid must be higher than current: $${(
//           currentBid ?? 0
//         ).toLocaleString()}`,
//       );
//       return;
//     }

//     const payload = {
//       auctionId,
//       bidderId: (user as any)?.userId || user.id || '',
//       bidderName: user.name || '',
//       bidderEmail: user.email || '',
//       amount: bidAmount,
//     };

//     const socket = socketRef.current;

//     if (socket.connected) {
//       socket.emit('place_bid', payload);
//     } else {
//       // Auto-reconnect and retry
//       socket.once('connect', () => {
//         console.log('Reconnected, placing bid');
//         socket.emit('place_bid', payload);
//       });
//       socket.connect();
//     }
//   };

//   return {
//     currentBid,
//     bids,
//     placeBid,
//   };
// }

// import { useEffect, useRef, useState } from 'react';
// import { Alert } from 'react-native';
// import { getBiddingSocket, type BidEntry } from '../socket/biddingSocket';
// import type { Socket } from 'socket.io-client';
// import { useAppSelector } from '../redux/hooks';
// import { useIsFocused } from '@react-navigation/native';

// interface UseAuctionBidsOptions {
//   auctionId: string | null;
//   initialBid?: number;
// }

// export function useAuctionBids({
//   auctionId,
//   initialBid,
// }: UseAuctionBidsOptions) {
//   const user = useAppSelector(state => state.profile.user);
//   const isFocused = useIsFocused();
//   const [currentBid, setCurrentBid] = useState<number | undefined>(initialBid);
//   const [bids, setBids] = useState<BidEntry[]>([]);
//   const socketRef = useRef<Socket | null>(null);

//   useEffect(() => {
//     if (!auctionId || !isFocused) {
//       return undefined;
//     }

//     const socket = socketRef.current ?? getBiddingSocket();
//     socketRef.current = socket;

//     // console.log('Inittializing bids for auction', socket);

//     // Join this auction room
//     if (socket.connected) {
//       // console.log('Socket Connected');

//       // console.log('Auction ID', auctionId);

//       socket.emit('get_bid_details', {
//         auctionId: auctionId,
//         sort: 'desc',
//         limit: 100,
//       });

//       // console.log('Emitted get_bid_details');

//       socket.on('bid_details_response', (payload: any) => {
//         // console.log('bid_details_response', payload?.data?.bids);

//         // if (payload?.auctionId !== auctionId) {
//         //   return;
//         // }

//         // console.log('initial bids', payload);

//         if (Array.isArray(payload?.data?.bids)) {
//           setBids(payload?.data?.bids);
//         }
//       });

//       socket.on('bid_update', (payload: any) => {
//         // if (payload?.auctionId !== auctionId) {
//         //   return;
//         // }
//         if (Array.isArray(payload)) {
//           setBids(prev => [...prev, ...payload]);
//         }
//       });
//     } else {
//       console.log('Socket not connected, waiting for connection');
//       socket.once('connect', () => {
//         console.log('Socket connected, getting initial bids');
//         socket.emit('get_bidder_count', { auctionId });
//       });
//     }

//     return () => {
//       socket.off('initial_bids', (payload: any) => {
//         if (payload?.auctionId !== auctionId) {
//           return;
//         }
//         if (Array.isArray(payload.bids)) {
//           setBids(payload.bids as BidEntry[]);
//         }
//       });
//     };
//   }, [auctionId, bids, isFocused]);

//   const placeBid = (auctionId: string, amount: number) => {
//     if (!auctionId || !user) {
//       return;
//     }

//     const bidAmount = typeof amount === 'number' ? amount : Number(amount);
//     const minAllowed = currentBid ?? 0;

//     if (!bidAmount || Number.isNaN(bidAmount)) {
//       Alert.alert(
//         'Invalid bid',
//         `Bid must be higher than current bid ($${minAllowed.toLocaleString(
//           'en-US',
//         )}).`,
//       );
//       return;
//     }

//     const socket = socketRef.current ?? getBiddingSocket();

//     console.log('Socket connected', socket);

//     // Log similar to web implementation
//     // eslint-disable-next-line no-console
//     console.log('Placing bid via socketRef:', {
//       auctionId: auctionId ?? '',
//       bidderId: (user as any)?.userId || user.id || '',
//       bidderName: user.name || '',
//       bidderEmail: user.email || '',
//       amount: bidAmount || 0,
//     });

//     const payload = {
//       auctionId: auctionId ?? '',
//       bidderId: (user as any)?.userId || user.id || '',
//       bidderName: user.name || '',
//       bidderEmail: user.email || '',
//       amount: bidAmount || 0,
//     };

//     if (!socket.connected) {
//       console.log('Socket not connected yet, queueing place_bid');
//       socket.once('connect', () => {
//         console.log('Flushing queued place_bid');
//         socket.emit('place_bid', payload);
//       });
//       return;
//     }

//     socket.emit('place_bid', payload);
//   };

//   return { currentBid, bids, placeBid };
// }
