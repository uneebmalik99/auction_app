import React, { useState } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Animated,
  Easing,
} from 'react-native';
import { Plus, X } from 'lucide-react-native';
import styles from './styles';
import { appColors } from '../../utils/appColors';

interface FloatingActionButtonProps {
  onPress: () => void;
  // Background color
  size?: number; // Diameter of FAB
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onPress,
  // Your app primary color
  size = 60,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const spinValue = new Animated.Value(0);

  const handlePress = () => {
    setIsOpen(!isOpen);

    // Rotate animation
    Animated.timing(spinValue, {
      toValue: isOpen ? 0 : 1,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();

    onPress();
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  return (
    <TouchableOpacity
      style={[
        styles.fab,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Plus size={size * 0.5} color={appColors.buttonText} strokeWidth={3} />

      {/* <Animated.View style={{ transform: [{ rotate: spin }] }}>
        {isOpen ? (
          <X size={size * 0.5} color="#FFFFFF" strokeWidth={3} />
        ) : (
          <Plus size={size * 0.5} color="#FFFFFF" strokeWidth={3} />
        )}
      </Animated.View> */}
    </TouchableOpacity>
  );
};

export default FloatingActionButton;
