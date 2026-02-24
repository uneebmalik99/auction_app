import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Check, DollarSign, User, Calendar, Eye } from 'lucide-react-native';
import { AuctionItem } from '../../utils/types';
import { appColors } from '../../utils/appColors';
import { height, width } from '../../utils/dimensions';

interface RecentlySoldVehiclesProps {
  items: AuctionItem[];
  onItemPress?: (item: AuctionItem) => void;
  onViewWinner?: (item: AuctionItem) => void;
}

interface SoldVehicleCardProps {
  item: AuctionItem;
  onPress?: () => void;
  onViewWinner?: () => void;
}

function SoldVehicleCard({ item, onPress, onViewWinner }: SoldVehicleCardProps) {
  // Get winner info - assuming highest bidder is the winner
  // In a real app, this would come from the API
  const salePrice = item.currentBid || item.startingPrice || 0;
  const price = typeof salePrice === 'number' ? salePrice : parseFloat(String(salePrice)) || 0;
  
  // Format sold date - using updatedAt as sold date
  const soldDate = item.updatedAt 
    ? new Date(item.updatedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'N/A';

  // Mock winner data - in real app, this would come from API
  const winnerName = 'shifa';
  const winnerEmail = 'shifamasood62@gmail.com';

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={onPress}
    >
      {/* Image Section */}
      <View style={styles.imageSection}>
        {(item as any).videos && (item as any).videos.length > 0 ? (
          <View style={styles.imageContainer}>
            {item.photos?.[0] ? (
              <>
                <Image
                  source={{ uri: item.photos[0] }}
                  style={styles.image}
                  resizeMode="cover"
                />
                <View style={styles.videoLabelContainer}>
                  <Text style={styles.videoLabel}>VIDEO</Text>
                </View>
              </>
            ) : (
              <Text style={styles.carDiagram}>🚗</Text>
            )}
          </View>
        ) : item.photos?.[0] ? (
          <Image
            source={{ uri: item.photos[0] }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imageContainer}>
            <Text style={styles.carDiagram}>🚗</Text>
          </View>
        )}
        <View style={styles.soldBadge}>
          <Check size={10} color={appColors.white} />
          <Text style={styles.soldBadgeText}>SOLD</Text>
        </View>
      </View>

      {/* Content Section */}
      <View style={styles.contentSection}>
        <Text style={styles.vehicleTitle}>{item.title}</Text>
        <Text style={styles.vehicleModel}>
          {item.make} {item.model} • {item.year}
        </Text>

        {/* Sale Price */}
        <View style={styles.priceRow}>
          <DollarSign size={14} color={appColors.green} />
          <Text style={styles.salePrice}>
            ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
        </View>

        {/* Winner Info */}
        <View style={styles.winnerRow}>
          <User size={12} color={appColors.textMuted} />
          <Text style={styles.winnerName}>{winnerName}</Text>
          <Text style={styles.winnerEmail} numberOfLines={1}>
            {winnerEmail}
          </Text>
          <TouchableOpacity
            onPress={onViewWinner}
            style={styles.eyeButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Eye size={12} color={appColors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Sold Date */}
        <View style={styles.dateRow}>
          <Calendar size={12} color={appColors.textMuted} />
          <Text style={styles.soldDate}>Sold {soldDate}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function RecentlySoldVehicles({
  items,
  onItemPress,
  onViewWinner,
}: RecentlySoldVehiclesProps) {
  // Filter only sold items
  const soldItems = items.filter(item => item.status === 'sold').slice(0, 4);

  if (soldItems.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Check size={16} color={appColors.green} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>Recently Sold Vehicles</Text>
          <Text style={styles.subtitle}>
            Latest completed sales • {soldItems.length} vehicles
          </Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {soldItems.map(item => (
          <SoldVehicleCard
            key={item._id}
            item={item}
            onPress={() => onItemPress?.(item)}
            onViewWinner={() => onViewWinner?.(item)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: height(3),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height(2),
    paddingHorizontal: width(4),
  },
  headerIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: appColors.green + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: width(2),
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: appColors.textPrimary,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: appColors.textMuted,
  },
  scrollContent: {
    paddingHorizontal: width(4),
    gap: width(3),
  },
  card: {
    width: width(70),
    backgroundColor: appColors.surface,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: width(3),
  },
  imageSection: {
    backgroundColor: appColors.white,
    height: height(15),
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  carDiagram: {
    fontSize: 60,
  },
  videoLabelContainer: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 1,
  },
  videoLabel: {
    color: appColors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  soldBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appColors.green,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  soldBadgeText: {
    color: appColors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  contentSection: {
    backgroundColor: appColors.surface,
    padding: width(3),
  },
  vehicleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: appColors.textPrimary,
    marginBottom: 4,
  },
  vehicleModel: {
    fontSize: 12,
    color: appColors.textMuted,
    marginBottom: height(1),
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height(1),
    gap: 4,
  },
  salePrice: {
    fontSize: 14,
    fontWeight: '700',
    color: appColors.green,
  },
  winnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height(0.8),
    gap: 4,
    flexWrap: 'wrap',
  },
  winnerName: {
    fontSize: 11,
    color: appColors.textSecondary,
    fontWeight: '500',
  },
  winnerEmail: {
    fontSize: 10,
    color: appColors.textMuted,
    flex: 1,
  },
  eyeButton: {
    padding: 4,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  soldDate: {
    fontSize: 10,
    color: appColors.textMuted,
  },
});
