import { StyleSheet } from 'react-native';
import { height, width } from '../../utils/dimensions';
import { appColors } from '../../utils/appColors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: height(10),
    paddingHorizontal: width(6),
    backgroundColor: appColors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: appColors.textPrimary,
    marginBottom: height(1),
  },
  subtitle: {
    fontSize: 14,
    color: appColors.textMuted,
    marginBottom: height(3),
  },
  primaryButton: {
    marginTop: height(1),
  },
  secondaryButton: {
    marginTop: height(1.5),
  },
  secondaryButtonText: {
    color: appColors.gray,
  },
});
