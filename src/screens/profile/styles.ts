import { StyleSheet } from 'react-native';
import { height, width } from '../../utils/dimensions';
import { appColors } from '../../utils/appColors';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: appColors.background,
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: width(6),
    paddingTop: height(2),
    paddingBottom: height(4),
  },
  card: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: height(4),
    paddingHorizontal: width(6),
    borderRadius: 20,
    backgroundColor: appColors.surface,
    marginBottom: height(3),
  },
  avatarWrapper: {
    marginBottom: height(1.5),
  },
  avatarCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: appColors.inputBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editIconButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: appColors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 32,
    fontWeight: '700',
    color: appColors.textSecondary,
  },
  nameText: {
    fontSize: 20,
    fontWeight: '600',
    color: appColors.textPrimary,
  },
  emailText: {
    marginTop: 4,
    fontSize: 13,
    color: appColors.textMuted,
  },
  actionsContainer: {
    width: '100%',
  },
  primaryButton: {
    marginTop: 0,
  },
  secondaryButton: {
    marginTop: height(1.2),
  },
  deleteAccountButton: {
    marginTop: height(1.2),
  },
  deleteAccountText: {
    color: appColors.red,
  },
});
