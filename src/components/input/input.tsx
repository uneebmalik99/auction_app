import React from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';
import { styles } from './styles';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export default function AppInput({ label, error, style, ...rest }: InputProps) {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor="#6b7280"
        {...rest}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}
