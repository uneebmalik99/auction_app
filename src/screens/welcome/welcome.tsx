import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles';
import { Button, Header, Dropdown } from '../../components';
import type { RootNavigationProp } from '../../utils/types';
import screenNames from '../../routes/routes';
import { useI18n } from '../../i18n';

export default function Welcome() {
  const navigation = useNavigation<RootNavigationProp>();
  const { language, setLanguage, t, isRTL } = useI18n();

  const handleSignIn = () => {
    navigation.navigate(screenNames.authentication, { initialTab: 'signIn' });
  };

  const handleSignUp = () => {
    navigation.navigate(screenNames.authentication, { initialTab: 'signUp' });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="AuctionApp" showBackButton={false} />

      <View style={styles.container}>
        <View style={[styles.languageRow, isRTL && styles.languageRowRTL]}>
          <Text style={[styles.languageLabel, isRTL && styles.languageLabelRTL]}>{t('common.language')}</Text>
          <Dropdown
            options={[
              { label: t('common.english'), value: 'en' },
              { label: t('common.arabic'), value: 'ar' },
            ]}
            value={language}
            onChange={val => setLanguage(String(val) as any)}
            containerStyle={styles.languageDropdown}
          />
        </View>

        <View style={styles.heroContainer}>
          <View style={[styles.badge, isRTL && styles.badgeRTL]}>
            <Text style={[styles.badgeText, isRTL && styles.badgeTextRTL]}>{t('welcome.badge')}</Text>
          </View>

          <Text style={[styles.title, isRTL && styles.titleRTL]}>{t('welcome.title1')}</Text>
          <Text style={[styles.title, isRTL && styles.titleRTL]}>{t('welcome.title2')}</Text>

          <Text style={[styles.subtitle, isRTL && styles.subtitleRTL]}>{t('welcome.subtitle')}</Text>

          <View style={[styles.highlightRow, isRTL && styles.highlightRowRTL]}>
            <View style={styles.highlightPill}>
              <Text style={[styles.highlightText, isRTL && styles.highlightTextRTL]}>
                {t('welcome.verifiedSellers')}
              </Text>
            </View>
            {/* <View style={styles.highlightPill}>
              <Text style={styles.highlightText}>Secure payments</Text>
            </View> */}
            <View style={styles.highlightPill}>
              <Text style={[styles.highlightText, isRTL && styles.highlightTextRTL]}>
                {t('welcome.liveBidding')}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <Button
            label={t('welcome.signIn')}
            onPress={handleSignIn}
            buttonStyle={styles.primaryButton}
          />

          <Button
            label={t('welcome.createAccount')}
            onPress={handleSignUp}
            buttonStyle={styles.secondaryButton}
            variant="secondary"
            textStyle={styles.secondaryButtonText}
          />

          <Text style={styles.footerText}>{t('welcome.languageHint')}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
