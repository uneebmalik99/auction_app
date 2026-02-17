import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { appColors } from '../../utils/appColors';
import { User } from '../../utils/types'; // adjust path if needed
import { styles } from './styles';

interface UserCardProps {
  user: User | null | undefined;
  onPress?: () => void; // optional: navigate to user profile
}

export default function UserCard({ user, onPress }: UserCardProps) {
  if (!user) {
    return null;
  }

  const displayName = user.name || 'Unknown User';
  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const hasImage = !!user.profileImage;

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={onPress ? 0.8 : 1}
      onPress={onPress}
      disabled={!onPress}
    >
      {/* Avatar */}
      <View style={styles.avatarWrapper}>
        {hasImage ? (
          <Image
            source={{ uri: user.profileImage }}
            style={styles.avatarImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarInitials}>{initials || '?'}</Text>
          </View>
        )}
      </View>

      {/* User Info */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {displayName}
        </Text>
        {user.name && (
          <Text style={styles.username} numberOfLines={1}>
            @{user.name}
          </Text>
        )}
        {user.address && (
          <Text style={styles.location} numberOfLines={1}>
            📍 {user.address}
          </Text>
        )}
      </View>

      {/* Optional: Right arrow if clickable */}
      {onPress && (
        <View style={styles.arrow}>
          <Text style={styles.arrowText}>›</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
