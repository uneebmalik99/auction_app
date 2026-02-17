import React, { useState } from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { styles } from './styles';
import { Header, PasswordInput, Button, LoadingModal } from '../../components';
import { changePassword } from '../../api/autentication';
import { showErrorToast, showSuccessToast } from '../../utils/methods';
import { useNavigation } from '@react-navigation/native';
import { RootNavigationProp } from '../../utils/types';

export default function ChangePassword() {
  const navigation = useNavigation<RootNavigationProp>();
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
        showErrorToast('Password mismatch');
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
            showSuccessToast('Password updated successfully');
            resetState();
            navigation.goBack();
          } else {
            showErrorToast('Failed to update password');
          }
        } catch (error) {
          showErrorToast(
            'Failed to update password',
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
        <Text style={styles.title}>Change password</Text>
        <Text style={styles.subtitle}>
          For your security, please enter your current password and choose a new
          one.
        </Text>

        <View style={styles.formSection}>
          <PasswordInput
            label="Current password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="••••••••"
          />
          <PasswordInput
            label="New password"
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="••••••••"
          />
          <PasswordInput
            label="Confirm new password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="••••••••"
          />
        </View>

        <Button
          label="Save new password"
          onPress={handleSave}
          buttonStyle={styles.primaryButton}
          loading={loading}
        />

        <LoadingModal visible={loading} message="Updating password..." />
      </View>
    </SafeAreaView>
  );
}
