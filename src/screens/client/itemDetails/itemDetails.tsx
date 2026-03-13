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
import { formatRemainingTime, showSuccessToast } from '../../../utils/methods';
import Swiper from 'react-native-swiper';
import { useAppSelector } from '../../../redux/hooks';
import { useI18n } from '../../../i18n';

export default function ItemDetails() {
  const isFocused = useIsFocused();
  const route = useRoute<any>();
  const { t, isRTL } = useI18n();
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

  const { currentBid, bids, placeBid, isSubmittingBid, isBidSuccess } = useAuctionBids({
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
      computedFooterLabel = t('itemDetails.startsIn');
      computedFooterValue = formatRemainingTime(
        Date.parse(item?.biddingStartsAt || ''),
      );
    } else if (
      item.biddingEndsAt &&
      now < Date.parse(item?.biddingEndsAt || '')
    ) {
      computedFooterLabel = t('itemDetails.endsIn');
      computedFooterValue = formatRemainingTime(
        Date.parse(item?.biddingEndsAt || ''),
      );
    } else if (item.biddingEndsAt) {
      computedFooterLabel = t('itemDetails.ended');
      computedFooterValue = t('itemDetails.auctionEnded');
    } else if (item.biddingStartsAt) {
      computedFooterLabel = t('itemDetails.startsIn');
      computedFooterValue = formatRemainingTime(
        Date.parse(item?.biddingStartsAt || ''),
      );
    }
  }

  const specs = [
    { label: t('itemDetails.make'), value: item?.make },
    { label: t('itemDetails.model'), value: item?.model },
    {
      label: t('itemDetails.year'),
      value: item?.year != null ? String(item.year) : undefined,
    },
    { label: t('itemDetails.location'), value: item?.location },
    { label: t('itemDetails.fuelType'), value: item?.fuelType },
    { label: t('itemDetails.transmission'), value: item?.transmission },
    { label: t('itemDetails.driveType'), value: item?.driveType },
    {
      label: t('itemDetails.mileage'),
      value:
        item?.mileage != null
          ? `${item.mileage.toLocaleString('en-US')} km`
          : undefined,
    },
    { label: t('itemDetails.engineCapacity'), value: item?.engineCapacity },
    {
      label: t('itemDetails.horsepower'),
      value: item?.horsePower != null ? `${item.horsePower} hp` : undefined,
    },
    { label: t('itemDetails.color'), value: item?.color },
    { label: t('itemDetails.vin'), value: item?.vin },
    { label: t('itemDetails.regNumber'), value: item?.registrationNumber },
  ].filter(row => row.value);

  const featureLabels: string[] = [];
  const features = item?.features;
  if (features) {
    if (features.sunroof) featureLabels.push(t('itemDetails.feature.sunroof'));
    if (features.leatherSeats) featureLabels.push(t('itemDetails.feature.leatherSeats'));
    if (features.navigation) featureLabels.push(t('itemDetails.feature.navigation'));
    if (features.parkingSensors) featureLabels.push(t('itemDetails.feature.parkingSensors'));
    if (features.heatedSeats) featureLabels.push(t('itemDetails.feature.heatedSeats'));
    if (features.bluetooth) featureLabels.push(t('itemDetails.feature.bluetooth'));
    if (features.appleCarPlay) featureLabels.push(t('itemDetails.feature.appleCarPlay'));
    if (features.androidAuto) featureLabels.push(t('itemDetails.feature.androidAuto'));
    if (features.wirelessCharging) featureLabels.push(t('itemDetails.feature.wirelessCharging'));
    if (features.camera360) featureLabels.push(t('itemDetails.feature.camera360'));
    if (features.adaptiveCruise) featureLabels.push(t('itemDetails.feature.adaptiveCruise'));
    if (features.laneAssist) featureLabels.push(t('itemDetails.feature.laneAssist'));
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

  // Show success message when bid is confirmed
  useEffect(() => {
    if (isBidSuccess) {
      showSuccessToast(t('myBids.bidPlaced'), t('myBids.bidConfirmed'));
    }
  }, [isBidSuccess, t]);

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
                <Text style={[styles.mediaBadgeText, isRTL && styles.mediaBadgeTextRTL]}>
                  {item?.photos?.length
                    ? `${item.photos.length} ${t('itemDetails.photos')}`
                    : t('itemDetails.noPhotos')}
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
                <Text style={[styles.carPlaceholderText, isRTL && styles.carPlaceholderTextRTL]}>
                  {t('itemDetails.carPreview')}
                </Text>
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
          <View style={[styles.detailsHeaderRow, isRTL && styles.detailsHeaderRowRTL]}>
            <View>
              <Text style={[styles.detailsTitle, isRTL && styles.detailsTitleRTL]}>{item?.title ?? ''}</Text>
              <Text style={[styles.detailsStartingLabel, isRTL && styles.detailsStartingLabelRTL]}>
                {t('itemDetails.startingPrice')}
              </Text>
              <View style={[styles.detailsPriceRow, isRTL && styles.detailsPriceRowRTL]}>
                <Text style={[styles.detailsPriceMain, isRTL && styles.detailsPriceMainRTL]}>
                  {item?.startingPrice != null ? `${item.startingPrice} $` : ''}
                </Text>
                <Text style={[styles.detailsPriceSecondary, isRTL && styles.detailsPriceSecondaryRTL]}>
                  {item?.reservePrice} $
                </Text>
              </View>
            </View>

            <View style={styles.statusFloatingButton}>
              <Text style={styles.statusFloatingIcon}>⇧</Text>
            </View>
          </View>

          {/* Tabs */}
          <View style={[styles.tabsRow, isRTL && styles.tabsRowRTL]}>
            <TouchableOpacity
              style={styles.tabButton}
              activeOpacity={0.8}
              onPress={() => setActiveTab('description')}
            >
              <Text
                style={[
                  styles.tabLabel,
                  isRTL && styles.tabLabelRTL,
                  activeTab === 'description' && styles.tabLabelActive,
                ]}
              >
                {t('itemDetails.description')}
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
                  isRTL && styles.tabLabelRTL,
                  activeTab === 'bids' && styles.tabLabelActive,
                ]}
              >
                {t('itemDetails.bids')}
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
                    isRTL && styles.tabLabelRTL,
                    activeTab === 'myBids' && styles.tabLabelActive,
                  ]}
                >
                  {t('itemDetails.myBids')}
                </Text>
                {activeTab === 'myBids' && <View style={styles.tabIndicator} />}
              </TouchableOpacity>
            ) : null}
          </View>

          {activeTab === 'description' ? (
            <View>
              {item?.description ? (
                <>
                  <Text style={[styles.detailsSectionTitle, isRTL && styles.detailsSectionTitleRTL]}>
                    {t('itemDetails.description')}
                  </Text>
                  <Text style={[styles.descriptionText, isRTL && styles.descriptionTextRTL]}>
                    {item?.description ?? ''}
                  </Text>
                </>
              ) : null}

              {specs.length > 0 ? (
                <>
                  <Text style={[styles.detailsSectionTitle, isRTL && styles.detailsSectionTitleRTL]}>
                    {t('itemDetails.details')}
                  </Text>
                  <View style={styles.specsGrid}>
                    {specs.map(row => (
                      <View key={row.label} style={[styles.specRow, isRTL && styles.specRowRTL]}>
                        <Text style={[styles.specLabel, isRTL && styles.specLabelRTL]}>{row.label}</Text>
                        <Text style={[styles.specValue, isRTL && styles.specValueRTL]}>{row.value}</Text>
                      </View>
                    ))}
                  </View>
                </>
              ) : null}

              {featureLabels.length > 0 ? (
                <>
                  <Text style={[styles.detailsSectionTitle, isRTL && styles.detailsSectionTitleRTL]}>
                    {t('itemDetails.features')}
                  </Text>
                  <View style={[styles.featuresList, isRTL && styles.featuresListRTL]}>
                    {featureLabels.map(label => (
                      <View key={label} style={styles.featureChip}>
                        <Text style={[styles.featureText, isRTL && styles.featureTextRTL]}>{label}</Text>
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
                <Text style={[styles.descriptionText, isRTL && styles.descriptionTextRTL]}>
                  {t('itemDetails.noBidsPlaced')}
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
                          <Text style={[styles.bidderName, isRTL && styles.bidderNameRTL]}>
                            {bidderName} {isMyBid && t('itemDetails.you')}
                          </Text>
                          {bid.createdAt ? (
                            <Text style={[styles.bidderPlace, isRTL && styles.bidderPlaceRTL]}>
                              {new Date(bid.createdAt).toLocaleString()}
                            </Text>
                          ) : null}
                        </View>

                        <View style={[styles.bidAmounts, isRTL && styles.bidAmountsRTL]}>
                          <Text style={[styles.bidAmountMain, isRTL && styles.bidAmountMainRTL]}>{amount}</Text>
                          {previous ? (
                            <Text style={[styles.bidAmountSecondary, isRTL && styles.bidAmountSecondaryRTL]}>
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
                <Text style={[styles.descriptionText, isRTL && styles.descriptionTextRTL]}>
                  {t('itemDetails.noBidsYet')}
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
                        <Text style={[styles.bidderName, isRTL && styles.bidderNameRTL]}>{bidderName}</Text>
                        {bid.createdAt ? (
                          <Text style={[styles.bidderPlace, isRTL && styles.bidderPlaceRTL]}>
                            {new Date(bid.createdAt).toLocaleString()}
                          </Text>
                        ) : null}
                      </View>

                      <View style={[styles.bidAmounts, isRTL && styles.bidAmountsRTL]}>
                        <Text style={[styles.bidAmountMain, isRTL && styles.bidAmountMainRTL]}>{amount}</Text>
                        {previous ? (
                          <Text style={[styles.bidAmountSecondary, isRTL && styles.bidAmountSecondaryRTL]}>
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
            onPlaceBid={amount => {
              const idToUse = auctionId || item?._id || (item as any)?.id || '';
              console.log('Placing bid with auctionId:', idToUse, 'amount:', amount);
              placeBid(idToUse, amount);
            }}
            isSubmitting={isSubmittingBid}
          />
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
