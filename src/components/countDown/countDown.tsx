import React, { useEffect, useRef, useState } from 'react';
import { View, Text } from 'react-native';
import { AuctionItem } from '../../utils/types';
import { formatRemainingTime } from '../../utils/methods';
import styles from './styles';

export default function CountDown({
  biddingStartsAt,
  biddingEndsAt,
  label,
}: {
  biddingStartsAt: string | undefined;
  biddingEndsAt: string | undefined;
  label: boolean;
}) {
  const [now, setNow] = useState(Date.now());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    // Always run the timer if at least one date is provided
    if (!biddingStartsAt && !biddingEndsAt) {
      return;
    }

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Set up interval to update every second
    intervalRef.current = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    // Cleanup on unmount or when dates change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [biddingStartsAt, biddingEndsAt]);

  let computedFooterLabel: string | undefined;
  let computedFooterValue: string | undefined;

  if (biddingStartsAt !== undefined || biddingEndsAt !== undefined) {
    if (biddingStartsAt && now < Date.parse(biddingStartsAt || '')) {
      computedFooterLabel = 'Starts in';
      computedFooterValue = formatRemainingTime(
        Date.parse(biddingStartsAt || ''),
        now || Date.now(),
      );
    } else if (biddingEndsAt && now < Date.parse(biddingEndsAt || '')) {
      computedFooterLabel = 'Ends in';
      computedFooterValue = formatRemainingTime(
        Date.parse(biddingEndsAt || ''),
        now || Date.now(),
      );
    } else if (biddingStartsAt && !biddingEndsAt) {
      computedFooterLabel = 'Starts in';
      computedFooterValue = formatRemainingTime(
        Date.parse(biddingStartsAt || ''),
        now || Date.now(),
      );
    }
  }
  return (
    <View style={styles.footerRow}>
      <Text style={styles.footerLabel}>{computedFooterLabel}</Text>
      <Text style={styles.footerValue}>{computedFooterValue}</Text>
    </View>
  );
}
