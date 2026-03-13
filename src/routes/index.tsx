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
import CustomerBottomTabs from './bottomTabs/clientBottomTabs/clientBottomTabs';
import AdminBottomTabs from './bottomTabs/adminBotttomTabs/adminBottomTabs';
import type { RootStackParamList } from '../utils/types';
import screenNames from './routes';
import { getItem } from '../utils/methods';
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
        const token = await getItem<string>('auth_token');
        const role = await getItem<string | number>('user_role');

        console.log('token from AsyncStorage', token);
        console.log('role from AsyncStorage', role);

        if (token) {
          let data = await fetchCurrentUser(token);
          console.log('res', data);
          setToken(token);
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

          const userRole = normalizedUser?.user?.role ?? role;
          if (userRole === 2 || userRole === 0) {
            setInitialRoute(screenNames.adminHomeTab);
          } else if (userRole === 4) {
            setInitialRoute(screenNames.brokerHomeTab);
          } else {
            setInitialRoute(screenNames?.customerHomeTab);
          }
        } else {
          setInitialRoute(screenNames.welcome);
        }
      } catch (error) {
        console.log('No saved token or error:', error);
        setInitialRoute(screenNames.welcome);
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, []);


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
          name={screenNames.customerHomeTab}
          component={CustomerBottomTabs}
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
