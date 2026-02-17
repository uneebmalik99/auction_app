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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: width(6),
    paddingTop: height(2),
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: appColors.textPrimary,
  },
  addButton: {
    width: width(30),
    height: height(4),
    // paddingVertical: height(1.2),
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: appColors.textPrimary,
  },
  tabContainer: {
    flexDirection: 'row',
    marginTop: height(2),
    marginBottom: height(1.5),
    marginHorizontal: width(6),
    backgroundColor: appColors.surface,
    borderRadius: 999,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: height(1.2),
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonActive: {
    backgroundColor: appColors.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: appColors.textMuted,
  },
  tabTextActive: {
    color: appColors.buttonText,
  },
  card: {
    backgroundColor: appColors.surface,
    borderRadius: 16,
    paddingVertical: height(1.5),
    paddingHorizontal: width(4),
    marginBottom: height(1.5),
    marginTop: height(2),
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: appColors.textPrimary,
    marginBottom: height(1),
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height(1),
  },
  editButton: {
    paddingHorizontal: width(2),
    paddingVertical: height(0.5),
    borderRadius: 999,
    backgroundColor: appColors.surface,
  },
  editText: {
    fontSize: 12,
    fontWeight: '500',
    color: appColors.primary,
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
  status: {
    marginTop: 4,
    fontSize: 13,
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
});
