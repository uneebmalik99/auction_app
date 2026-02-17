import React from 'react';
// eslint-disable-next-line import/no-unresolved
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  Home,
  LayoutDashboard,
  Package,
  PlusCircle,
  User,
} from 'lucide-react-native';
import { appColors } from '../../../utils/appColors';
import AdminHome from '../../../screens/admin/adminHome/adminHome';
import AuctionItems from '../../../screens/admin/auctionItems/auctionItems';
import AddAuctionItem from '../../../screens/admin/addAuctionItem/addAuctionItem';
import Profile from '../../../screens/profile/profile';
import screenNames from '../../routes';
import { useI18n } from '../../../i18n';

type AdminTabParamList = {
  AdminHome: undefined;
  AdminAuctionItems: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<AdminTabParamList>();

export default function AdminBottomTabs() {
  const { t } = useI18n();
  return (
    <Tab.Navigator
      screenOptions={({
        route,
      }: {
        route: { name: keyof AdminTabParamList };
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
            case screenNames.adminHome:
              return <Home size={size} color={color} />;
            case screenNames.adminAuctionItems:
              return <Package size={size} color={color} />;
            case screenNames.profile:
            default:
              return <User size={size} color={color} />;
          }
        },
      })}
    >
      <Tab.Screen
        name={screenNames.adminHome}
        component={AdminHome}
        options={{ title: t('bottomTab.home') }}
      />
      <Tab.Screen
        name={screenNames.adminAuctionItems}
        component={AuctionItems}
        options={{ title: t('bottomTab.items') }}
      />
      {/* <Tab.Screen
        name="AddAuctionItem"
        component={AddAuctionItem}
        options={{ title: 'Add item' }}
      /> */}
      <Tab.Screen
        name={screenNames.profile}
        component={Profile}
        options={{ title: t('bottomTab.profile') }}
      />
    </Tab.Navigator>
  );
}
