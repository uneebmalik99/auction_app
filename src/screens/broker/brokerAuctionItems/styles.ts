import { StyleSheet } from 'react-native';
import { appColors } from '../../../utils/appColors';
import { width, height } from '../../../utils/dimensions';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: appColors.background,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: width(4),
    paddingBottom: height(4),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width(4),
    paddingVertical: height(2),
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: appColors.textPrimary,
  },
  addButton: {
    backgroundColor: appColors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  addButtonText: {
    color: appColors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: height(10),
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: appColors.textSecondary,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: appColors.textMuted,
  },
});
