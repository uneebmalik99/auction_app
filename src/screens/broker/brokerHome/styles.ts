import { StyleSheet } from 'react-native';
import { height, width } from '../../../utils/dimensions';
import { appColors } from '../../../utils/appColors';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: appColors.background,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: height(4),
    paddingHorizontal: width(6),
    paddingBottom: height(4),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: height(3),
  },
  greetingLabel: {
    fontSize: 15,
    color: appColors.textMuted,
  },
  greetingName: {
    marginTop: 4,
    fontSize: 20,
    fontWeight: '600',
    color: appColors.textPrimary,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height(3),
    gap: width(1),
    flexWrap: 'wrap',
  },
  statCard: {
    flex: 1,
    marginRight: 8,
    paddingVertical: height(1.8),
    paddingHorizontal: width(3),
    borderRadius: 14,
    backgroundColor: appColors.surface,
  },
  notificationIconButton: {
    width: height(4.5),
    height: height(4.5),
    borderRadius: height(2.25),
    backgroundColor: appColors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: appColors.textMuted,
  },
  statValue: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: '600',
    color: appColors.textPrimary,
  },
  section: {
    marginBottom: height(3),
    padding: width(4),
    borderRadius: 16,
    backgroundColor: appColors.surface,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: appColors.textSecondary,
  },
  primaryButton: {
    marginTop: height(1.5),
  },
  secondaryButton: {
    marginTop: height(1.5),
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height(1.5),
  },
  sectionLink: {
    fontSize: 12,
    color: appColors.primary,
  },
  listContent: {
    paddingTop: height(0.5),
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: appColors.inputBorder,
    flex: 1,
  },
  itemTextContainer: {
    flex: 2,
    marginRight: 12,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: appColors.textPrimary,
  },
  itemSubtitle: {
    marginTop: 3,
    fontSize: 12,
    color: appColors.textMuted,
  },
  itemStatus: {
    fontSize: 12,
    fontWeight: '600',
    color: appColors.textSecondary,
  },
  timeStatusContainer: {
    flex: 1.5,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: appColors.textSecondary,
  },
});
