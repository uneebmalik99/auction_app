// src/socket/socketService.ts

import { io, type Socket } from 'socket.io-client';
import { API_BASE_URL } from '../api/autentication'; // your base URL file

// Clean base URL (remove trailing slashes)
const BASE_URL = API_BASE_URL.replace(/\/+$/, '');

let socket: Socket | null = null;

/**
 * Get the SINGLE shared socket instance for the entire app
 */
export function getSocket(): Socket {
  if (!socket) {
    socket = io(BASE_URL, {
      path: '/api/socket', // matches your backend Socket.IO path
      transports: ['websocket'], // best for React Native (reliable + battery-friendly)
      autoConnect: false, // we control when to connect
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    // Connection events (great for debugging)
    socket.on('connect', () => {
      console.log('🔌 Socket connected successfully | ID:', socket?.id);
    });

    socket.on('connect_error', error => {
      console.warn('⚠️ Socket connection error:', error.message);
    });

    socket.on('disconnect', reason => {
      console.log('🔌 Socket disconnected:', reason);
      if (reason === 'io server disconnect') {
        // Server forced disconnect → reconnect manually
        socket?.connect();
      }
    });

    socket.on('reconnect', attempt => {
      console.log('🔄 Socket reconnected after', attempt, 'attempts');
    });

    socket.on('reconnect_attempt', () => {
      console.log('🔄 Attempting to reconnect...');
    });
  }

  return socket;
}

/**
 * Connect the socket (call after login)
 */
export const connectSocket = () => {
  const s = getSocket();
  if (!s.connected) {
    console.log('Connecting socket...');
    s.connect();
  }
};

/**
 * Disconnect socket (call on logout)
 */
export const disconnectSocket = () => {
  if (socket) {
    console.log('Disconnecting socket...');
    socket.disconnect();
    socket = null;
  }
};

/**
 * Check if socket is currently connected
 */
export const isSocketConnected = (): boolean => {
  return socket?.connected ?? false;
};

/* ==================================================================
   ALL REAL-TIME FEATURES USE THIS ONE SOCKET
   ================================================================== */

// === BIDDING ===
export interface BidEntry {
  id?: string;
  amount: number;
  bidderName?: string;
  bidderEmail?: string;
  createdAt?: string;
  [key: string]: any;
}

export interface PlaceBidPayload {
  auctionId: string;
  amount: number;
  bidderId?: string;
  bidderName?: string;
  bidderEmail?: string;
}

export const joinAuctionRoom = (auctionId: string) => {
  getSocket().emit('joinAuction', { auctionId });
};

export const leaveAuctionRoom = (auctionId: string) => {
  getSocket().emit('leaveAuction', { auctionId });
};

export const placeBid = (payload: PlaceBidPayload) => {
  console.log('Placing bid:', payload);
  getSocket().emit('place_bid', payload);
};

export const requestBidDetails = (auctionId: string) => {
  console.log('requesting bid details', auctionId);
  getSocket().emit('get_bid_details', { auctionId, sort: 'desc', limit: 100 });
};

// === NOTIFICATIONS ===
export interface Notification {
  id?: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  type?: string;
  data?: any;
}

export const joinNotificationRoom = (userId: string) => {
  getSocket().emit('join_notifications', { userId });
};

export const leaveNotificationRoom = (userId: string) => {
  getSocket().emit('leave_notifications', { userId });
};

export const requestNotifications = (userId: string) => {
  console.log('request notifications', userId);
  getSocket().emit('get_notifications', { userId });
};

export const markNotificationAsRead = (notificationId: string, userId: string) => {
  console.log('marking notification as read', notificationId, userId);
  getSocket().emit('mark_notification_read', { notificationId, userId });
};

export const markAllNotificationsAsRead = (userId: string) => {
  getSocket().emit('mark_all_notifications_read', { userId });
};

// === FUTURE FEATURES (just add here!) ===
// export const joinChatRoom = (roomId: string) => { ... }
// export const sendMessage = (msg: string) => { ... }
// export const subscribeToOnlineUsers = (callback) => { ... }
