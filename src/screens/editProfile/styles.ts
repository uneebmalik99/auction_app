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
  actionsRow: {
    marginTop: height(1),
  },
  primaryButton: {
    marginTop: 0,
  },
  secondaryButton: {
    marginTop: height(1.5),
  },
  avatarSection: {
    alignItems: 'center',
    // marginVertical: 24,
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: appColors.inputBackground,
  },

  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: appColors.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarPlaceholderText: {
    color: appColors.textMuted,
    fontSize: 14,
    textAlign: 'center',
  },

  avatarHint: {
    marginTop: 12,
    color: appColors.textMuted,
    fontSize: 14,
  },

  removeImageButton: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: appColors.surface,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },

  removeImageText: {
    color: appColors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
  },

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: appColors.surface,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: appColors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 32,
    fontWeight: '700',
    color: appColors.textSecondary,
  },
});
