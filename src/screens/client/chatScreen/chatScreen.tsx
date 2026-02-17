import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import { useChatSocket } from '../../../socket/chatSocketService'; 
import { fetchCurrentUser } from '../../../api/autentication';
import { User } from '../../../utils/types';
import { useAppSelector } from '../../../redux/hooks';

interface Message {
  _id: string;
  senderId: string;
  senderName: string;
  senderRole: "admin" | "customer";
  message: string;
  timestamp: string;
  read: boolean;
}

export default  function VehicleChatScreen({ route, navigation }: any) {
  const { vehicleId, vehicleTitle } = route.params;
  const { socket, isConnected } =  useChatSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const user = useAppSelector(state => state.profile.user);
  const flatListRef = useRef<FlatList>(null);
//   const user: User = await fetchCurrentUser();
  const hasJoinedRef = useRef(false);
  const hasRegisteredRef = useRef(false);

  // Registration & Room Management (Same logic as web)
  useEffect(() => {
    if (!socket || !isConnected || !user) {
      hasJoinedRef.current = false;
      hasRegisteredRef.current = false;
      return;
    }

    const userId = user.id || user.id ;
    if (!userId) return;

    if (!hasRegisteredRef.current) {
      socket.emit("user_register", {
        userId,
        userName: user.name,
        userEmail: user.email,
        userRole: user.role,
      });
      hasRegisteredRef.current = true;
    }

    const joinTimeout = setTimeout(() => {
      if (!hasJoinedRef.current) {
        socket.emit("join_vehicle_chat", vehicleId);
        socket.emit("request_chat_history", vehicleId);
        hasJoinedRef.current = true;
      }
    }, 100);

    return () => {
      clearTimeout(joinTimeout);
      if (hasJoinedRef.current) {
        socket.emit("leave_vehicle_chat", vehicleId);
        hasJoinedRef.current = false;
      }
    };
  }, [socket, isConnected, vehicleId, user]);

  // Socket Event Listeners
  useEffect(() => {
    if (!socket) return;

    const handleChatHistory = (history: Message[]) => setMessages(history);
    const handleNewMessage = (message: Message) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === message._id)) return prev;
        return [...prev, message];
      });
    };
    const handleUserTyping = (data: any) => {
      const userId = user?.id || user?.id;
      if (data.userId !== userId) setIsTyping(data.isTyping);
    };

    socket.on("chat_history", handleChatHistory);
    socket.on("new_message", handleNewMessage);
    socket.on("user_typing", handleUserTyping);

    return () => {
      socket.off("chat_history", handleChatHistory);
      socket.off("new_message", handleNewMessage);
      socket.off("user_typing", handleUserTyping);
    };
  }, [socket, user]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !socket || sending || !isConnected) return;

    const messageText = newMessage.trim();
    setNewMessage("");
    setSending(true);

    socket.emit("send_message", { vehicleId, message: messageText });
    
    // Reset sending state after a short delay (or via server ack)
    setTimeout(() => setSending(false), 500);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isOwnMessage = item.senderRole === "customer";
    return (
      <View style={[styles.messageRow, isOwnMessage ? styles.rowReverse : styles.rowDirect]}>
        <View style={[styles.bubble, isOwnMessage ? styles.ownBubble : styles.adminBubble]}>
          <Text style={[styles.messageText, isOwnMessage ? styles.whiteText : styles.slateText]}>
            {item.message}
          </Text>
          <Text style={styles.timeText}>
            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle} numberOfLines={1}>{vehicleTitle}</Text>
        <View style={styles.statusRow}>
          <View style={[styles.statusDot, { backgroundColor: isConnected ? '#4ade80' : '#94a3b8' }]} />
          <Text style={styles.statusText}>{isConnected ? "Connected" : "Connecting..."}</Text>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={renderMessage}
        contentContainerStyle={styles.listPadding}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {isTyping && <Text style={styles.typingText}>Admin is typing...</Text>}

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type your message..."
            placeholderTextColor="#64748b"
            multiline
          />
          <TouchableOpacity 
            onPress={handleSendMessage}
            disabled={!newMessage.trim() || !isConnected || sending}
            style={[styles.sendButton, (!newMessage.trim() || !isConnected) && styles.disabledButton]}
          >
            {sending ? <ActivityIndicator color="#fff" /> : <Text style={styles.sendButtonText}>Send</Text>}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  headerTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  statusText: { color: '#94a3b8', fontSize: 12 },
  listPadding: { padding: 15 },
  messageRow: { flexDirection: 'row', marginBottom: 12 },
  rowReverse: { justifyContent: 'flex-end' },
  rowDirect: { justifyContent: 'flex-start' },
  bubble: { maxWidth: '80%', padding: 12, borderRadius: 15 },
  ownBubble: { backgroundColor: '#2563eb', borderBottomRightRadius: 2 },
  adminBubble: { backgroundColor: '#1e293b', borderBottomLeftRadius: 2 },
  messageText: { fontSize: 14, lineHeight: 20 },
  whiteText: { color: '#fff' },
  slateText: { color: '#f1f5f9' },
  timeText: { fontSize: 10, color: '#64748b', marginTop: 4, alignSelf: 'flex-end' },
  typingText: { paddingLeft: 15, fontSize: 12, color: '#64748b', fontStyle: 'italic', marginBottom: 5 },
  inputContainer: { 
    flexDirection: 'row', 
    padding: 10, 
    backgroundColor: '#0f172a', 
    borderTopWidth: 1, 
    borderTopColor: '#1e293b',
    alignItems: 'center'
  },
  input: { 
    flex: 1, 
    backgroundColor: '#1e293b', 
    borderRadius: 20, 
    paddingHorizontal: 15, 
    paddingVertical: 8, 
    color: '#fff',
    maxHeight: 100
  },
  sendButton: { marginLeft: 10, backgroundColor: '#ef4444', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 20 },
  disabledButton: { opacity: 0.5 },
  sendButtonText: { color: '#fff', fontWeight: 'bold' }
});