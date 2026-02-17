import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import { styles } from './styles';
import type { RootNavigationProp } from '../../utils/types';
import { appColors } from '../../utils/appColors';
import { useI18n } from '../../i18n';

interface HeaderProps {
  title?: string;
  titleKey?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

export default function Header({
  title,
  titleKey,
  showBackButton = true,
  onBackPress,
}: HeaderProps) {
  const navigation = useNavigation<RootNavigationProp>();
  const canGoBack = navigation.canGoBack();
  const { t } = useI18n();

  const resolvedTitle = titleKey ? t(titleKey) : title ?? '';

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else if (canGoBack) {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      {showBackButton && canGoBack ? (
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.8}
          onPress={handleBack}
        >
          <ArrowLeft size={20} color={appColors.textPrimary} />
        </TouchableOpacity>
      ) : (
        <View style={styles.backButtonPlaceholder} />
      )}

      <Text style={styles.title} numberOfLines={1}>
        {resolvedTitle}
      </Text>

      {/* Right placeholder to balance layout */}
      <View style={styles.rightPlaceholder} />
    </View>
  );
}
