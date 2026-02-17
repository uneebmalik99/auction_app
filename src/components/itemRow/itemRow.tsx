// AuctionItemRow.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CountDown from '../countDown/countDown';
import { appColors } from '../../utils/appColors';
import { AuctionItem } from '../../utils/types';
import { styles } from './styles';
import { Dot } from 'lucide-react-native';

interface AuctionItemRowProps {
  item: AuctionItem;
}

export default function AuctionItemRow({ item }: AuctionItemRowProps) {
  return (
    <View style={styles.itemRow}>
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemSubtitle}>
          {item.make} {item.model}
        </Text>
        <Text style={styles.itemSubtitle}>VIN: {item.vin}</Text>
      </View>

      <View style={styles.timeStatusContainer}>
        <View style={styles.itemStatusContainer}>
          {item.status === 'live' && <View style={styles.dot} />}
          <Text
            style={[
              styles.itemStatus,
              {
                color:
                  item.status === 'live'
                    ? appColors.green
                    : item.status === 'upcoming' || item.status === 'pending'
                    ? appColors.yellow
                    : appColors.red,
              },
            ]}
          >
            {item.status.toUpperCase()}
          </Text>
        </View>

        <CountDown
          biddingStartsAt={item.biddingStartsAt}
          biddingEndsAt={item.biddingEndsAt}
          label={true}
        />
      </View>
    </View>
  );
}
