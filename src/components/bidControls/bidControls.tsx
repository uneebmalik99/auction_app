// components/BidControls.tsx
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
  Platform,
} from 'react-native';
import Button from '../button/button'; // Adjust path as needed
import { styles } from './styles';
import { appColors } from '../../utils/appColors';

interface BidControlsProps {
  step: number;
  currentBid?: number; // Real-time highest bid from socket
  startingPrice?: number; // Fallback if no bids yet
  onPlaceBid: (amount: number) => void; // Called when user confirms bid
  disabled?: boolean;
}

export default function BidControls({
  step = 100,
  currentBid = 0,
  startingPrice = 0,
  onPlaceBid,
  disabled = false,
}: BidControlsProps) {
  const [bidAmount, setBidAmount] = useState<number>(0);
  const inputRef = useRef<TextInput>(null);

  // Sync bidAmount whenever currentBid or step changes (e.g., outbid)
  useEffect(() => {
    const base = Math.max(currentBid, startingPrice);
    const nextValid = base + step;
    setBidAmount(nextValid);
  }, [currentBid, startingPrice, step]);

  // Handlers
  const handleDecrease = () => {
    const minAllowed = Math.max(currentBid, startingPrice) + step;
    const newAmount = bidAmount - step;
    if (newAmount >= minAllowed) {
      setBidAmount(newAmount);
    } else {
      Alert.alert(
        'Invalid',
        `Minimum bid is $${minAllowed.toLocaleString('en-US')}`,
      );
    }
  };

  const handleIncrease = () => {
    setBidAmount(bidAmount + step);
  };

  const handlePlaceBid = () => {
    const minAllowed = Math.max(currentBid, startingPrice) + step;

    if (bidAmount < minAllowed) {
      Alert.alert(
        'Bid Too Low',
        `Your bid must be at least $${minAllowed.toLocaleString('en-US')}`,
      );
      return;
    }

    if (bidAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid bid amount');
      return;
    }

    console.log('Placing bid bid control', bidAmount);

    onPlaceBid(bidAmount);
  };

  // Formatting
  const formatPrice = (amount: number) => amount.toLocaleString('en-US');
  const displayCurrent = Math.max(currentBid, startingPrice);
  const formattedCurrent = `${formatPrice(displayCurrent)} $`;
  const formattedStep = `${formatPrice(step)} $`;
  const formattedBid = bidAmount > 0 ? formatPrice(bidAmount) : '';

  return (
    <View style={styles.bottomCard}>
      <View style={styles.bidControlsRow}>
        {/* Decrease Button */}
        <TouchableOpacity
          style={styles.adjustButton}
          activeOpacity={0.7}
          onPress={handleDecrease}
          disabled={disabled}
        >
          <Text style={styles.adjustIcon}>-</Text>
          <Text style={styles.adjustText}>{formattedStep}</Text>
        </TouchableOpacity>

        {/* Input + Current Bid Display */}
        <View style={styles.inputContainer}>
          {/* User's bid input */}
          <TextInput
            ref={inputRef}
            style={styles.bidInput}
            value={formattedBid}
            onChangeText={setBidAmount}
            keyboardType="numeric"
            placeholder="Enter amount"
            placeholderTextColor={appColors.textMuted}
            editable={!disabled}
            selectTextOnFocus
          />

          {/* Current highest bid label */}
          <Text style={styles.currentBidLabel}>
            Current: {formattedCurrent}
          </Text>

          {/* Min increment hint */}
          <Text style={styles.minIncrementText}>Min step: {formattedStep}</Text>
        </View>

        {/* Increase Button */}
        <TouchableOpacity
          style={[styles.adjustButton, styles.adjustButtonPlus]}
          activeOpacity={0.8}
          onPress={handleIncrease}
          disabled={disabled}
        >
          <Text style={styles.adjustIcon}>+</Text>
          <Text style={styles.adjustText}>{formattedStep}</Text>
        </TouchableOpacity>
      </View>

      {/* Place Bid Button */}
      <Button
        label="Make a bid"
        onPress={handlePlaceBid}
        buttonStyle={styles.makeBidButton}
        disabled={disabled}
      />
    </View>
  );
}

// Local styles for the input (you can merge into your main styles file)
