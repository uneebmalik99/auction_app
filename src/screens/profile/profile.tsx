import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Edit3 } from 'lucide-react-native';
import { styles } from './styles';
import {
  Button,
  ConfirmationModal,
  Header,
  LoadingModal,
  Dropdown,
} from '../../components';
import { appColors } from '../../utils/appColors';
import { useI18n } from '../../i18n';
import type { RootNavigationProp } from '../../utils/types';
import screenNames from '../../routes/routes';
import { deleteAccount, logout, setAuthToken } from '../../api/autentication';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { clearUser } from '../../redux/profileSlice';
import { getItem, removeItem, showErrorToast } from '../../utils/methods';
import * as Keychain from 'react-native-keychain';

export default function Profile() {
  const navigation = useNavigation<RootNavigationProp>();
  const dispatch = useAppDispatch();
  const { language, setLanguage, t } = useI18n();
  const [loggingOut, setLoggingOut] = useState(false);
  const user = useAppSelector(state => state.profile.user);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [isConfirmingDeleteAccount, setIsConfirmingDeleteAccount] =
    useState(false);

  console.log('user', user);
  const handleEditProfile = () => {
    navigation.navigate(screenNames.editProfile);
  };

  const handleChangePassword = () => {
    navigation.navigate(screenNames.changePassword);
  };

  const handlePrivacyPolicy = () => {
    console.log('Open privacy policy');
    navigation.navigate(screenNames.privacyPolicies);
  };

  const handleHelpSupport = () => {
    navigation.navigate(screenNames.helpSupport);
  };

  const handleLogout = async () => {
    if (loggingOut) {
      return;
    }

    try {
      setLoggingOut(true);

      // Read stored auth token from AsyncStorage
      const token = await getItem<string>('auth_token');

      const logoutResponse = await logout(token || undefined);
      console.log('logoutResponse', logoutResponse);
      if (logoutResponse?.message === 'Logged out successfully') {
        // await Keychain.resetGenericPassword();

        // Clear token everywhere
        await setAuthToken(null);
        await removeItem('auth_token');

        dispatch(clearUser());

        navigation.reset({
          index: 0,
          routes: [{ name: screenNames.authentication as 'Authentication' }],
        });
      } else {
        showErrorToast(
          logoutResponse?.message || 'Unable to log out. Please try again.',
        );
        setLoggingOut(false);
      }
    } catch (error) {
      console.error('Logout error', error);
      Alert.alert(
        'Logout failed',
        error instanceof Error
          ? error.message
          : 'Unable to log out. Please try again.',
      );
    } finally {
      setLoggingOut(false);
    }
  };

  const handleConfirmDeleteAccount = () => {
    setIsConfirmingDeleteAccount(true);
  };

  const handleDeleteAccount = async () => {
    setIsConfirmingDeleteAccount(false);
    setTimeout(() => {
      setDeletingAccount(true);
    }, 300);

    try {
      const deleteAccountResponse: any = await deleteAccount();
      console.log('deleteAccountResponse', deleteAccountResponse);

      if (deleteAccountResponse?.message === 'Account deleted successfully') {
        await setAuthToken(null);
        await removeItem('auth_token');

        dispatch(clearUser());

        navigation.reset({
          index: 0,
          routes: [{ name: screenNames.authentication as 'Authentication' }],
        });
      }
    } catch (error) {
      console.error('Delete account error', error);
      Alert.alert(
        'Delete account failed',
        error instanceof Error
          ? error.message
          : 'Unable to delete account. Please try again.',
      );
    }
  };

  const handleContactUs = () => {
    console.log('Contact us');
  };

  const displayName = user?.name ?? '---';
  const displayEmail = user?.email ?? '---';

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title={t('profile.title')} showBackButton={false} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.avatarWrapper}>
            {user?.profileImage ? (
              <Image
                source={{ uri: user?.profileImage }}
                style={styles.avatarCircle}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarInitial}>
                  {displayName?.charAt(0).toUpperCase() || '?'}
                </Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.editIconButton}
              onPress={handleEditProfile}
            >
              <Edit3 size={18} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={styles.nameText}>{displayName}</Text>
          <Text style={styles.emailText}>{displayEmail}</Text>
        </View>

        <View style={styles.actionsContainer}>
          <Dropdown
            label={t('common.language')}
            options={[
              { label: t('common.english'), value: 'en' },
              { label: t('common.arabic'), value: 'ar' },
            ]}
            value={language}
            onChange={val => setLanguage(String(val) as any)}
          />

          <Button
            label={t('profile.changePassword')}
            onPress={handleChangePassword}
            buttonStyle={styles.primaryButton}
          />

          <Button
            label={t('profile.contactUs')}
            variant="secondary"
            onPress={handleContactUs}
            buttonStyle={styles.secondaryButton}
            textStyle={styles.logoutText}
          />

          <Button
            label={t('profile.helpSupport')}
            variant="secondary"
            onPress={handleHelpSupport}
            buttonStyle={styles.secondaryButton}
            textStyle={styles.logoutText}
          />

          <Button
            label={t('profile.privacyPolicy')}
            variant="secondary"
            onPress={handlePrivacyPolicy}
            buttonStyle={styles.secondaryButton}
            textStyle={styles.logoutText}
          />

          <Button
            label={loggingOut ? t('profile.loggingOut') : t('profile.logout')}
            variant="secondary"
            onPress={handleLogout}
            buttonStyle={styles.secondaryButton}
            disabled={loggingOut}
            textStyle={styles.logoutText}
          />

          <Button
            label={deletingAccount ? t('profile.deletingAccount') : t('profile.deleteAccount')}
            variant="secondary"
            onPress={handleConfirmDeleteAccount}
            buttonStyle={styles.secondaryButton}
            loading={deletingAccount}
            disabled={deletingAccount}
            textStyle={styles.deleteAccountText}
          />
        </View>
      </ScrollView>

      <LoadingModal visible={loggingOut} message="Logging out..." />

      <LoadingModal visible={deletingAccount} message="Deleting account..." />

      <ConfirmationModal
        isVisible={isConfirmingDeleteAccount}
        title="Confirm delete account"
        message="Are you sure you want to delete your account? This action cannot be undone."
        confirmText="Delete account"
        cancelText="Cancel"
        onConfirm={handleDeleteAccount}
        onCancel={() => setIsConfirmingDeleteAccount(false)}
      />
    </SafeAreaView>
  );
}
