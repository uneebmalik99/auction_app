/**
 * MessageBubble.tsx
 * Renders a single chat message with support for:
 *  - Own vs other styling
 *  - Deleted state
 *  - File attachments
 *  - Read receipts
 *  - Long-press delete (own messages)
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Message } from './useVehicleChat';
import FileAttachment from './FileAttachment';
import { styles } from './styles';

interface Props {
  message: Message;
  isOwn: boolean;
  onDelete: (id: string) => void;
}

export default function MessageBubble({ message, isOwn, onDelete }: Props) {
  const [showDelete, setShowDelete] = useState(false);
  const isDeleted = message.deleted || message.message?.includes('deleted');

  const bubbleStyle = [
    styles.bubble,
    isDeleted ? styles.deletedBubble : isOwn ? styles.customerBubble : styles.adminBubble,
  ];

  return (
    <View style={styles.messageWrapper}>
      <View style={[styles.messageRow, isOwn ? styles.rowReverse : styles.rowDirect]}>
        {/* Delete button — only shown for own, non-deleted messages after long press */}
        {isOwn && !isDeleted && showDelete && (
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => {
              setShowDelete(false);
              onDelete(message._id);
            }}
          >
            <Text style={{ fontSize: 14 }}>🗑</Text>
          </TouchableOpacity>
        )}

        <TouchableWithoutFeedback
          onLongPress={() => isOwn && !isDeleted && setShowDelete((v) => !v)}
          onPress={() => showDelete && setShowDelete(false)}
        >
          <View style={bubbleStyle}>
            {isDeleted ? (
              <Text style={styles.deletedText}>{message.message}</Text>
            ) : (
              <>
                {/* Show text unless it's a pure image message */}
                {(!message.fileUrl || message.fileType !== 'image') && (
                  <Text style={styles.msgText}>{message.message}</Text>
                )}
                {message.fileUrl && <FileAttachment message={message} />}
              </>
            )}
          </View>
        </TouchableWithoutFeedback>
      </View>

      {/* Timestamp + read receipt */}
      <View
        style={[
          styles.metaRow,
          isOwn ? styles.metaRowRight : styles.metaRowLeft,
        ]}
      >
        <Text style={styles.timestamp}>
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
        {isOwn && !isDeleted && (
          <Text style={[styles.readTick, { color: message.read ? '#60a5fa' : '#64748b' }]}>
            ✓✓
          </Text>
        )}
      </View>
    </View>
  );
}
