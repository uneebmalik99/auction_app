import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import styles from './styles';
import { TabItem } from '../../utils/types';

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabPress: (key: string) => void;
  containerStyle?: object;
  tabButtonStyle?: object;
  activeTabButtonStyle?: object;
  tabTextStyle?: object;
  activeTabTextStyle?: object;
}

export default function Tabs({
  tabs,
  activeTab,
  onTabPress,
  containerStyle,
  tabButtonStyle,
  activeTabButtonStyle,
  tabTextStyle,
  activeTabTextStyle,
}: TabsProps) {
  return (
    <View style={[styles.tabContainer, containerStyle]}>
      {tabs.map(tab => (
        <TouchableOpacity
          key={tab.key}
          style={[
            styles.tabButton,
            tabButtonStyle,
            activeTab === tab.key && styles.tabButtonActive,
            activeTab === tab.key && activeTabButtonStyle,
          ]}
          onPress={() => onTabPress(tab.key)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabText,
              tabTextStyle,
              activeTab === tab.key && styles.tabTextActive,
              activeTab === tab.key && activeTabTextStyle,
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
