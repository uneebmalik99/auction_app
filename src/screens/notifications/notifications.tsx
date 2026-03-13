import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  FlatList,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Header } from '../../components';
import { styles } from './styles';
import { Notification, RootNavigationProp } from '../../utils/types';
import { useNotifications } from '../../hooks/useNotification';
import { useAppSelector } from '../../redux/hooks';
import { fromateTimeAgo } from '../../utils/methods';
import screenNames from '../../routes/routes';

export default function NotificationsScreen() {
  const navigation = useNavigation<RootNavigationProp>();
  const currentUser = useAppSelector(state => state.profile.user);
  const { notifications, unreadCount, markRead, markAllRead } =
    useNotifications(currentUser?.id?.toString() || '');

  console.log('notifications', notifications);

  const handleNotificationPress = (item: Notification) => {
    // Log notification data for debugging
    console.log('Notification clicked:', {
      id: item._id,
      message: item.message,
      type: item.type,
      data: item.data,
    });

    // Mark as read if unread
    if (!item.read) {
      markRead(item._id, item.userId || '');
    }

    // Check if notification has vehicle/auction data
    // Try multiple possible field names for the auction/vehicle ID
    const auctionId = item.data?.auctionId || 
                      item.data?.vehicleId || 
                      item.data?.itemId ||
                      item.data?.id ||
                      item.data?._id ||
                      (item.data as any)?.auction?._id ||
                      (item.data as any)?.auction?.id ||
                      (item.data as any)?.vehicle?._id ||
                      (item.data as any)?.vehicle?.id;
    
    console.log('Extracted auctionId:', auctionId);

    // Check if it's a notification about winning a car/auction or any auction-related notification
    const isAuctionNotification = item.message?.toLowerCase().includes('won') || 
                                  item.message?.toLowerCase().includes('bid') ||
                                  item.message?.toLowerCase().includes('auction') ||
                                  item.type === 'auction_end' ||
                                  item.type === 'bid' ||
                                  item.data?.type === 'won' ||
                                  item.data?.type === 'auction';

    console.log('Is auction notification:', isAuctionNotification);

    // If we have an auction ID and it's auction-related, navigate to item details
    if (auctionId && isAuctionNotification) {
      // Get item data if available in notification
      const itemData = item.data?.item || 
                       item.data?.vehicle || 
                       (item.data as any)?.auction ||
                       (item.data as any)?.vehicle;

      console.log('Navigating to itemDetails with:', {
        auctionId: String(auctionId),
        hasItemData: !!itemData,
      });

      // Navigate to item details screen
      // The screen will fetch the item if not provided
      navigation.navigate(screenNames.itemDetails, {
        myBids: false,
        auctionId: String(auctionId),
        item: itemData || undefined,
      });
    } else {
      console.log('Cannot navigate: missing auctionId or not auction-related notification');
    }
  };

  const renderItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[styles.card, !item.read ? styles.cardUnread : {}]}
      key={item._id}
      onPress={() => handleNotificationPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeaderRow}>
        <Text style={styles.title}>{item.message}</Text>
        <Text style={styles.time}>{fromateTimeAgo(item?.createdAt)}</Text>
      </View>
      <Text style={styles.body}>{item.message}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header titleKey="notifications.title" />

      {unreadCount > 0 && (
        <TouchableOpacity
          style={styles.markAllReadTouchable}
          onPress={() => (unreadCount > 0 ? markAllRead() : null)}
        >
          <Text style={styles.markAllReadText}>Mark all as read</Text>
        </TouchableOpacity>
      )}
      <FlatList
        data={notifications}
        keyExtractor={item => item._id || ''}
        contentContainerStyle={styles.listContent}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No notifications found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
