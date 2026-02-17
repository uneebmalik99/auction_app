import { StyleSheet } from 'react-native';
import { appColors } from '../../utils/appColors';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: appColors.background,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: appColors.textPrimary,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 30,
    marginBottom: 15,
    color: appColors.textPrimary,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: appColors.textPrimary,
    marginBottom: 16,
  },
  bold: {
    fontWeight: '600',
  },
  link: {
    color: appColors.primary,
    textDecorationLine: 'underline',
  },
  footer: {
    marginTop: 40,
    textAlign: 'center',
    fontSize: 14,
    color: appColors.textMuted,
    fontStyle: 'italic',
  },
});
