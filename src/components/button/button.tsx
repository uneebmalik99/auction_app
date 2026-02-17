import React from 'react';
import {
  ActivityIndicator,
  GestureResponderEvent,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';
import { styles } from './styles';

export type ButtonVariant = 'primary' | 'secondary' | 'disabled';

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  onPress?: (event: GestureResponderEvent) => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
}

export default function AppButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  buttonStyle,
  textStyle,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading || variant === 'disabled';

  const variantStyle =
    variant === 'primary' ? styles.primary : styles.secondary;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={isDisabled}
      style={[
        styles.base,
        variantStyle,
        isDisabled && styles.disabled,
        buttonStyle,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color="#ffffff" />
      ) : (
        <Text style={[styles.label, textStyle]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}
