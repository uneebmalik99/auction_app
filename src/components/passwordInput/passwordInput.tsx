import React, { useState } from 'react';
import {
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { styles } from './stytles';
import { appColors } from '../../utils/appColors';

interface PasswordInputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export default function PasswordInput({
  label,
  error,
  style,
  ...rest
}: PasswordInputProps) {
  const [secure, setSecure] = useState(true);

  const handleToggleVisibility = () => {
    setSecure(prev => !prev);
  };

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor="#6b7280"
          secureTextEntry={secure}
          autoCapitalize="none"
          autoCorrect={false}
          {...rest}
        />

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleToggleVisibility}
          style={styles.toggleButton}
        >
          {secure ? (
            <Eye size={18} color={appColors.textSecondary} />
          ) : (
            <EyeOff size={18} color={appColors.textSecondary} />
          )}
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}
