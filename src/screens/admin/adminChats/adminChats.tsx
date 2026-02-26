import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MessageCircle, User } from 'lucide-react-native';
import { appColors } from '../../../utils/appColors';
import { height, width } from '../../../utils/dimensions';
import screenNames from '../../../routes/routes';
import type { RootNavigationProp } from '../../../utils/types';
import { API_BASE_URL } from '../../../api/autentication';
import { getItem } from '../../../utils/methods';

interface ChatItem {
  _id: string;
  vehicleId: string;
  vehicleTitle: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  participantName?: string;
  participantEmail?: string;
}

export default function AdminChats() {
  const navigation = useNavigation<RootNavigationProp>();
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      setLoading(true);
      const token = await getItem<string>('auth_token');
      
      // Fetch all vehicles that have chats
      const response = await fetch(`${API_BASE_URL}api/vehicles?limit=1000`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      
      const data = await response.json();
      
      if (data.vehicles) {
        // Convert vehicles to chat items
        // In a real app, you'd fetch actual chat conversations
        const chatItems: ChatItem[] = data.vehicles
          .filter((v: any) => v.status === 'sold' || v.status === 'live')
          .map((vehicle: any) => ({
            _id: vehicle._id,
            vehicleId: vehicle._id,
            vehicleTitle: vehicle.title || `${vehicle.make} ${vehicle.model}`,
            lastMessage: 'Click to view messages',
            lastMessageTime: new Date(vehicle.updatedAt || vehicle.createdAt).toLocaleDateString(),
            unreadCount: 0,
            participantName: 'Client',
            participantEmail: '',
          }));
        
        setChats(chatItems);
      }
    } catch (error) {
      console.error('Failed to load chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChatPress = (chat: ChatItem) => {
    navigation.navigate(screenNames.chatScreen, {
      vehicleId: chat.vehicleId,
      vehicleTitle: chat.vehicleTitle,
    });
  };

  const renderChatItem = ({ item }: { item: ChatItem }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => handleChatPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.chatIconContainer}>
        <MessageCircle size={24} color={appColors.primary} />
      </View>
      
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatTitle} numberOfLines={1}>
            {item.vehicleTitle}
          </Text>
          {item.lastMessageTime && (
            <Text style={styles.chatTime}>{item.lastMessageTime}</Text>
          )}
        </View>
        
        <View style={styles.chatFooter}>
          <Text style={styles.chatMessage} numberOfLines={1}>
            {item.lastMessage || 'No messages yet'}
          </Text>
           <View style={[styles.unreadBadge, { display: item?.unreadCount && item?.unreadCount !== 0 ? 'flex' : 'none' }]}>
              <Text style={styles.unreadText}>{item.unreadCount}</Text>
            </View>
          {/* {item?.unreadCount && item?.unreadCount !== 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unreadCount}</Text>
            </View>
          )} */}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chats</Text>
        <Text style={styles.headerSubtitle}>
          {chats.length} conversation{chats.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={appColors.primary} />
        </View>
      ) : chats.length > 0 ? (
        <FlatList
          data={chats}
          keyExtractor={item => item._id}
          renderItem={renderChatItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <MessageCircle size={64} color={appColors.textMuted} />
          <Text style={styles.emptyTitle}>No Chats Yet</Text>
          <Text style={styles.emptySubtitle}>
            Vehicle conversations will appear here
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: appColors.background,
  },
  header: {
    paddingHorizontal: width(4),
    paddingVertical: height(2),
    borderBottomWidth: 1,
    borderBottomColor: appColors.inputBorder,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: appColors.textPrimary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: appColors.textMuted,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: width(4),
  },
  chatItem: {
    flexDirection: 'row',
    backgroundColor: appColors.surface,
    borderRadius: 12,
    padding: width(3),
    marginBottom: width(2),
    alignItems: 'center',
  },
  chatIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: appColors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: width(3),
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: appColors.textPrimary,
    flex: 1,
  },
  chatTime: {
    fontSize: 12,
    color: appColors.textMuted,
    marginLeft: width(2),
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatMessage: {
    fontSize: 14,
    color: appColors.textMuted,
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: appColors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginLeft: width(2),
  },
  unreadText: {
    color: appColors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width(6),
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: appColors.textSecondary,
    marginTop: height(2),
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: appColors.textMuted,
    textAlign: 'center',
  },
});
