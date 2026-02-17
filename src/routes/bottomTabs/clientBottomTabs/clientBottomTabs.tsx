import React from 'react';
// eslint-disable-next-line import/no-unresolved
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Gavel, Heart, User } from 'lucide-react-native';
import { appColors } from '../../../utils/appColors';
import ClientHome from '../../../screens/client/clientHome/clientHome';
import MyBids from '../../../screens/client/myBids/myBids';
import Favorites from '../../../screens/client/favorites/favorites';
import Profile from '../../../screens/profile/profile';
import screenNames from '../../routes';
import { useI18n } from '../../../i18n';

type ClientTabParamList = {
  ClientHome: undefined;
  MyBids: undefined;
  Favorites: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<ClientTabParamList>();

export default function ClientBottomTabs() {
  const { t } = useI18n();
  return (
    <Tab.Navigator
      screenOptions={({
        route,
      }: {
        route: { name: keyof ClientTabParamList };
      }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: appColors.surface,
          borderTopColor: appColors.inputBorder,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: appColors.primary,
        tabBarInactiveTintColor: appColors.textMuted,
        tabBarLabelStyle: {
          fontSize: 11,
        },
        tabBarIcon: ({
          color,
          size,
        }: {
          color: string;
          size: number;
          focused: boolean;
        }) => {
          switch (route.name) {
            case screenNames.clientHome:
              return <Home size={size} color={color} />;
            case screenNames.myBids:
              return <Gavel size={size} color={color} />;
            case screenNames.favorites:
              return <Heart size={size} color={color} />;
            case screenNames.profile:
            default:
              return <User size={size} color={color} />;
          }
        },
      })}
    >
      <Tab.Screen
        name={screenNames.clientHome}
        component={ClientHome}
        options={{ title: t('bottomTab.home') }}
      />
      <Tab.Screen
        name={screenNames.myBids}
        component={MyBids}
        options={{ title: t('bottomTab.myBids') }}
      />
      <Tab.Screen
        name={screenNames.favorites}
        component={Favorites}
        options={{ title: t('bottomTab.favorites') }}
      />
      <Tab.Screen
        name={screenNames.profile}
        component={Profile}
        options={{ title: t('bottomTab.profile') }}
      />
    </Tab.Navigator>
  );
}
