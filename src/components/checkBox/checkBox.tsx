import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Check } from 'lucide-react-native';
import { styles } from './styles';
import { appColors } from '../../utils/appColors';

interface CheckBoxProps {
  checked: boolean;
  onToggle: () => void;
  label?: string;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  disabled?: boolean;
}

export default function CheckBox({
  checked,
  onToggle,
  label,
  containerStyle,
  labelStyle,
  disabled = false,
}: CheckBoxProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.row, containerStyle, disabled && styles.disabled]}
      onPress={onToggle}
      disabled={disabled}
    >
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked ? (
          <Check size={14} color={appColors.buttonText} strokeWidth={3} />
        ) : null}
      </View>
      {label ? (
        <Text style={[styles.label, labelStyle]} numberOfLines={2}>
          {label}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
}
