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
import BrokerHome from '../../../screens/broker/brokerHome/brokerHome';

type BrokerTabParamList = {
  BrokerHome: undefined;
  BrokerAuctionItems: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<BrokerTabParamList>();

export default function BrokerBottomTabs() {
  const { t } = useI18n();
  return (
    <Tab.Navigator
      screenOptions={({
        route,
      }: {
          route: { name: keyof BrokerTabParamList };
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
            case screenNames.brokerHome:
              return <Home size={size} color={color} />;
            case screenNames.brokerAuctionItems:
              return <Package size={size} color={color} />;
            case screenNames.profile:
            default:
              return <User size={size} color={color} />;
          }
        },
      })}
    >
      <Tab.Screen
        name={screenNames.brokerHome}
        component={BrokerHome}
        options={{ title: t('bottomTab.home') }}
      />
      {/* <Tab.Screen
        name={screenNames.brokerAuctionItems}
        component={BrokerAuctionItems}
        options={{ title: t('bottomTab.items') }}
      /> */}
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
