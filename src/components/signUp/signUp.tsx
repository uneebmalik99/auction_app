import React, { useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { styles } from './styles';
import Input from '../input/input';
import PasswordInput from '../passwordInput/passwordInput';
import Button from '../button/button';
import CheckBox from '../checkBox/checkBox';
import Dropdown, { DropdownValue } from '../dropdown/dropdown';
import type { AuthTab } from '../../utils/types';
import { signUp } from '../../api/autentication';
import LoadingModal from '../loadingModal/loadingModal';
import { useI18n } from '../../i18n';

interface AuthTabProps {
  activeTab: AuthTab;
  setActiveTab: (tab: AuthTab) => void;
}

export default function SignUp({ activeTab, setActiveTab }: AuthTabProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<DropdownValue>('customer');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const { t } = useI18n();

  const handleSubmit = async () => {
    if (!name || !email || !password || !confirmPassword || !phone || !address) {
      Alert.alert(t('signUp.missingTitle'), t('signUp.missingMsg'));
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(t('signUp.passwordMismatchTitle'), t('signUp.passwordMismatchMsg'));
      return;
    }

    if (!acceptedTerms) {
      Alert.alert(t('signUp.termsRequiredTitle'), t('signUp.termsRequiredMsg'));
      return;
    }

    const selectedRole = Array.isArray(role) ? role[0] : role;

    try {
      setLoading(true);
      const signUpRes = await signUp({
        name,
        email,
        password,
        password_confirmation: confirmPassword,
        role: selectedRole,
        phone,
        address,
      });

      if (signUpRes && (signUpRes.user || signUpRes.token)) {
        Alert.alert(t('signUp.createdTitle'), t('signUp.createdMsg'), [
          {
            text: 'OK',
            onPress: () => setActiveTab('signIn'),
          },
        ]);
      } else {
        Alert.alert(
          t('signUp.failedTitle'),
          t('signUp.failedMsg'),
        );
      }
    } catch (error) {
      console.error('Sign up error', error);
      Alert.alert(
        t('signUp.failedTitle'),
        error instanceof Error
          ? error.message
          : t('signUp.failedMsg'),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 24 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.headerText}>{t('signUp.header')}</Text>

      <Input
        label={t('signUp.fullName')}
        value={name}
        onChangeText={setName}
        placeholder="John Doe"
      />

      <Input
        label={t('signIn.email')}
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <Input
        label={t('signUp.phone')}
        value={phone}
        onChangeText={setPhone}
        placeholder="Your phone number"
      />

      <Input
        label={t('signUp.address')}
        value={address}
        onChangeText={setAddress}
        placeholder="Your address"
      />

      <Dropdown
        label={t('signUp.role')}
        options={[
          { label: t('signUp.role.customer'), value: 'customer' },
          { label: t('signUp.role.admin'), value: 'admin' },
        ]}
        value={role}
        onChange={setRole}
        multiple={false}
      />

      <PasswordInput
        label={t('signIn.password')}
        value={password}
        onChangeText={setPassword}
        placeholder="••••••••"
      />

      <PasswordInput
        label={t('signUp.confirmPassword')}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="••••••••"
      />

      <CheckBox
        checked={acceptedTerms}
        onToggle={() => setAcceptedTerms(prev => !prev)}
        label={t('signUp.termsAgree')}
        containerStyle={styles.checkboxRow}
        labelStyle={styles.checkboxLabel}
      />

      <View style={styles.helperRow}>
        <Text style={styles.helperText}>
          {t('signUp.termsHelper')}
        </Text>
      </View>

      <Button
        label={loading ? t('signUp.creating') : t('signUp.create')}
        onPress={handleSubmit}
        disabled={!acceptedTerms || loading}
        buttonStyle={styles.submitButton}
      />
      <Button
        label={t('signUp.haveAccount')}
        onPress={() => setActiveTab('signIn')}
        buttonStyle={styles.submitButton}
        variant="secondary"
        disabled={loading}
      />

      <LoadingModal visible={loading} message={t('signUp.creating')} />
    </ScrollView>
  );
}
