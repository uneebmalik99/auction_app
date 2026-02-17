// src/hooks/useNotifications.ts
import { useEffect, useState } from 'react';
import {
  joinNotificationRoom,
  leaveNotificationRoom,
  requestNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getSocket,
} from '../socket/socketService';

export interface Notification {
  _id?: string;
  id?: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  type?: string;
}

export function useNotifications(userId: string | null | undefined) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!userId) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    const socket = getSocket();
    if (!socket.connected) {
      console.log('Socket not connected → connecting now');
      socket.connect();
    }

    console.log('joining notification room', userId);

    // joinNotificationRoom(userId);

    console.log('requesting notifications', userId);

    requestNotifications(userId);

    const handleNotificationsResponse = (notifications: any) => {
      console.log('notifications response', notifications?.data?.notifications);
      setNotifications(notifications?.data?.notifications || []);
      setUnreadCount(notifications?.data?.unreadCount);
    };

    const handleNewNotification = (notification: Notification) => {
      console.log('new notification', notification);

      setNotifications(prev => {
        const exists = prev.some(
          n => n._id === notification._id || n.id === notification.id,
        );
        if (exists) return prev;
        return [notification, ...prev];
      });

      if (!notification.read) {
        setUnreadCount(c => c + 1);
      }
    };

    socket.on('notifications_response', handleNotificationsResponse);

    socket.on('new_notification', handleNewNotification);

    return () => {
      socket.off('new_notification', handleNotificationsResponse);
      socket.off('notifications_response', handleNewNotification);
      leaveNotificationRoom(userId);
    };
  }, [userId]);

  const markRead = (id: string, userId: string) => {
    console.log('marking notification as read', id, userId);
    markNotificationAsRead(id, userId);
    setNotifications(prev =>
      prev.map(n => (n._id === id || n.id === id ? { ...n, read: true } : n)),
    );
    setUnreadCount(c => Math.max(0, c - 1));
  };

  const markAllRead = () => {
    console.log('marking all notifications as read', userId);

    markAllNotificationsAsRead(userId!);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return {
    notifications,
    unreadCount,
    markRead,
    markAllRead,
  };
}
