import { StyleSheet } from 'react-native';
import { height, width } from '../../../utils/dimensions';
import { appColors } from '../../../utils/appColors';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: appColors.background,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: height(2),
    marginHorizontal: width(6),
    padding: 4,
    borderRadius: 999,
    backgroundColor: appColors.surface,
  },
  tabButton: {
    flex: 1,
    paddingVertical: height(1.1),
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonActive: {
    backgroundColor: appColors.primary,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: appColors.textMuted,
  },
  tabLabelActive: {
    color: appColors.background,
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
    alignItems: 'flex-end',
  },
  rightColumn: {
    alignItems: 'flex-end',
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
  chatButton: {
    backgroundColor: appColors.primary,
    padding: 10,
    borderRadius: 999,
    marginTop: height(1),
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatButtonText: {
    color: appColors.background,
    fontSize: 13,
    fontWeight: '500',
  },
});
