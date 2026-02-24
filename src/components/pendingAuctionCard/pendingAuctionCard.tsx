import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { AlertCircle, Calendar, Fuel, Gauge, Settings2, Eye, User } from 'lucide-react-native';
import { AuctionItem } from '../../utils/types';
import { appColors } from '../../utils/appColors';
import { height, width } from '../../utils/dimensions';

interface PendingAuctionCardProps {
  item: AuctionItem;
  onPress?: () => void;
}

export default function PendingAuctionCard({ item, onPress }: PendingAuctionCardProps) {
  const startingPrice = item.startingPrice || 0;
  const price = typeof startingPrice === 'number' ? startingPrice : parseFloat(String(startingPrice)) || 0;

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={onPress}
    >
      {/* Image Section */}
      <View style={styles.imageContainer}>
        {item.photos?.[0] ? (
          <Image source={{ uri: item.photos[0] }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}
        
        {/* Pending Badge */}
        <View style={styles.pendingBadge}>
          <AlertCircle size={12} color={appColors.white} />
          <Text style={styles.pendingBadgeText}>Pending</Text>
        </View>
      </View>

      {/* Content Section */}
      <View style={styles.contentContainer}>
        {/* Title */}
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>
          {item.make} {item.model} {item.year}
        </Text>

        {/* Specs Grid */}
        <View style={styles.specsGrid}>
          <View style={styles.specItem}>
            <Calendar size={14} color={appColors.textMuted} />
            <Text style={styles.specText}>{item.year || 'N/A'}</Text>
          </View>
          <View style={styles.specItem}>
            <Fuel size={14} color={appColors.textMuted} />
            <Text style={styles.specText}>{item.fuelType || 'N/A'}</Text>
          </View>
          <View style={styles.specItem}>
            <Gauge size={14} color={appColors.textMuted} />
            <Text style={styles.specText}>
              {item.mileage ? `${item.mileage} km` : 'N/A'}
            </Text>
          </View>
          <View style={styles.specItem}>
            <Settings2 size={14} color={appColors.textMuted} />
            <Text style={styles.specText}>
              {item.transmissionType || 'N/A'}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Listed By */}
        <View style={styles.listedByRow}>
          <User size={14} color={appColors.textMuted} />
          <Text style={styles.listedByText}>Listed by </Text>
          <Text style={styles.listedByName}>Admin</Text>
        </View>

        <View style={styles.divider} />

        {/* Starting Price */}
        <View style={styles.bidSection}>
          <Text style={styles.bidLabel}>Starting Price</Text>
          <View style={styles.bidAmountRow}>
            <Text style={styles.dollarSign}>$</Text>
            <Text style={styles.bidAmount}>
              {price.toLocaleString('en-US')}
            </Text>
          </View>
        </View>

        {/* View Details Button */}
        <TouchableOpacity style={styles.viewButton} activeOpacity={0.8}>
          <Eye size={16} color={appColors.white} />
          <Text style={styles.viewButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: width(85),
    backgroundColor: appColors.surface,
    borderRadius: 16,
    marginRight: width(3),
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: height(20),
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    backgroundColor: appColors.inputBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: appColors.textMuted,
    fontSize: 14,
  },
  pendingBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appColors.orange,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  pendingBadgeText: {
    color: appColors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  contentContainer: {
    padding: width(4),
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: appColors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: appColors.textMuted,
    marginBottom: height(1.5),
  },
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: height(1.5),
    gap: width(3),
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    width: '45%',
  },
  specText: {
    fontSize: 12,
    color: appColors.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: appColors.inputBorder,
    marginVertical: height(1.5),
  },
  listedByRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  listedByText: {
    fontSize: 12,
    color: appColors.textMuted,
  },
  listedByName: {
    fontSize: 12,
    color: appColors.primary,
    fontWeight: '600',
  },
  bidSection: {
    marginBottom: height(1.5),
  },
  bidLabel: {
    fontSize: 12,
    color: appColors.textMuted,
    marginBottom: 4,
  },
  bidAmountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  dollarSign: {
    fontSize: 18,
    fontWeight: '700',
    color: appColors.orange,
    marginRight: 2,
  },
  bidAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: appColors.orange,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: appColors.primary,
    paddingVertical: height(1.5),
    borderRadius: 8,
    gap: 8,
    marginTop: height(1),
  },
  viewButtonText: {
    color: appColors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});
