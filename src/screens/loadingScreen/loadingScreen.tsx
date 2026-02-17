import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { appColors } from '../../utils/appColors';
import { styles } from './styles';

export default function LoadingScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ActivityIndicator
        style={styles.activityIndicator}
        size="large"
        color={appColors.primary}
      />
      <Text style={styles.text}>Loading...</Text>
    </SafeAreaView>
  );
}
