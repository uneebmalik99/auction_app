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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width(3),
  },
  menuButton: {
    width: height(4.5),
    height: height(4.5),
    borderRadius: height(2.25),
    backgroundColor: appColors.surface,
    alignItems: 'center',
    justifyContent: 'center',
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
  sectionNoBackground: {
    marginBottom: height(3),
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: appColors.textSecondary,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: appColors.textMuted,
    marginTop: 4,
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
  sectionHeaderRowNoPadding: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height(2),
    paddingHorizontal: width(4),
  },
  sectionLink: {
    fontSize: 12,
    color: appColors.primary,
  },
  listContent: {
    paddingTop: height(0.5),
  },
  horizontalScrollContent: {
    paddingHorizontal: width(4),
    gap: width(3),
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
    paddingVertical: height(4),
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: appColors.textSecondary,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    color: appColors.textMuted,
    textAlign: 'center',
  },
  emptyCard: {
    backgroundColor: appColors.surface,
    borderRadius: 16,
    padding: width(6),
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: height(15),
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: width(4),
  },
  modalContent: {
    backgroundColor: appColors.surface,
    borderRadius: 20,
    width: '100%',
    maxHeight: '90%',
    overflow: 'hidden',
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: width(4),
    backgroundColor: appColors.primary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: appColors.white,
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 12,
    color: appColors.white + 'CC',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalStatsRow: {
    flexDirection: 'row',
    padding: width(4),
    gap: width(2),
    backgroundColor: appColors.background,
  },
  modalStatCard: {
    flex: 1,
    backgroundColor: appColors.surface,
    padding: width(3),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: appColors.inputBorder,
  },
  modalStatLabel: {
    fontSize: 10,
    color: appColors.textMuted,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  modalStatValue: {
    fontSize: 16,
    fontWeight: '700',
    color: appColors.textPrimary,
  },
  modalBidList: {
    flex: 1,
    padding: width(4),
  },
  modalLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: height(6),
  },
  modalLoadingText: {
    marginTop: height(2),
    fontSize: 14,
    color: appColors.textMuted,
  },
  bidListContainer: {
    gap: width(2),
  },
  bidItem: {
    backgroundColor: appColors.surface,
    borderRadius: 12,
    padding: width(3),
    marginBottom: width(2),
    borderWidth: 1,
    borderColor: appColors.inputBorder,
  },
  winningBidItem: {
    backgroundColor: appColors.surface,
    borderColor: appColors.primary,
    borderWidth: 2,
  },
  winningBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: appColors.primary,
    paddingHorizontal: width(3),
    paddingVertical: 4,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 8,
  },
  winningBadgeText: {
    color: appColors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  bidItemContent: {
    paddingTop: 8,
  },
  bidItemHeader: {
    flexDirection: 'row',
    gap: width(3),
  },
  bidRank: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: appColors.inputBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  winningRank: {
    backgroundColor: appColors.primary,
  },
  bidRankText: {
    fontSize: 14,
    fontWeight: '700',
    color: appColors.textPrimary,
  },
  bidItemInfo: {
    flex: 1,
    gap: 6,
  },
  bidItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bidderEmail: {
    fontSize: 13,
    fontWeight: '600',
    color: appColors.textPrimary,
    flex: 1,
  },
  bidAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: appColors.green,
  },
  winningBidAmount: {
    color: appColors.primary,
  },
  bidDate: {
    fontSize: 11,
    color: appColors.textMuted,
  },
  bidTime: {
    fontSize: 11,
    color: appColors.textMuted,
    marginLeft: 4,
  },
  modalEmptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: height(8),
  },
  modalEmptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: appColors.textSecondary,
    marginBottom: 8,
  },
  modalEmptySubtext: {
    fontSize: 14,
    color: appColors.textMuted,
    textAlign: 'center',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: width(4),
    backgroundColor: appColors.background,
    borderTopWidth: 1,
    borderTopColor: appColors.inputBorder,
  },
  modalFooterText: {
    fontSize: 12,
    color: appColors.textMuted,
  },
  modalFooterBold: {
    fontWeight: '700',
    color: appColors.textPrimary,
  },
  modalCloseButtonFooter: {
    backgroundColor: appColors.primary,
    paddingHorizontal: width(8),
    paddingVertical: height(1.5),
    borderRadius: 12,
  },
  modalCloseButtonText: {
    color: appColors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  // Drawer Styles
  drawerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'row',
  },
  drawerContent: {
    width: width(75),
    backgroundColor: appColors.surface,
    paddingTop: height(6),
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: width(4),
    paddingBottom: height(3),
    borderBottomWidth: 1,
    borderBottomColor: appColors.inputBorder,
  },
  drawerUserName: {
    fontSize: 18,
    fontWeight: '700',
    color: appColors.textPrimary,
    marginBottom: 4,
  },
  drawerUserEmail: {
    fontSize: 14,
    color: appColors.textMuted,
  },
  drawerCloseButton: {
    padding: 4,
  },
  drawerMenu: {
    paddingTop: height(2),
  },
  drawerMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width(4),
    paddingVertical: height(1.8),
    gap: width(3),
  },
  drawerMenuItemText: {
    fontSize: 16,
    color: appColors.textPrimary,
    fontWeight: '500',
  },
  drawerMenuItemLogout: {
    marginTop: height(2),
  },
  drawerMenuItemTextLogout: {
    color: appColors.red,
  },
  drawerDivider: {
    height: 1,
    backgroundColor: appColors.inputBorder,
    marginVertical: height(1),
    marginHorizontal: width(4),
  },
});
