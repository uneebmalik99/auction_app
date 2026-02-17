import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Header, Button, CountDown, BidControls } from '../../../components';
import { styles } from './styles';
import { useAuctionBids } from '../../../hooks/useAuctionBids';
import type { AuctionItem } from '../../../utils/types';
import { useIsFocused } from '@react-navigation/native';
import { formatRemainingTime } from '../../../utils/methods';
import Swiper from 'react-native-swiper';
import { useAppSelector } from '../../../redux/hooks';

export default function ItemDetails() {
  const isFocused = useIsFocused();
  const route = useRoute<any>();
  const params = route.params as
    | { auctionId: string; item?: AuctionItem; myBids?: boolean }
    | undefined;
  const auctionId: string | null = params?.auctionId ?? null;
  const myBids = params?.myBids ?? false;
  const item = params?.item;
  const [activeTab, setActiveTab] = useState<'description' | 'bids' | 'myBids'>(
    'description',
  );
  const [bidAmount, setBidAmount] = useState(item?.startingPrice ?? 0);
  const [now, setNow] = useState(Date.now());
  const step = item?.minimumBidIncrement ?? 0;
  const currentUser = useAppSelector(state => state.profile.user);

  const bidAmountRef = useRef<number>(item?.startingPrice ?? 0);

  const { currentBid, bids, placeBid } = useAuctionBids({
    auctionId: item?._id || (item as any)?.id || null,
    initialBid: item?.startingPrice ?? item?.currentBid ?? 0, // ← Use actual auction starting/current bid
  });

  let computedFooterLabel: string | undefined;
  let computedFooterValue: string | undefined;

  if (
    item?.biddingStartsAt !== undefined ||
    item?.biddingEndsAt !== undefined
  ) {
    if (item.biddingStartsAt && now < Date.parse(item.biddingStartsAt || '')) {
      computedFooterLabel = 'Starts in';
      computedFooterValue = formatRemainingTime(
        Date.parse(item?.biddingStartsAt || ''),
      );
    } else if (
      item.biddingEndsAt &&
      now < Date.parse(item?.biddingEndsAt || '')
    ) {
      computedFooterLabel = 'Ends in';
      computedFooterValue = formatRemainingTime(
        Date.parse(item?.biddingEndsAt || ''),
      );
    } else if (item.biddingEndsAt) {
      computedFooterLabel = 'Ended';
      computedFooterValue = 'Auction ended';
    } else if (item.biddingStartsAt) {
      computedFooterLabel = 'Starts in';
      computedFooterValue = formatRemainingTime(
        Date.parse(item?.biddingStartsAt || ''),
      );
    }
  }

  const specs = [
    { label: 'Make', value: item?.make },
    { label: 'Model', value: item?.model },
    {
      label: 'Year',
      value: item?.year != null ? String(item.year) : undefined,
    },
    { label: 'Location', value: item?.location },
    { label: 'Fuel type', value: item?.fuelType },
    { label: 'Transmission', value: item?.transmission },
    { label: 'Drive type', value: item?.driveType },
    {
      label: 'Mileage',
      value:
        item?.mileage != null
          ? `${item.mileage.toLocaleString('en-US')} km`
          : undefined,
    },
    { label: 'Engine capacity', value: item?.engineCapacity },
    {
      label: 'Horsepower',
      value: item?.horsePower != null ? `${item.horsePower} hp` : undefined,
    },
    { label: 'Color', value: item?.color },
    { label: 'VIN', value: item?.vin },
    { label: 'Reg. number', value: item?.registrationNumber },
  ].filter(row => row.value);

  const featureLabels: string[] = [];
  const features = item?.features;
  if (features) {
    if (features.sunroof) featureLabels.push('Sunroof');
    if (features.leatherSeats) featureLabels.push('Leather seats');
    if (features.navigation) featureLabels.push('Navigation');
    if (features.parkingSensors) featureLabels.push('Parking sensors');
    if (features.heatedSeats) featureLabels.push('Heated seats');
    if (features.bluetooth) featureLabels.push('Bluetooth');
    if (features.appleCarPlay) featureLabels.push('Apple CarPlay');
    if (features.androidAuto) featureLabels.push('Android Auto');
    if (features.wirelessCharging) featureLabels.push('Wireless charging');
    if (features.camera360) featureLabels.push('360° camera');
    if (features.adaptiveCruise) featureLabels.push('Adaptive cruise');
    if (features.laneAssist) featureLabels.push('Lane assist');
  }

  useEffect(() => {
    if (!isFocused) return;

    // reset local state if needed
    setBidAmount(item?.startingPrice ?? 0);

    // OPTIONAL: if your hook exposes a reload function, call it here
    // reloadBids();
  }, [item?._id]);

  useEffect(() => {
    bidAmountRef.current = bidAmount;
  }, [bidAmount]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header titleKey="itemDetails.title" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        {/* Top media + overlay bids */}
        <View style={styles.mediaContainer}>
          <View style={styles.mediaInner}>
            <View style={styles.mediaTopRow}>
              <View style={styles.mediaBadge}>
                <Text style={styles.mediaBadgeText}>
                  {item?.photos?.length
                    ? `${item.photos.length} photos`
                    : 'No photos'}
                </Text>
              </View>

              <View style={styles.shareBadge}>
                <Text style={styles.shareIcon}>⇪</Text>
              </View>
            </View>

            {item?.photos[0] ? (
              <Swiper
                style={styles.wrapper}
                showsButtons={false} // optional: navigation arrows
                showsPagination={true} // dots at the bottom
                paginationStyle={styles.pagination}
                dotStyle={styles.dot}
                activeDotStyle={styles.activeDot}
                loop={false} // set to true if you want infinite looping
                autoplay={false} // optional: auto-slide
              >
                {item.photos.map((uri, index) => (
                  <Image
                    // eslint-disable-next-line react/no-array-index-key
                    key={`${uri}-${index}`}
                    source={{ uri: uri as string }}
                    style={styles.mediaImage}
                  />
                ))}
              </Swiper>
            ) : (
              <View style={styles.carPlaceholder}>
                <Text style={styles.carPlaceholderText}>Car preview</Text>
              </View>
            )}
          </View>

          {/* Countdown bar */}
          {/* <View style={styles.countdownBar}>
            <View style={styles.countdownLeft}>
              <View style={styles.countdownCircleOuter}>
                <View style={styles.countdownCircleInner} />
              </View>
              <Text style={styles.countdownLabel}>{computedFooterLabel}</Text>
            </View>
            <Text style={styles.countdownValue}>{computedFooterValue}</Text>
          </View> */}

          <CountDown
            biddingStartsAt={item?.biddingStartsAt}
            biddingEndsAt={item?.biddingEndsAt}
            label={true}
          />
        </View>

        {/* Details card */}
        <View style={styles.detailsCard}>
          {/* Title + price */}
          <View style={styles.detailsHeaderRow}>
            <View>
              <Text style={styles.detailsTitle}>{item?.title ?? ''}</Text>
              <Text style={styles.detailsStartingLabel}>Starting price</Text>
              <View style={styles.detailsPriceRow}>
                <Text style={styles.detailsPriceMain}>
                  {item?.startingPrice != null ? `${item.startingPrice} $` : ''}
                </Text>
                <Text style={styles.detailsPriceSecondary}>
                  {item?.reservePrice} $
                </Text>
              </View>
            </View>

            <View style={styles.statusFloatingButton}>
              <Text style={styles.statusFloatingIcon}>⇧</Text>
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabsRow}>
            <TouchableOpacity
              style={styles.tabButton}
              activeOpacity={0.8}
              onPress={() => setActiveTab('description')}
            >
              <Text
                style={[
                  styles.tabLabel,
                  activeTab === 'description' && styles.tabLabelActive,
                ]}
              >
                Description
              </Text>
              {activeTab === 'description' && (
                <View style={styles.tabIndicator} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tabButton}
              activeOpacity={0.8}
              onPress={() => setActiveTab('bids')}
            >
              <Text
                style={[
                  styles.tabLabel,
                  activeTab === 'bids' && styles.tabLabelActive,
                ]}
              >
                Bids
              </Text>
              {activeTab === 'bids' && <View style={styles.tabIndicator} />}
            </TouchableOpacity>

            {myBids ? (
              <TouchableOpacity
                style={styles.tabButton}
                activeOpacity={0.8}
                onPress={() => setActiveTab('myBids')}
              >
                <Text
                  style={[
                    styles.tabLabel,
                    activeTab === 'myBids' && styles.tabLabelActive,
                  ]}
                >
                  My Bids
                </Text>
                {activeTab === 'myBids' && <View style={styles.tabIndicator} />}
              </TouchableOpacity>
            ) : null}
          </View>

          {activeTab === 'description' ? (
            <View>
              {item?.description ? (
                <>
                  <Text style={styles.detailsSectionTitle}>Description</Text>
                  <Text style={styles.descriptionText}>
                    {item?.description ?? ''}
                  </Text>
                </>
              ) : null}

              {specs.length > 0 ? (
                <>
                  <Text style={styles.detailsSectionTitle}>Details</Text>
                  <View style={styles.specsGrid}>
                    {specs.map(row => (
                      <View key={row.label} style={styles.specRow}>
                        <Text style={styles.specLabel}>{row.label}</Text>
                        <Text style={styles.specValue}>{row.value}</Text>
                      </View>
                    ))}
                  </View>
                </>
              ) : null}

              {featureLabels.length > 0 ? (
                <>
                  <Text style={styles.detailsSectionTitle}>Features</Text>
                  <View style={styles.featuresList}>
                    {featureLabels.map(label => (
                      <View key={label} style={styles.featureChip}>
                        <Text style={styles.featureText}>{label}</Text>
                      </View>
                    ))}
                  </View>
                </>
              ) : null}
            </View>
          ) : activeTab === 'myBids' ? (
            <ScrollView
              style={styles.bidsList}
              showsVerticalScrollIndicator={false}
            >
              {bids.length === 0 ? (
                <Text style={styles.descriptionText}>
                  You haven't placed any bids yet.
                </Text>
              ) : (
                bids
                  .filter(
                    bid =>
                      bid.userId === currentUser?.id ||
                      bid.bidderId === currentUser?.id ||
                      bid.user?._id === currentUser?.id,
                  )
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt || '').getTime() -
                      new Date(a.createdAt || '').getTime(),
                  ) // newest first
                  .map(bid => {
                    const bidderName =
                      bid.bidderName ||
                      bid.userName ||
                      currentUser?.name ||
                      'Bidder';
                    const amount =
                      bid.amount != null
                        ? `${bid.amount.toLocaleString('en-US')} $`
                        : '--';
                    const previous =
                      bid.previousAmount != null
                        ? `${bid.previousAmount.toLocaleString('en-US')} $`
                        : undefined;

                    const isMyBid = true; // since we're in my bids tab

                    return (
                      <View key={bid.id} style={styles.bidRow}>
                        <View style={[styles.bidderAvatar]}>
                          <Text style={styles.bidderAvatarText}>
                            {bidderName.charAt(0).toUpperCase()}
                          </Text>
                        </View>

                        <View style={styles.bidderInfo}>
                          <Text style={[styles.bidderName]}>
                            {bidderName} {isMyBid && '(You)'}
                          </Text>
                          {bid.createdAt ? (
                            <Text style={styles.bidderPlace}>
                              {new Date(bid.createdAt).toLocaleString()}
                            </Text>
                          ) : null}
                        </View>

                        <View style={styles.bidAmounts}>
                          <Text style={[styles.bidAmountMain]}>{amount}</Text>
                          {previous ? (
                            <Text style={styles.bidAmountSecondary}>
                              {previous}
                            </Text>
                          ) : null}
                        </View>
                      </View>
                    );
                  })
              )}
            </ScrollView>
          ) : (
            <ScrollView
              style={styles.bidsList}
              showsVerticalScrollIndicator={false}
            >
              {bids.length === 0 ? (
                <Text style={styles.descriptionText}>
                  No bids yet. Be the first to place a bid.
                </Text>
              ) : (
                bids.map(bid => {
                  const bidderName =
                    bid.bidderName ||
                    bid.userName ||
                    bid.user?.name ||
                    'Bidder';
                  const amount =
                    bid.amount != null
                      ? `${bid.amount.toLocaleString('en-US')} $`
                      : '--';
                  const previous =
                    bid.previousAmount != null
                      ? `${bid.previousAmount.toLocaleString('en-US')} $`
                      : undefined;

                  return (
                    <View key={bid.id} style={styles.bidRow}>
                      <View style={styles.bidderAvatar}>
                        <Text style={styles.bidderAvatarText}>
                          {bidderName.charAt(0).toUpperCase()}
                        </Text>
                      </View>

                      <View style={styles.bidderInfo}>
                        <Text style={styles.bidderName}>{bidderName}</Text>
                        {bid.createdAt ? (
                          <Text style={styles.bidderPlace}>
                            {new Date(bid.createdAt).toLocaleString()}
                          </Text>
                        ) : null}
                      </View>

                      <View style={styles.bidAmounts}>
                        <Text style={styles.bidAmountMain}>{amount}</Text>
                        {previous ? (
                          <Text style={styles.bidAmountSecondary}>
                            {previous}
                          </Text>
                        ) : null}
                      </View>
                    </View>
                  );
                })
              )}
            </ScrollView>
          )}
        </View>

        {item?.status === 'live' ? (
          <BidControls
            step={step}
            currentBid={currentBid}
            startingPrice={item?.startingPrice}
            onPlaceBid={amount => placeBid(auctionId ?? '', amount)}
          />
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
