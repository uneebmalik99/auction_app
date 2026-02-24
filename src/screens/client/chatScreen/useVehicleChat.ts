/**
 * useVehicleChat.ts
 * Encapsulates all socket registration, room joining, and message
 * state management for the vehicle chat screen.
 */

import { useState, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { getAuthToken } from '../../../socket/chatSocketService'; // adjust path as needed
import { useAppSelector } from '../../../redux/hooks';
import { useChatSocket } from '../../../socket/chatSocketService';
import { API_BASE_URL } from '../../../api/autentication';

export interface Message {
  _id: string;
  senderId: string;
  senderName: string;
  senderRole: 'admin' | 'customer' | 'broker';
  message: string;
  timestamp: string;
  read: boolean;
  fileUrl?: string;
  fileType?: 'image' | 'video' | 'document';
  fileName?: string;
  fileSize?: number;
  deleted?: boolean;
}

export function useVehicleChat(vehicleId: string) {
  const { socket, isConnected } = useChatSocket();
  const user = useAppSelector((state) => state.profile.user);

  const [messages, setMessages] = useState<Message[]>([]);
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);

  const hasJoinedRef = useRef(false);
  const hasRegisteredRef = useRef(false);

  const userId = user?.id || user?.id;

  // ── Registration & Room Join ────────────────────────────────────────────
  useEffect(() => {
    if (!socket || !isConnected || !user || !userId) {
      hasJoinedRef.current = false;
      hasRegisteredRef.current = false;
      setRegistrationComplete(false);
      return;
    }

    const onRegSuccess = () => {
      setRegistrationComplete(true);
      hasRegisteredRef.current = true;
    };
    const onRegError = () => Alert.alert('Error', 'Chat connection failed. Please refresh.');

    socket.on('registration_success', onRegSuccess);
    socket.on('registration_error', onRegError);

    if (!hasRegisteredRef.current) {
      socket.emit('user_register', {
        userId,
        userName: user.name,
        userEmail: user.email,
        userRole: user.role,
      });
      hasRegisteredRef.current = true;
    }

    return () => {
      socket.off('registration_success', onRegSuccess);
      socket.off('registration_error', onRegError);
    };
  }, [socket, isConnected, user, userId]);

  // Join room after registration
  useEffect(() => {
    if (!socket || !isConnected || !registrationComplete) return;

    const timer = setTimeout(() => {
      if (!hasJoinedRef.current) {
        socket.emit('join_vehicle_chat', { vehicleId });
        socket.emit('request_chat_history', vehicleId);
        hasJoinedRef.current = true;
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      if (hasJoinedRef.current) {
        socket.emit('leave_vehicle_chat', vehicleId);
        hasJoinedRef.current = false;
      }
    };
  }, [socket, isConnected, registrationComplete, vehicleId]);

  // ── Pin Status ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.emit('get_chat_pin_status', { vehicleId });

    const handlePinStatus = (data: { vehicleId: string; isPinned: boolean }) => {
      if (data.vehicleId === vehicleId) setIsPinned(data.isPinned);
    };

    socket.on('chat_pin_status', handlePinStatus);
    return () => { socket.off('chat_pin_status', handlePinStatus); };
  }, [socket, isConnected, vehicleId]);

  // ── Socket Event Listeners ──────────────────────────────────────────────
  useEffect(() => {
    if (!socket) return;

    const handleChatHistory = (payload: unknown) => {
      let history: Message[] = [];
      if (Array.isArray(payload)) history = payload;
      else if (payload && typeof payload === 'object' && Array.isArray((payload as any).messages)) {
        history = (payload as any).messages;
      }
      setMessages(history.filter((m): m is Message => !!m?._id && typeof m.message === 'string'));
    };

    const handleNewMessage = (msg: unknown) => {
      if (!msg || typeof msg !== 'object' || !('_id' in msg)) return;
      setMessages((prev) => {
        if (!Array.isArray(prev)) return [msg as Message];
        if (prev.some((m) => m._id === (msg as Message)._id)) return prev;
        return [...prev, msg as Message];
      });
    };

    const handleMessagesRead = (data: { vehicleId: string }) => {
      if (data.vehicleId !== vehicleId) return;
      setMessages((prev) =>
        prev.map((m) => (!m.read && m.senderRole === 'customer' ? { ...m, read: true } : m))
      );
    };

    const handleMessageDeleted = (data: { vehicleId: string; messageId: string }) => {
      if (data.vehicleId !== vehicleId) return;
      setMessages((prev) =>
        prev.map((m) =>
          m._id === data.messageId
            ? { ...m, message: '🚫 This message was deleted', deleted: true }
            : m
        )
      );
    };

    const handlePinToggle = (data: { vehicleId: string; isPinned: boolean }) => {
      if (data.vehicleId === vehicleId) setIsPinned(data.isPinned);
    };

    const handleUserTyping = (data: { userId: string; isTyping: boolean }) => {
      if (data.userId !== userId) setIsTyping(data.isTyping);
    };

    socket.on('chat_history', handleChatHistory);
    socket.on('new_message', handleNewMessage);
    socket.on('messages_read', handleMessagesRead);
    socket.on('message_deleted', handleMessageDeleted);
    socket.on('chat_pinned', handlePinToggle);
    socket.on('chat_unpinned', handlePinToggle);
    socket.on('user_typing', handleUserTyping);

    return () => {
      socket.off('chat_history', handleChatHistory);
      socket.off('new_message', handleNewMessage);
      socket.off('messages_read', handleMessagesRead);
      socket.off('message_deleted', handleMessageDeleted);
      socket.off('chat_pinned', handlePinToggle);
      socket.off('chat_unpinned', handlePinToggle);
      socket.off('user_typing', handleUserTyping);
    };
  }, [socket, vehicleId, userId]);

  // ── Actions ─────────────────────────────────────────────────────────────
  const sendMessage = (text: string) => {
    if (!socket || !isConnected || !registrationComplete || !text.trim() || sending) return;
    setSending(true);
    socket.emit('send_message', { vehicleId, message: text.trim() });
    setTimeout(() => setSending(false), 1000);
  };

  const deleteMessage = (messageId: string) => {
    if (!socket || !isConnected) return;
    Alert.alert('Delete Message', 'Delete this message? This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => socket.emit('delete_message', { vehicleId, messageId }),
      },
    ]);
  };

  const togglePin = () => {
    if (!socket || !isConnected) return;
    socket.emit(isPinned ? 'unpin_chat' : 'pin_chat', { vehicleId });
  };

  const uploadFile = async (
  file: { uri: string; name: string; type: string; size: number },
  ) => {
    const UPLOAD_URL = `${API_BASE_URL}/api/chat/upload`;
  if (!socket || !isConnected || !vehicleId) return;

  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    Alert.alert('File too large', 'File size must be less than 10MB.');
    return;
  }

  let fileType: 'image' | 'video' | 'document' = 'document';
  if (file.type.startsWith('image/')) fileType = 'image';
  else if (file.type.startsWith('video/')) fileType = 'video';

    Alert.alert('uploading file');
  setUploading(true);
  try {
    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      name: file.name,
      type: file.type,
    } as any);
    formData.append('vehicleId', vehicleId);
    formData.append('fileType', fileType);
    const token = await getAuthToken();
    console.log('UPLOAD_URL', UPLOAD_URL,formData,token);
    const response = await fetch(UPLOAD_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    if (!response.ok) throw new Error('Upload failed');

    const { fileUrl } = await response.json();

    socket.emit('send_message', {
      vehicleId,
      message: file.name,
      fileUrl,
      fileType,
      fileName: file.name,
      fileSize: file.size,
    });

    console.log('[Mobile] File uploaded:', fileUrl);
  } catch (error) {
    console.error('[Mobile] File upload failed:', error);
    Alert.alert('Upload Failed', 'Failed to upload file. Please try again.');
  } finally {
    setUploading(false);
  }
};

  const isReady = isConnected && registrationComplete;

  return {
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
  };
}
