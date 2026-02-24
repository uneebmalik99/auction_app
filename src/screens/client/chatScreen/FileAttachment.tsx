/**
 * FileAttachment.tsx
 * Renders image, video, or document attachments inside a chat bubble.
 */

import React from 'react';
import { View, Text, Image, TouchableOpacity, Linking } from 'react-native';
import { Message } from './useVehicleChat';
import { styles } from './styles';

interface Props {
  message: Message;
}

export default function FileAttachment({ message }: Props) {
  if (!message.fileUrl) return null;

  const openFile = () => {
    if (message.fileUrl) Linking.openURL(message.fileUrl);
  };

  if (message.fileType === 'image') {
    return (
      <TouchableOpacity onPress={openFile} activeOpacity={0.85}>
        <Image
          source={{ uri: message.fileUrl }}
          style={styles.imageAttachment}
          resizeMode="cover"
        />
      </TouchableOpacity>
    );
  }

  if (message.fileType === 'video') {
    // React Native's Video component requires expo-av or react-native-video.
    // Falling back to a tappable link for broad compatibility.
    return (
      <TouchableOpacity onPress={openFile} style={styles.docAttachment} activeOpacity={0.8}>
        <Text style={{ fontSize: 22 }}>🎬</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.docFileName} numberOfLines={1}>
            {message.fileName || 'Video'}
          </Text>
          <Text style={styles.docFileSize}>Tap to open</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={openFile} style={styles.docAttachment} activeOpacity={0.8}>
      <Text style={{ fontSize: 22 }}>📄</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.docFileName} numberOfLines={1}>
          {message.fileName || 'Document'}
        </Text>
        {message.fileSize !== undefined && (
          <Text style={styles.docFileSize}>
            {(message.fileSize / 1024).toFixed(1)} KB
          </Text>
        )}
      </View>
      <Text style={{ fontSize: 16, color: '#94a3b8' }}>⬇</Text>
    </TouchableOpacity>
  );
}
