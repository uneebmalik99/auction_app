import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles';
import { Input, Button, Header } from '../../components';
import type { AuthScreenNavigationProp } from '../../utils/types';

export default function ForgetPassword() {
  const navigation = useNavigation<AuthScreenNavigationProp>();
  const [email, setEmail] = useState('');

  const handleSendLink = () => {
    // TODO: hook up to real API for sending reset email
    // eslint-disable-next-line no-console
    console.log('Send password reset link to', email);
  };

  const handleBackToSignIn = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Header titleKey="forgotPassword.title" />

      <Text style={styles.title}>Forgot password?</Text>
      <Text style={styles.subtitle}>
        Enter the email associated with your account and we&apos;ll send you a
        link to reset your password.
      </Text>

      <Input
        label="Email address"
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <Button
        label="Send reset link"
        onPress={handleSendLink}
        buttonStyle={styles.primaryButton}
      />

      <Button
        label="Back to sign in"
        variant="secondary"
        onPress={handleBackToSignIn}
        buttonStyle={styles.secondaryButton}
      />
    </View>
  );
}
