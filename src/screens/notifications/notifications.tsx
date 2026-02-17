import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  FlatList,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Header } from '../../components';
import { styles } from './styles';
import { Notification } from '../../utils/types';
import { useNotifications } from '../../hooks/useNotification';
import { useAppSelector } from '../../redux/hooks';
import { fromateTimeAgo } from '../../utils/methods';

export default function NotificationsScreen() {
  const currentUser = useAppSelector(state => state.profile.user);
  const { notifications, unreadCount, markRead, markAllRead } =
    useNotifications(currentUser?.id?.toString() || '');

  console.log('notifications', notifications);

  const renderItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[styles.card, !item.read ? styles.cardUnread : {}]}
      key={item._id}
      onPress={() => (item.read ? null : markRead(item._id, item.userId || ''))}
      disabled={item.read}
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
