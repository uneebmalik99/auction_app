import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {
  Authentication,
  ForgetPassword,
  Profile,
  EditProfile,
  HelpSupport,
  Faqs,
  ChangePassword,
  Welcome,
  NotificationsScreen,
  AddAuctionItem,
  LoadingScreen,
  PrivacyPolicies,
  ItemDetailsScreen,
  UserDetailsScreen,
  AdminUsers,
  AdminInvoices,
  BrokerChats,
  BrokerInvoices,
  BrokerAuctionItems,
} from '../screens';
import ClientBottomTabs from './bottomTabs/clientBottomTabs/clientBottomTabs';
import AdminBottomTabs from './bottomTabs/adminBotttomTabs/adminBottomTabs';
import type { RootStackParamList } from '../utils/types';
import screenNames from './routes';
import * as Keychain from 'react-native-keychain';
import { fetchCurrentUser } from '../api/autentication';
import { setUser } from '../redux/profileSlice';
import { useAppDispatch } from '../redux/hooks';
import VehicleChatScreen from '../screens/client/chatScreen/chatScreen';
import BrokerBottomTabs from './bottomTabs/brokerBottomTabs/brokerBottomTabs';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const checkToken = async () => {
      try {
        const credentials = await Keychain.getGenericPassword();

        console.log('credentials', credentials);

        if (credentials && credentials?.password) {
          let data = await fetchCurrentUser(credentials?.password);
          console.log('res', data);
          console.log('credentials', credentials);
          setToken(credentials?.password); // The token is in .password
          // Optionally validate token with backend (e.g., refresh if expired)

          const rawFavorites: any =
            (data as any).favorites ??
            (data as any).favoriteItems ??
            (data as any).favoriteVehicles ??
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
            ...data,
            favorites: favoriteIds,
          };

          // store logged-in user (with favoriteIds) in redux
          console.log('normalizedUser', normalizedUser);
          dispatch(setUser(normalizedUser?.user));

          if (credentials?.username === 'admin') {
            setInitialRoute(screenNames.adminHomeTab);
          } else {
            setInitialRoute(screenNames?.clientHomeTab);
          }
        } else {
          setInitialRoute(screenNames.welcome);
        }
      } catch (error) {
        console.log('No saved token or error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, []);

  // useEffect(() => {
  //   const checkTokenWithBiometrics = async () => {
  //     try {
  //       // This will trigger the native biometric prompt if credentials exist with accessControl
  //       const credentials = await Keychain.getGenericPassword({
  //         authenticationPrompt: {
  //           title: 'Authenticate',
  //           subtitle: 'Use biometrics to access your account',
  //           description: 'Confirm your identity',
  //           cancel: 'Cancel',
  //         },
  //       });

  //       console.log('credentials', credentials);

  //       if (credentials && credentials.password) {
  //         let res = await fetchCurrentUser(credentials.password);
  //         console.log('res', res);
  //         console.log('Biometric success:', credentials);

  //         setToken(credentials.password);

  //         if (credentials.username === 'admin') {
  //           setInitialRoute(screenNames.adminHomeTab);
  //         } else {
  //           setInitialRoute(screenNames.clientHomeTab);
  //         }
  //       } else {
  //         // No stored credentials
  //         setInitialRoute(screenNames.welcome);
  //       }
  //     } catch (error) {
  //       console.log('Biometric failed or canceled:', error);
  //       // User canceled, failed auth, or no biometrics set up → go to login
  //       setInitialRoute(screenNames.welcome);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   checkTokenWithBiometrics();
  // }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={
          (initialRoute as keyof RootStackParamList) || screenNames.welcome
        }
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name={screenNames.welcome} component={Welcome} />
        <Stack.Screen
          name={screenNames.authentication}
          component={Authentication}
        />
        <Stack.Screen
          name={screenNames.forgetPassword}
          component={ForgetPassword}
        />
        <Stack.Screen
          name={screenNames.adminHomeTab}
          component={AdminBottomTabs}
        />
        <Stack.Screen
          name={screenNames.brokerHomeTab}
          component={BrokerBottomTabs}
        />
        <Stack.Screen name={screenNames.profile} component={Profile} />
        <Stack.Screen name={screenNames.editProfile} component={EditProfile} />
        <Stack.Screen
          name={screenNames.helpSupport}
          component={HelpSupport}
        />
        <Stack.Screen name={screenNames.faqs} component={Faqs} />
        <Stack.Screen
          name={screenNames.clientHomeTab}
          component={ClientBottomTabs}
        />
        <Stack.Screen
          name={screenNames.changePassword}
          component={ChangePassword}
        />

        <Stack.Screen
          name={screenNames.notifications}
          component={NotificationsScreen}
        />
        <Stack.Screen
          name={screenNames.addAuctionItem}
          component={AddAuctionItem}
        />
        <Stack.Screen
          name={screenNames.privacyPolicies}
          component={PrivacyPolicies}
        />
        <Stack.Screen
          name={screenNames.itemDetails}
          component={ItemDetailsScreen}
        />
        <Stack.Screen
          name={screenNames.userDetails}
          component={UserDetailsScreen}
        />
        <Stack.Screen
          name={screenNames.chatScreen}
          component={VehicleChatScreen}
        />
        <Stack.Screen
          name={screenNames.adminUsers}
          component={AdminUsers}
        />
        <Stack.Screen
          name={screenNames.adminInvoices}
          component={AdminInvoices}
        />
        <Stack.Screen
          name={screenNames.brokerChats}
          component={BrokerChats}
        />
        <Stack.Screen
          name={screenNames.brokerInvoices}
          component={BrokerInvoices}
        />
        <Stack.Screen
          name={screenNames.brokerAuctionItems}
          component={BrokerAuctionItems}
        />
        </Stack.Navigator>
    </NavigationContainer>
  );
}
