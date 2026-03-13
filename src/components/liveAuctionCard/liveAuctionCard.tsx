import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Check, Clock, Calendar, Fuel, Gauge, Settings2, Eye, User, Heart } from 'lucide-react-native';
import { AuctionItem } from '../../utils/types';
import { appColors } from '../../utils/appColors';
import { formatRemainingTime } from '../../utils/methods';
import { height, width } from '../../utils/dimensions';
import { useI18n } from '../../i18n';

interface LiveAuctionCardProps {
  item: AuctionItem;
  onPress?: () => void;
  onViewBidDetails?: (vehicleId: string) => void;
  isFavorite?: boolean;
  onFavoritePress?: () => void;
}

export default function LiveAuctionCard({ item, onPress, onViewBidDetails, isFavorite = false, onFavoritePress }: LiveAuctionCardProps) {
  const { t, isRTL } = useI18n();
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
    <html style="margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden;">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          html, body {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            background: #000;
            overflow: hidden;
            position: fixed;
          }
          video {
            width: 100%;
            height: 100%;
            object-fit: cover;
            position: absolute;
            top: 0;
            left: 0;
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
          style="width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0;"
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
            scalesPageToFit={true}
            contentInsetAdjustmentBehavior="never"
            automaticallyAdjustContentInsets={false}
          />
        ) : imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Text style={[styles.placeholderText, isRTL && styles.placeholderTextRTL]}>
              {t('liveAuctionCard.noImage')}
            </Text>
          </View>
        )}

        {/* Video Badge */}
        {hasVideo && (
          <View style={[styles.videoBadge, isRTL && styles.videoBadgeRTL]}>
            <Text style={[styles.videoBadgeText, isRTL && styles.videoBadgeTextRTL]}>
              {t('liveAuctionCard.video')}
            </Text>
          </View>
        )}
        
        {/* Live Badge */}
        <View style={[styles.liveBadge, isRTL && styles.liveBadgeRTL]}>
          <Check size={12} color={appColors.white} />
          <Text style={[styles.liveBadgeText, isRTL && styles.liveBadgeTextRTL]}>
            {t('liveAuctionCard.live')}
          </Text>
        </View>

        {/* Timer Badge */}
        <View style={styles.timerBadge}>
          <Clock size={12} color={appColors.white} />
          <Text style={styles.timerBadgeText}>{getRemainingTime()}</Text>
        </View>

        {/* Like Icon */}
        <TouchableOpacity
          style={styles.likeButton}
          activeOpacity={0.8}
          onPress={(e) => {
            e.stopPropagation();
            if (onFavoritePress) {
              onFavoritePress();
            }
          }}
        >
          <Heart 
            size={20} 
            color={isFavorite ? appColors.red : appColors.white} 
            fill={isFavorite ? appColors.red : 'none'}
          />
        </TouchableOpacity>
      </View>

      {/* Content Section */}
      <View style={styles.contentContainer}>
        {/* Title */}
        <Text style={[styles.title, isRTL && styles.titleRTL]}>{item.title}</Text>
        <Text style={[styles.subtitle, isRTL && styles.subtitleRTL]}>
          {item.make} {item.model} {item.year}
        </Text>

        {/* Specs Grid */}
        <View style={[styles.specsGrid, isRTL && styles.specsGridRTL]}>
          <View style={[styles.specItem, isRTL && styles.specItemRTL]}>
            <Calendar size={14} color={appColors.textMuted} />
            <Text style={[styles.specText, isRTL && styles.specTextRTL]}>{item.year || 'N/A'}</Text>
          </View>
          <View style={[styles.specItem, isRTL && styles.specItemRTL]}>
            <Fuel size={14} color={appColors.textMuted} />
            <Text style={[styles.specText, isRTL && styles.specTextRTL]}>{item.fuelType || 'N/A'}</Text>
          </View>
          <View style={[styles.specItem, isRTL && styles.specItemRTL]}>
            <Gauge size={14} color={appColors.textMuted} />
            <Text style={[styles.specText, isRTL && styles.specTextRTL]}>
              {item.mileage ? `${item.mileage} km` : 'N/A'}
            </Text>
          </View>
          <View style={[styles.specItem, isRTL && styles.specItemRTL]}>
            <Settings2 size={14} color={appColors.textMuted} />
            <Text style={[styles.specText, isRTL && styles.specTextRTL]}>
              {item.transmissionType || 'N/A'}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Listed By */}
        <View style={[styles.listedByRow, isRTL && styles.listedByRowRTL]}>
          <User size={14} color={appColors.textMuted} />
          <Text style={[styles.listedByText, isRTL && styles.listedByTextRTL]}>
            {t('liveAuctionCard.listedBy')}{' '}
          </Text>
          <Text style={[styles.listedByName, isRTL && styles.listedByNameRTL]}>Admin</Text>
        </View>

        <View style={styles.divider} />

        {/* Current Bid */}
        <View style={styles.bidSection}>
          <Text style={[styles.bidLabel, isRTL && styles.bidLabelRTL]}>
            {t('liveAuctionCard.currentBid')}
          </Text>
          <View style={[styles.bidAmountRow, isRTL && styles.bidAmountRowRTL]}>
            <Text style={styles.dollarSign}>$</Text>
            <Text style={[styles.bidAmount, isRTL && styles.bidAmountRTL]}>
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
          <Text style={[styles.viewButtonText, isRTL && styles.viewButtonTextRTL]}>
            {t('liveAuctionCard.viewBidDetails')}
          </Text>
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
  placeholderTextRTL: {
    textAlign: 'right',
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
  liveBadgeRTL: {
    left: 'auto',
    right: 12,
  },
  liveBadgeText: {
    color: appColors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  liveBadgeTextRTL: {
    textAlign: 'right',
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
  videoBadgeRTL: {
    left: 'auto',
    right: 12,
  },
  videoBadgeText: {
    color: appColors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  videoBadgeTextRTL: {
    textAlign: 'right',
  },
  likeButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
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
  titleRTL: {
    textAlign: 'right',
  },
  subtitle: {
    fontSize: 14,
    color: appColors.textMuted,
    marginBottom: height(1.5),
  },
  subtitleRTL: {
    textAlign: 'right',
  },
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: height(1.5),
    gap: width(3),
  },
  specsGridRTL: {
    flexDirection: 'row-reverse',
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    width: '45%',
  },
  specItemRTL: {
    flexDirection: 'row-reverse',
  },
  specText: {
    fontSize: 12,
    color: appColors.textMuted,
  },
  specTextRTL: {
    textAlign: 'right',
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
  listedByRowRTL: {
    flexDirection: 'row-reverse',
  },
  listedByText: {
    fontSize: 12,
    color: appColors.textMuted,
  },
  listedByTextRTL: {
    textAlign: 'right',
  },
  listedByName: {
    fontSize: 12,
    color: appColors.primary,
    fontWeight: '600',
  },
  listedByNameRTL: {
    textAlign: 'right',
  },
  bidSection: {
    marginBottom: height(1.5),
  },
  bidLabel: {
    fontSize: 12,
    color: appColors.textMuted,
    marginBottom: 4,
  },
  bidLabelRTL: {
    textAlign: 'right',
  },
  bidAmountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  bidAmountRowRTL: {
    flexDirection: 'row-reverse',
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
  bidAmountRTL: {
    textAlign: 'right',
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
  viewButtonTextRTL: {
    textAlign: 'right',
  },
});
