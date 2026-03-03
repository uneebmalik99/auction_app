import { StyleSheet } from 'react-native';
import { height, width } from '../../../utils/dimensions';
import { appColors } from '../../../utils/appColors';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: appColors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: height(2),
    fontSize: 14,
    color: appColors.textMuted,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: width(6),
    paddingTop: height(2),
    paddingBottom: height(1),
    gap: width(4),
  },
  statCard: {
    flex: 1,
    backgroundColor: appColors.surface,
    borderRadius: 12,
    padding: width(4),
    flexDirection: 'row',
    alignItems: 'center',
    gap: width(3),
    borderWidth: 1,
    borderColor: appColors.surface,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: appColors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appColors.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    color: appColors.textMuted,
    marginTop: 2,
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
  bidCard: {
    backgroundColor: appColors.surface,
    borderRadius: 16,
    marginBottom: height(2),
    borderWidth: 1,
    borderColor: appColors.surface,
    overflow: 'hidden',
  },
  bidCardContent: {
    flexDirection: 'row',
    padding: width(4),
    gap: width(4),
  },
  bidImage: {
    width: 96,
    height: 96,
    borderRadius: 12,
    backgroundColor: appColors.background,
  },
  bidInfo: {
    flex: 1,
  },
  bidHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height(1.5),
  },
  bidTitleContainer: {
    flex: 1,
    marginRight: width(2),
  },
  bidTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: appColors.textPrimary,
    marginBottom: 4,
  },
  bidVehicleInfo: {
    fontSize: 13,
    color: appColors.textMuted,
  },
  bidAmountContainer: {
    alignItems: 'flex-end',
  },
  bidAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appColors.primary,
    marginBottom: 4,
  },
  bidDate: {
    fontSize: 11,
    color: appColors.textMuted,
  },
  bidFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: height(1.5),
    borderTopWidth: 1,
    borderTopColor: appColors.surface,
    gap: width(3),
  },
  statusBadge: {
    paddingHorizontal: width(3),
    paddingVertical: height(0.5),
    borderRadius: 999,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  currentBidContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  currentBidLabel: {
    fontSize: 13,
    color: appColors.textMuted,
  },
  currentBidValue: {
    fontSize: 13,
    fontWeight: '600',
    color: appColors.textPrimary,
  },
  emptyState: {
    marginTop: height(10),
    alignItems: 'center',
    paddingHorizontal: width(6),
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: appColors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: height(2),
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: appColors.textPrimary,
    marginBottom: height(1),
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: appColors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
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
