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
  },
  contentContainer: {
    paddingBottom: height(4),
  },
  mediaContainer: {
    backgroundColor: appColors.background,
    paddingTop: height(1),
    paddingHorizontal: width(6),
    paddingBottom: height(2),
  },
  mediaInner: {
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: appColors.background,
  },
  mediaImage: {
    width: width(100),
    height: height(25),
    resizeMode: 'cover',
  },
  mediaTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: height(1.5),
  },
  mediaBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: appColors.surface,
  },
  mediaBadgeText: {
    fontSize: 11,
    color: appColors.textSecondary,
  },
  shareBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: appColors.surface,
  },
  shareIcon: {
    fontSize: 16,
    color: appColors.textSecondary,
  },
  carPlaceholder: {
    height: height(18),
    alignItems: 'center',
    justifyContent: 'center',
  },
  carPlaceholderText: {
    fontSize: 13,
    color: appColors.textMuted,
  },
  mediaBidLeft: {
    position: 'absolute',
    left: width(10),
    bottom: height(2.5),
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: appColors.surface,
  },
  mediaBidRight: {
    position: 'absolute',
    right: width(10),
    bottom: height(4),
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: appColors.surface,
  },
  mediaBidText: {
    fontSize: 13,
    fontWeight: '600',
    color: appColors.textSecondary,
  },
  countdownBar: {
    marginTop: height(1.5),
    marginHorizontal: width(6),
    paddingHorizontal: width(4),
    paddingVertical: height(1.2),
    borderRadius: 999,
    backgroundColor: appColors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  countdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countdownCircleOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: appColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  countdownCircleInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'transparent',
  },
  countdownLabel: {
    fontSize: 12,
    color: appColors.textSecondary,
  },
  countdownValue: {
    fontSize: 14,
    fontWeight: '600',
    color: appColors.textPrimary,
  },
  detailsCard: {
    marginTop: height(2),
    marginHorizontal: width(6),
    paddingHorizontal: width(4),
    paddingTop: height(2.5),
    paddingBottom: height(2),
    borderRadius: 24,
    backgroundColor: appColors.surface,
  },
  detailsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: height(2),
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: appColors.textPrimary,
  },
  detailsStartingLabel: {
    marginTop: 6,
    fontSize: 12,
    color: appColors.textMuted,
  },
  detailsPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 4,
  },
  detailsPriceMain: {
    fontSize: 20,
    fontWeight: '700',
    color: appColors.textPrimary,
    marginRight: 8,
  },
  detailsPriceSecondary: {
    fontSize: 13,
    color: appColors.textMuted,
    // textDecorationLine: 'line-through',
  },
  statusFloatingButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: appColors.orange,
  },
  statusFloatingIcon: {
    fontSize: 18,
    color: appColors.buttonText,
  },
  tabsRow: {
    flexDirection: 'row',
    marginTop: height(2),
    marginBottom: height(1),
  },
  tabButton: {
    marginRight: width(4),
  },
  tabLabel: {
    fontSize: 14,
    color: appColors.textSecondary,
  },
  tabLabelActive: {
    color: appColors.orange,
    fontWeight: '600',
  },
  tabIndicator: {
    marginTop: 4,
    height: 2,
    borderRadius: 999,
    backgroundColor: appColors.orange,
  },
  descriptionText: {
    fontSize: 13,
    lineHeight: 19,
    color: appColors.textSecondary,
    marginTop: height(1),
  },
  detailsSectionTitle: {
    marginTop: height(2),
    fontSize: 14,
    fontWeight: '600',
    color: appColors.textPrimary,
  },
  specsGrid: {
    marginTop: height(1),
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  specLabel: {
    fontSize: 12,
    color: appColors.textPrimary,
    fontWeight: '500',
  },
  specValue: {
    fontSize: 12,
    color: appColors.textMuted,
  },
  featuresList: {
    marginTop: height(1),
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  featureChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: appColors.surface,
    marginRight: 6,
    marginBottom: 6,
  },
  featureText: {
    fontSize: 11,
    color: appColors.textSecondary,
  },
  bidsList: {
    marginTop: height(1),
    flex: 1,
    maxHeight: height(40),
  },
  bidRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: appColors.inputBorder,
  },
  bidderAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: appColors.background,
    marginRight: 12,
  },
  bidderAvatarText: {
    fontSize: 14,
    fontWeight: '600',
    color: appColors.textSecondary,
  },
  bidderInfo: {
    flex: 1,
    marginRight: 12,
  },
  bidderName: {
    fontSize: 13,
    fontWeight: '500',
    color: appColors.textPrimary,
  },
  bidderPlace: {
    fontSize: 11,
    color: appColors.textMuted,
    marginTop: 2,
  },
  bidAmounts: {
    alignItems: 'flex-end',
  },
  bidAmountMain: {
    fontSize: 14,
    fontWeight: '600',
    color: appColors.textPrimary,
  },
  bidAmountSecondary: {
    fontSize: 12,
    color: appColors.textMuted,
    textDecorationLine: 'line-through',
    marginTop: 2,
  },
  bottomCard: {
    marginTop: height(1.5),
    marginHorizontal: width(6),
    paddingHorizontal: width(4),
    paddingTop: height(1.5),
    paddingBottom: height(2.5),
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    backgroundColor: appColors.surface,
  },
  bidControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: height(1.5),
  },
  adjustButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: height(1.1),
    borderRadius: 999,
    backgroundColor: appColors.background,
  },
  adjustButtonPlus: {
    borderWidth: 1,
    borderColor: appColors.orange,
    backgroundColor: 'transparent',
  },
  adjustIcon: {
    fontSize: 16,
    fontWeight: '700',
    color: appColors.textPrimary,
  },
  adjustText: {
    fontSize: 13,
    color: appColors.textPrimary,
  },
  currentBidBlock: {
    alignItems: 'center',
  },
  currentBidMain: {
    fontSize: 18,
    fontWeight: '700',
    color: appColors.textPrimary,
  },
  currentBidSecondary: {
    fontSize: 13,
    color: appColors.textMuted,
    marginTop: 2,
  },
  makeBidButton: {
    marginTop: height(1),
    borderRadius: 999,
    backgroundColor: appColors.orange,
  },
  wrapper: {
    height: height(25),
  },
  pagination: {
    bottom: 0,
  },
  dot: {
    backgroundColor: appColors.textSecondary,
  },
  activeDot: {
    backgroundColor: appColors.primary,
  },
  sellerSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: appColors.textPrimary,
    marginBottom: 12,
  },

  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    justifyContent: 'center',
  },

  loadingText: {
    marginLeft: 10,
    color: appColors.textSecondary,
    fontSize: 14,
  },

  emptySeller: {
    padding: 20,
    alignItems: 'center',
  },

  emptyText: {
    color: appColors.textSecondary,
    fontSize: 14,
    fontStyle: 'italic',
  },
});
