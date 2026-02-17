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
    textAlign: 'center',
    marginBottom: 32,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: appColors.surface,
    borderRadius: 999,
    padding: 4,
    marginBottom: 24,
    marginHorizontal: width(0),
  },
  tabButton: {
    flex: 1,
    paddingVertical: height(1.5),
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonActive: {
    backgroundColor: appColors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: appColors.textMuted,
  },
  tabTextActive: {
    color: appColors.textPrimary,
  },
  formContainer: {
    flex: 1,
    marginTop: 8,
  },
  guestButton: {
    paddingVertical: height(1.8),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: appColors.outline,
    marginBottom: 24,
  },
  guestButtonText: {
    color: appColors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
});
