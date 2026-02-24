/**
 * ChatHeader.tsx
 * Header bar showing vehicle title, connection status, pin button, and back button.
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './styles';

interface Props {
  title: string;
  isReady: boolean;
  isPinned: boolean;
  onBack: () => void;
  onTogglePin: () => void;
}

export default function ChatHeader({ title, isReady, isPinned, onBack, onTogglePin }: Props) {
  return (
    <View style={styles.header}>
      <View style={styles.headerRow}>
        {/* Back button */}
        <TouchableOpacity onPress={onBack} style={styles.iconBtn} hitSlop={8}>
          <Text style={{ color: '#ef4444', fontSize: 18 }}>←</Text>
        </TouchableOpacity>

        {/* Icon + Title */}
        <View style={[styles.headerLeft, { marginLeft: 8 }]}>
          <View style={styles.headerIconWrap}>
            <Text style={{ fontSize: 16 }}>💬</Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.headerTitleRow}>
              {isPinned && <Text style={{ color: '#facc15', fontSize: 13 }}>★</Text>}
              <Text style={styles.headerTitle} numberOfLines={1}>
                {title}
              </Text>
            </View>
            <View style={styles.statusRow}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: isReady ? '#4ade80' : '#94a3b8' },
                ]}
              />
              <Text style={styles.statusText}>{isReady ? 'Connected' : 'Connecting...'}</Text>
            </View>
          </View>
        </View>

        {/* Pin button */}
        <TouchableOpacity
          onPress={onTogglePin}
          disabled={!isReady}
          style={[styles.iconBtn, { opacity: isReady ? 1 : 0.4 }]}
          hitSlop={8}
        >
          <Text style={{ fontSize: 20, color: isPinned ? '#facc15' : '#64748b' }}>
            {isPinned ? '★' : '☆'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
