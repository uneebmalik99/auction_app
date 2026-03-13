import React, { useState } from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { styles } from './styles';
import { Header, PasswordInput, Button, LoadingModal } from '../../components';
import { changePassword } from '../../api/autentication';
import { showErrorToast, showSuccessToast } from '../../utils/methods';
import { useNavigation } from '@react-navigation/native';
import { RootNavigationProp } from '../../utils/types';
import { useI18n } from '../../i18n';

export default function ChangePassword() {
  const navigation = useNavigation<RootNavigationProp>();
  const { t, isRTL } = useI18n();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const resetState = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleSave = async () => {
    setLoading(true);
    // TODO: hook up to real update-password API
    // eslint-disable-next-line no-console
    console.log('Change password', {
      currentPassword,
      newPassword,
      confirmPassword,
    });
    if (currentPassword && newPassword && confirmPassword) {
      if (newPassword !== confirmPassword) {
        console.log('New password and confirm password do not match');
        showErrorToast(t('changePassword.passwordMismatch'));
        setLoading(false);
        return;
      } else {
        console.log('New password and confirm password match');
        try {
          let res: any = await changePassword(
            currentPassword,
            newPassword,
            confirmPassword,
          );

          if (res?.message === 'Password changed successfully') {
            showSuccessToast(t('changePassword.success'));
            resetState();
            navigation.goBack();
          } else {
            showErrorToast(t('changePassword.failed'));
          }
        } catch (error) {
          showErrorToast(
            t('changePassword.failed'),
            error instanceof Error ? error.message : undefined,
          );
          console.log('error', error);
        } finally {
          setLoading(false);
        }
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header titleKey="changePassword.title" />
      <View style={styles.container}>
        <Text style={[styles.title, isRTL && styles.titleRTL]}>{t('changePassword.pageTitle')}</Text>
        <Text style={[styles.subtitle, isRTL && styles.subtitleRTL]}>
          {t('changePassword.subtitle')}
        </Text>

        <View style={styles.formSection}>
          <PasswordInput
            label={t('changePassword.currentPassword')}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="••••••••"
          />
          <PasswordInput
            label={t('changePassword.newPassword')}
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="••••••••"
          />
          <PasswordInput
            label={t('changePassword.confirmPassword')}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="••••••••"
          />
        </View>

        <Button
          label={t('changePassword.saveButton')}
          onPress={handleSave}
          buttonStyle={styles.primaryButton}
          loading={loading}
        />

        <LoadingModal visible={loading} message={t('changePassword.updating')} />
      </View>
    </SafeAreaView>
  );
}
