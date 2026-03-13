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
import { useI18n } from '../../i18n';

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
  const { isRTL } = useI18n();

  const handleToggleVisibility = () => {
    setSecure(prev => !prev);
  };

  return (
    <View style={styles.container}>
      {label ? <Text style={[styles.label, isRTL && styles.labelRTL]}>{label}</Text> : null}

      <View style={[styles.inputWrapper, isRTL && styles.inputWrapperRTL]}>
        <TextInput
          style={[styles.input, isRTL && styles.inputRTL, style]}
          placeholderTextColor="#6b7280"
          secureTextEntry={secure}
          autoCapitalize="none"
          autoCorrect={false}
          textAlign={isRTL ? 'right' : 'left'}
          {...rest}
        />

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleToggleVisibility}
          style={[styles.toggleButton, isRTL && styles.toggleButtonRTL]}
        >
          {secure ? (
            <Eye size={18} color={appColors.textSecondary} />
          ) : (
            <EyeOff size={18} color={appColors.textSecondary} />
          )}
        </TouchableOpacity>
      </View>

      {error ? <Text style={[styles.error, isRTL && styles.errorRTL]}>{error}</Text> : null}
    </View>
  );
}
