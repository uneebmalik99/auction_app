import { StyleSheet } from 'react-native';
import { height, width } from '../../../utils/dimensions';
import { appColors } from '../../../utils/appColors';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: appColors.background,
  },
  contentContainer: {
    paddingTop: height(2),
    paddingHorizontal: width(6),
    paddingBottom: height(4),
  },
  card: {
    backgroundColor: appColors.surface,
    borderRadius: 16,
    paddingVertical: height(1.5),
    paddingHorizontal: width(4),
    marginBottom: height(1.5),
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: appColors.textPrimary,
    marginBottom: height(1),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: appColors.textMuted,
  },
  value: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: '600',
    color: appColors.textSecondary,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: appColors.surface,
    borderWidth: 1,
    borderColor: appColors.outline,
  },
  badgeText: {
    fontSize: 11,
    color: appColors.textSecondary,
  },
  emptyState: {
    marginTop: height(10),
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: appColors.textPrimary,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    color: appColors.textMuted,
    textAlign: 'center',
    paddingHorizontal: width(10),
  },
  statusText: {
    marginTop: height(1),
    fontSize: 13,
    color: appColors.textMuted,
  },
});
