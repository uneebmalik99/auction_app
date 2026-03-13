import React, { ReactNode } from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';
import { styles } from './styles';
import { useI18n } from '../../i18n';

interface InputProps extends TextInputProps {
  label?: string | ReactNode;
  error?: string;
}

export default function AppInput({ label, error, style, ...rest }: InputProps) {
  const { isRTL } = useI18n();
  
  return (
    <View style={styles.container}>
      {label ? (
        typeof label === 'string' ? (
          <Text style={[styles.label, isRTL && styles.labelRTL]}>{label}</Text>
        ) : (
          <View style={styles.labelContainer}>{label}</View>
        )
      ) : null}
      <TextInput
        style={[styles.input, isRTL && styles.inputRTL, style]}
        placeholderTextColor="#6b7280"
        textAlign={isRTL ? 'right' : 'left'}
        {...rest}
      />
      {error ? <Text style={[styles.error, isRTL && styles.errorRTL]}>{error}</Text> : null}
    </View>
  );
}
