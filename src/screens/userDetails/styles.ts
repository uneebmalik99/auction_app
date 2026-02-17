import { StyleSheet } from 'react-native';
import { appColors } from '../../utils/appColors';
import { height, width } from '../../utils/dimensions';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: appColors.background,
  },
  container: {
    paddingBottom: height(4),
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: height(1.5),
    fontSize: 16,
    color: appColors.textPrimary,
  },
  errorText: {
    fontSize: 18,
    color: appColors.textMuted,
  },
  headerSection: {
    width: width(90),
    alignItems: 'center',
    paddingVertical: height(4),
    backgroundColor: appColors.surface,
    marginBottom: height(1.5),
    alignSelf: 'center',
    borderRadius: height(2),
  },
  avatarWrapper: {
    width: height(10),
    height: height(10),
    borderRadius: height(5),
    overflow: 'hidden',
    marginBottom: height(2),
    shadowColor: appColors.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: appColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    fontSize: height(6),
    fontWeight: 'bold',
    color: appColors.textPrimary,
  },
  name: {
    fontSize: height(3),
    fontWeight: '700',
    color: appColors.textPrimary,
    marginBottom: height(0.8),
  },
  roleBadge: {
    fontSize: height(1.5),
    color: appColors.primary,
    fontWeight: '600',
    backgroundColor: appColors.surface,
    paddingHorizontal: width(1.5),
    paddingVertical: height(0.5),
    borderRadius: 20,
    overflow: 'hidden',
  },
  detailsCard: {
    width: width(90),

    alignSelf: 'center',
    overflow: 'hidden',
  },
  detailRow: {
    flexDirection: 'row',
    paddingVertical: height(1.5),
    paddingHorizontal: width(4),
    alignItems: 'center',
    marginBottom: height(0.5),
    backgroundColor: appColors.surface,
    borderRadius: 10,
  },
  detailContent: {
    marginLeft: width(4),
    flex: 1,
  },
  detailLabel: {
    fontSize: 13,
    color: appColors.textMuted,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    color: appColors.textPrimary,
    fontWeight: '500',
  },
});
