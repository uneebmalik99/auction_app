import { StyleSheet } from 'react-native';
import { height, width } from '../../utils/dimensions';
import { appColors } from '../../utils/appColors';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: appColors.background,
  },
  container: {
    flex: 1,
    paddingTop: height(6),
    paddingHorizontal: width(6),
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: appColors.textPrimary,
    marginBottom: height(1),
  },
  subtitle: {
    fontSize: 13,
    color: appColors.textMuted,
    marginBottom: height(3),
  },
  formSection: {
    marginBottom: height(3),
  },
  primaryButton: {
    marginTop: 0,
  },
  secondaryButton: {
    marginTop: height(1.5),
  },
});
