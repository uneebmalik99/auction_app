// src/screens/PoliciesScreen.tsx
import React from 'react';
import { ScrollView, Text, SafeAreaView, Linking } from 'react-native';
import { styles } from './styles';
import { Header } from '../../components';

export default function PrivacyPolicies() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Header titleKey="privacyPolicy.title" />
      <ScrollView contentContainerStyle={styles.container}>
        {/* <Text style={styles.title}>Privacy Policy & Terms of Service</Text> */}

        {/* Privacy Policy Section */}
        <Text style={styles.sectionTitle}>Privacy Policy</Text>
        <Text style={styles.paragraph}>
          Your privacy is important to us. This Privacy Policy explains how we
          collect, use, disclose, and safeguard your information when you use
          our mobile application (the "App").
        </Text>

        <Text style={styles.paragraph}>
          <Text style={styles.bold}>1. Information We Collect</Text>
          {'\n'}
          We may collect information you provide directly to us, such as:
          {'\n'}• Name and email address when you register{'\n'}• Profile
          information{'\n'}• Any other information you choose to provide
        </Text>

        <Text style={styles.paragraph}>
          <Text style={styles.bold}>2. How We Use Your Information</Text>
          {'\n'}
          We use the information to:
          {'\n'}• Provide and improve the App{'\n'}• Personalize your experience
          {'\n'}• Communicate with you{'\n'}• Ensure security and prevent fraud
        </Text>

        <Text style={styles.paragraph}>
          <Text style={styles.bold}>3. Data Storage & Security</Text>
          {'\n'}
          Your data is securely stored using industry-standard encryption. We
          implement reasonable measures to protect your personal information.
        </Text>

        <Text style={styles.paragraph}>
          <Text style={styles.bold}>4. Sharing Your Information</Text>
          {'\n'}
          We do not sell your personal data. We may share information with:
          {'\n'}• Service providers (e.g., analytics, hosting){'\n'}• Legal
          authorities when required by law
        </Text>

        <Text style={styles.paragraph}>
          <Text style={styles.bold}>5. Your Rights</Text>
          {'\n'}
          You may request to access, correct, or delete your personal data at
          any time by contacting us.
        </Text>

        {/* Terms of Service Section */}
        <Text style={styles.sectionTitle}>Terms of Service</Text>

        <Text style={styles.paragraph}>
          By using the App, you agree to these Terms of Service.
        </Text>

        <Text style={styles.paragraph}>
          <Text style={styles.bold}>1. Use of the App</Text>
          {'\n'}
          You agree to use the App only for lawful purposes and in accordance
          with these Terms.
        </Text>

        <Text style={styles.paragraph}>
          <Text style={styles.bold}>2. Account Responsibility</Text>
          {'\n'}
          You are responsible for maintaining the confidentiality of your
          account credentials and for all activities under your account.
        </Text>

        <Text style={styles.paragraph}>
          <Text style={styles.bold}>3. Prohibited Activities</Text>
          {'\n'}
          You may not:
          {'\n'}• Violate any laws{'\n'}• Interfere with the App's functionality
          {'\n'}• Attempt to gain unauthorized access
        </Text>

        <Text style={styles.paragraph}>
          <Text style={styles.bold}>4. Limitation of Liability</Text>
          {'\n'}
          The App is provided "as is". We are not liable for any indirect,
          incidental, or consequential damages.
        </Text>

        <Text style={styles.paragraph}>
          <Text style={styles.bold}>5. Changes to Terms</Text>
          {'\n'}
          We may update these Terms from time to time. Continued use of the App
          after changes constitutes acceptance.
        </Text>

        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Contact Us</Text>
          {'\n'}
          If you have questions about these policies, please contact us at:
          {'\n'}
          <Text
            style={styles.link}
            onPress={() => Linking.openURL('mailto:support@yourapp.com')}
          >
            {' '}
            support@yourapp.com
          </Text>
        </Text>

        <Text style={styles.footer}>Last updated: December 31, 2025</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
