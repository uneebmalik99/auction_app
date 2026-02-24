/**
 * VehicleChatScreen.tsx
 * Main screen — composes all chat sub-components and the useVehicleChat hook.
 *
 * Route params:
 *   vehicleId    : string
 *   vehicleTitle : string
 */

import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ListRenderItemInfo,
} from 'react-native';

import { useVehicleChat, Message } from './useVehicleChat';
import ChatHeader from './ChatHeader';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import { styles } from './styles';

// ── Adjust this to your actual API upload endpoint ──────────────────────────
export default function VehicleChatScreen({ route, navigation }: any) {
  const { vehicleId, vehicleTitle } = route.params as {
    vehicleId: string;
    vehicleTitle: string;
  };

  const {
    messages,
    sending,
    uploading,
    isTyping,
    isPinned,
    isReady,
    userId,
    sendMessage,
    deleteMessage,
    togglePin,
    uploadFile,
  } = useVehicleChat(vehicleId);

  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList<Message>>(null);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSend = useCallback(() => {
    if (!inputText.trim()) return;
    sendMessage(inputText);
    setInputText('');
  }, [inputText, sendMessage]);

  const handleFileSelected = useCallback(
    (file: { uri: string; name: string; type: string; size: number }) => {
      uploadFile(file);
    },
    [uploadFile]
  );

  const scrollToBottom = useCallback(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages.length]);

  // ── Render helpers ────────────────────────────────────────────────────────
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Message>) => {
      const isOwn =
        item.senderId === userId || item.senderRole === 'customer';
      return (
        <MessageBubble
          message={item}
          isOwn={isOwn}
          onDelete={deleteMessage}
        />
      );
    },
    [userId, deleteMessage]
  );

  const keyExtractor = useCallback((item: Message) => item._id, []);

  const ListEmptyComponent = (
    <View style={styles.emptyWrap}>
      <Text style={{ fontSize: 40, opacity: 0.3 }}>💬</Text>
      <Text style={styles.emptyText}>No messages yet</Text>
      <Text style={styles.emptySubText}>Start the conversation</Text>
    </View>
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <ChatHeader
        title={vehicleTitle}
        isReady={isReady}
        isPinned={isPinned}
        onBack={() => navigation.goBack()}
        onTogglePin={togglePin}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* Message list */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={[
            styles.listContent,
            messages.length === 0 && { flex: 1 },
          ]}
          ListEmptyComponent={ListEmptyComponent}
          onContentSizeChange={scrollToBottom}
          onLayout={scrollToBottom}
          removeClippedSubviews
          initialNumToRender={20}
          maxToRenderPerBatch={15}
          windowSize={10}
        />

        {/* Typing indicator */}
        {isTyping && (
          <Text style={styles.typingText}>Admin is typing…</Text>
        )}

        {/* Input bar */}
        <ChatInput
          value={inputText}
          onChange={setInputText}
          onSend={handleSend}
          onFileSelected={handleFileSelected}
          sending={sending}
          uploading={uploading}
          disabled={!isReady}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
