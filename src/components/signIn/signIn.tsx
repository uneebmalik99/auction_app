import React, { useState } from 'react';
import { Alert, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles';
import Input from '../input/input';
import PasswordInput from '../passwordInput/passwordInput';
import Button from '../button/button';
import type { AuthScreenNavigationProp, AuthTab } from '../../utils/types';
import screenNames from '../../routes/routes';
import { signIn, setAuthToken } from '../../api/autentication';
import { useAppDispatch } from '../../redux/hooks';
import { setUser } from '../../redux/profileSlice';
import { saveItem } from '../../utils/methods';
import LoadingModal from '../loadingModal/loadingModal';
import { useI18n } from '../../i18n';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import CheckBox from '../checkBox/checkBox';
import * as Keychain from 'react-native-keychain';

interface AuthTabProps {
  activeTab: AuthTab;
  setActiveTab: (tab: AuthTab) => void;
}

export default function SignIn({ activeTab, setActiveTab }: AuthTabProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigation = useNavigation<AuthScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const { t } = useI18n();

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert(t('signIn.missingTitle'), t('signIn.missingMsg'));
      return;
    }

    try {
      setLoading(true);
      const data = await signIn({ email, password });

      if (data.token) {
        await setAuthToken(data.token);
        if (rememberMe) {
          await Keychain.setGenericPassword(
            data?.user?.role || '',
            data.token || '',
            // {
            //   accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY, // Requires biometrics
            //   accessible:
            //     Keychain.ACCESSIBLE.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY,
            //   //   // Optional: higher security
            //   //   // securityLevel: Keychain.SECURITY_LEVEL.SECURE_HARDWARE,
            // },
          );
        }
      }

      // Normalize favorites to an array of item IDs only
      const rawFavorites: any =
        (data.user as any).favorites ??
        (data.user as any).favoriteItems ??
        (data.user as any).favoriteVehicles ??
        [];

      let favoriteIds: string[] = [];
      if (Array.isArray(rawFavorites)) {
        favoriteIds = rawFavorites
          .map((fav: any) => {
            if (typeof fav === 'string' || typeof fav === 'number') {
              return String(fav);
            }
            // try common id fields from backend objects
            return (fav && (fav.vehicleId || fav._id || fav.id)) ?? null;
          })
          .filter((id: any): id is string => Boolean(id))
          .map(id => String(id));
      }

      const normalizedUser = {
        ...data.user,
        favorites: favoriteIds,
      };

      // store logged-in user (with favoriteIds) in redux
      console.log('normalizedUser', normalizedUser);
      dispatch(setUser(normalizedUser));

      const role: any = normalizedUser?.role;
      // const isAdmin = role === 2;

      console.log('data.token', data);

      // console.log('data.token', data.token, {
      //   accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY, // Requires biometrics
      //   accessible: Keychain.ACCESSIBLE.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY,
      //   // Optional: higher security
      //   // securityLevel: Keychain.SECURITY_LEVEL.SECURE_HARDWARE,
      // });

      await saveItem('auth_token', data.token || '');
      console.log('role', role);
      console.log('role type:', typeof role);
      // After successful login, reset to appropriate bottom tab screen
      if (role === 2 || role === 0) {
        console.log('sign in as admin');

        navigation.reset({
          index: 0,
          routes: [{ name: screenNames.adminHomeTab }],
        });
      } else if (role === 4) {
        navigation.reset({
          index: 0,
          routes: [{ name: screenNames.brokerHomeTab }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: screenNames.clientHomeTab }],
        });
      }
    } catch (error) {
      console.error('Sign in error', error);
      Alert.alert(
        t('signIn.failedTitle'),
        error instanceof Error ? error.message : t('signIn.failedMsg'),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const userInfo = await GoogleSignin.signIn();

      // Send userInfo.idToken to your backend for verification
      console.log('ID Token:', userInfo?.data?.idToken);
    } catch (error) {
      if ((error as any).code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert(t('signIn.cancelled'));
      } else if (
        (error as any).code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE
      ) {
        Alert.alert(t('signIn.playServicesNotAvailable'));
      } else {
        Alert.alert(t('signIn.error'), (error as any).message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate(screenNames.forgetPassword);
  };

  const toggleRememberMe = () => {
    setRememberMe(!rememberMe);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>{t('signIn.header')}</Text>

      <Input
        label={t('signIn.email')}
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <PasswordInput
        label={t('signIn.password')}
        value={password}
        onChangeText={setPassword}
        placeholder="••••••••"
      />

      <View style={styles.helperRow}>
        <CheckBox
          checked={rememberMe}
          onToggle={toggleRememberMe}
          label={t('signIn.rememberMe')}
          containerStyle={styles.checkboxRow}
          labelStyle={styles.checkboxLabel}
        />
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.helperText}>{t('signIn.forgotPassword')}</Text>
        </TouchableOpacity>
      </View>

      <Button
        label={loading ? t('signIn.signingIn') : t('signIn.signIn')}
        onPress={handleSubmit}
        buttonStyle={styles.submitButton}
        disabled={loading}
      />

      {/* <Button
        label={loading ? 'Signing in with Google...' : 'Sign in with Google'}
        onPress={handleGoogleSignIn}
        buttonStyle={styles.submitButton}
        disabled={loading}
      /> */}

      <Button
        label={t('signIn.createAccount')}
        onPress={() => setActiveTab('signUp')}
        buttonStyle={styles.submitButton}
        textStyle={styles.createAccountText}
        variant="secondary"
        disabled={loading}
      />

      <LoadingModal visible={loading} message={t('signIn.signingIn')} />
    </View>
  );
}
