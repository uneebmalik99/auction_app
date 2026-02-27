import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Check, Clock, Calendar, Fuel, Gauge, Settings2, Eye, User } from 'lucide-react-native';
import { AuctionItem } from '../../utils/types';
import { appColors } from '../../utils/appColors';
import { formatRemainingTime } from '../../utils/methods';
import { height, width } from '../../utils/dimensions';

interface LiveAuctionCardProps {
  item: AuctionItem;
  onPress?: () => void;
  onViewBidDetails?: (vehicleId: string) => void;
}

export default function LiveAuctionCard({ item, onPress, onViewBidDetails }: LiveAuctionCardProps) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!item.biddingEndsAt) return;

    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [item.biddingEndsAt]);

  const getRemainingTime = () => {
    if (!item.biddingEndsAt) return '00:00:00';
    const endTime = Date.parse(item.biddingEndsAt as string);
    const remaining = Math.max(0, endTime - now);
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const currentBid = item.currentBid || item.startingPrice || 0;
  const bidAmount = typeof currentBid === 'number' ? currentBid : parseFloat(String(currentBid)) || 0;

  // Check if video exists
  const hasVideo = item.videos && Array.isArray(item.videos) && item.videos.length > 0;
  const videoUrl = hasVideo && item.videos ? item.videos[0] : null;
  const imageUrl = item.photos?.[0];

  // HTML for autoplay video
  const videoHTML = videoUrl ? `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            margin: 0;
            padding: 0;
            background: #000;
            overflow: hidden;
          }
          video {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        </style>
      </head>
      <body>
        <video 
          src="${videoUrl}" 
          autoplay 
          loop 
          muted 
          playsinline
          style="width: 100%; height: 100%; object-fit: cover;"
        ></video>
      </body>
    </html>
  ` : '';

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={onPress}
    >
      {/* Image/Video Section */}
      <View style={styles.imageContainer}>
        {hasVideo && videoUrl ? (
          <WebView
            source={{ html: videoHTML }}
            style={styles.video}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            scrollEnabled={false}
            bounces={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          />
        ) : imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}

        {/* Video Badge */}
        {hasVideo && (
          <View style={styles.videoBadge}>
            <Text style={styles.videoBadgeText}>VIDEO</Text>
          </View>
        )}
        
        {/* Live Badge */}
        <View style={styles.liveBadge}>
          <Check size={12} color={appColors.white} />
          <Text style={styles.liveBadgeText}>Live</Text>
        </View>

        {/* Timer Badge */}
        <View style={styles.timerBadge}>
          <Clock size={12} color={appColors.white} />
          <Text style={styles.timerBadgeText}>{getRemainingTime()}</Text>
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

        {/* Current Bid */}
        <View style={styles.bidSection}>
          <Text style={styles.bidLabel}>Current Bid</Text>
          <View style={styles.bidAmountRow}>
            <Text style={styles.dollarSign}>$</Text>
            <Text style={styles.bidAmount}>
              {bidAmount.toLocaleString('en-US')}
            </Text>
          </View>
        </View>

        {/* View Bid Details Button */}
        <TouchableOpacity
          style={styles.viewButton}
          activeOpacity={0.8}
          onPress={(e) => {
            e.stopPropagation();
            if (onViewBidDetails) {
              onViewBidDetails(item._id);
            }
          }}
        >
          <Eye size={16} color={appColors.white} />
          <Text style={styles.viewButtonText}>View Bid Details</Text>
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
  video: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
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
  liveBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appColors.green,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  liveBadgeText: {
    color: appColors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  timerBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  timerBadgeText: {
    color: appColors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  videoBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    zIndex: 1,
  },
  videoBadgeText: {
    color: appColors.white,
    fontSize: 10,
    fontWeight: '700',
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
    color: appColors.green,
    marginRight: 2,
  },
  bidAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: appColors.green,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: appColors.red,
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
