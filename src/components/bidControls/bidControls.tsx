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
  Animated,
  Easing,
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
  isSubmitting?: boolean; // Loading state when bid is being submitted
}

export default function BidControls({
  step = 100,
  currentBid = 0,
  startingPrice = 0,
  onPlaceBid,
  disabled = false,
  isSubmitting = false,
}: BidControlsProps) {
  const [bidAmount, setBidAmount] = useState<number>(0);
  const inputRef = useRef<TextInput>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const dot1Anim = useRef(new Animated.Value(0.3)).current;
  const dot2Anim = useRef(new Animated.Value(0.3)).current;
  const dot3Anim = useRef(new Animated.Value(0.3)).current;
  const dotAnimationsRef = useRef<Animated.CompositeAnimation[]>([]);

  // Sync bidAmount whenever currentBid or step changes (e.g., outbid)
  useEffect(() => {
    const base = Math.max(currentBid, startingPrice);
    const nextValid = base + step;
    setBidAmount(nextValid);
  }, [currentBid, startingPrice, step]);

  // Animate text when submitting
  useEffect(() => {
    console.log('BidControls isSubmitting changed:', isSubmitting);
    if (isSubmitting) {
      // Fade in and scale up animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();

      // Animate dots in sequence (pulsing effect)
      const createDotAnimation = (dotAnim: Animated.Value, delay: number) => {
        return Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(dotAnim, {
              toValue: 1,
              duration: 400,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(dotAnim, {
              toValue: 0.3,
              duration: 400,
              easing: Easing.in(Easing.ease),
              useNativeDriver: true,
            }),
          ])
        );
      };

      // Stop any existing animations
      dotAnimationsRef.current.forEach(anim => anim.stop());
      dotAnimationsRef.current = [];

      // Start new animations
      const anim1 = createDotAnimation(dot1Anim, 0);
      const anim2 = createDotAnimation(dot2Anim, 200);
      const anim3 = createDotAnimation(dot3Anim, 400);
      
      anim1.start();
      anim2.start();
      anim3.start();
      
      dotAnimationsRef.current = [anim1, anim2, anim3];
    } else {
      // Fade out animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();

      // Stop animations and reset dots
      dotAnimationsRef.current.forEach(anim => anim.stop());
      dotAnimationsRef.current = [];
      dot1Anim.setValue(0.3);
      dot2Anim.setValue(0.3);
      dot3Anim.setValue(0.3);
    }

    // Cleanup on unmount
    return () => {
      dotAnimationsRef.current.forEach(anim => anim.stop());
      dotAnimationsRef.current = [];
    };
  }, [isSubmitting]);

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

  const handleBidAmountChange = (text: string) => {
    // Remove any non-numeric characters except decimal point
    const cleaned = text.replace(/[^0-9.]/g, '');
    const numValue = parseFloat(cleaned) || 0;
    setBidAmount(numValue);
  };

  const handlePlaceBid = () => {
    // Prevent multiple submissions
    if (isSubmitting || disabled) {
      return;
    }

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
          disabled={disabled || isSubmitting}
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
            onChangeText={handleBidAmountChange}
            keyboardType="numeric"
            placeholder="Enter amount"
            placeholderTextColor={appColors.textMuted}
            editable={!disabled && !isSubmitting}
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
          disabled={disabled || isSubmitting}
        >
          <Text style={styles.adjustIcon}>+</Text>
          <Text style={styles.adjustText}>{formattedStep}</Text>
        </TouchableOpacity>
      </View>

      {/* Place Bid Button or Animated Text */}
      <View style={{ position: 'relative', minHeight: 50 }}>
        {/* Button - hidden when submitting */}
        <Animated.View
          style={{
            opacity: isSubmitting ? 0 : 1,
            position: isSubmitting ? 'absolute' : 'relative',
            width: '100%',
            pointerEvents: isSubmitting ? 'none' : 'auto',
          }}
        >
          <Button
            label="Make a bid"
            onPress={handlePlaceBid}
            buttonStyle={styles.makeBidButton}
            disabled={disabled || isSubmitting}
          />
        </Animated.View>

        {/* Animated Text - shown when submitting */}
        <Animated.View
          style={[
            styles.placingBidContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
              position: isSubmitting ? 'relative' : 'absolute',
              width: '100%',
              pointerEvents: isSubmitting ? 'auto' : 'none',
            },
          ]}
        >
          <View style={styles.placingBidContent}>
            <View style={styles.loadingDots}>
              <Animated.View
                style={[
                  styles.dot,
                  {
                    opacity: dot1Anim,
                  },
                ]}
              />
              <Animated.View
                style={[
                  styles.dot,
                  {
                    opacity: dot2Anim,
                  },
                ]}
              />
              <Animated.View
                style={[
                  styles.dot,
                  {
                    opacity: dot3Anim,
                  },
                ]}
              />
            </View>
            <Text style={styles.placingBidText}>Placing your bid...</Text>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

// Local styles for the input (you can merge into your main styles file)
