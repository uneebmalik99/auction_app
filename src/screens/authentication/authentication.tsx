import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { styles } from './styles';
import type { AuthScreenNavigationProp, AuthTab } from '../../utils/types';
import { SignIn, SignUp, Header, Tabs } from '../../components';
import { useI18n } from '../../i18n';

export default function Authentication() {
  const navigation = useNavigation<AuthScreenNavigationProp>();
  const route = useRoute<any>();
  const [activeTab, setActiveTab] = useState<AuthTab>('signIn');
  const { t } = useI18n();

  useEffect(() => {
    const initialTab = route?.params?.initialTab as AuthTab | undefined;
    if (initialTab === 'signUp' || initialTab === 'signIn') {
      setActiveTab(initialTab);
    }
  }, [route?.params?.initialTab]);

  return (
    <View style={styles.container}>
      <Header titleKey="auth.title" showBackButton={false} />

      <Text style={styles.title}>{t('auth.welcome')}</Text>

      <Tabs
        tabs={[
          { key: 'signIn', label: t('auth.tab.signIn') },
          { key: 'signUp', label: t('auth.tab.signUp') },
        ]}
        activeTab={activeTab}
        onTabPress={(key: string) => setActiveTab(key as AuthTab)}
        containerStyle={styles.tabContainer}
        tabButtonStyle={styles.tabButton}
        activeTabButtonStyle={styles.tabButtonActive}
        tabTextStyle={styles.tabText}
        activeTabTextStyle={styles.tabTextActive}
      />

      <View style={styles.formContainer}>
        {activeTab === 'signIn' ? (
          <SignIn activeTab={activeTab} setActiveTab={setActiveTab} />
        ) : (
          <SignUp activeTab={activeTab} setActiveTab={setActiveTab} />
        )}
      </View>
    </View>
  );
}
