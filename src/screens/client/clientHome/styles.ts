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
    paddingTop: height(2),
    paddingHorizontal: width(6),
    paddingBottom: height(4),
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: height(2),
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
  notificationIconButton: {
    width: height(4.5),
    height: height(4.5),
    borderRadius: height(2.25),
    backgroundColor: appColors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: appColors.textSecondary,
    fontWeight: '600',
  },
  summaryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: appColors.surface,
    paddingVertical: height(2),
    paddingHorizontal: width(4),
    borderRadius: 16,
    marginBottom: height(3),
  },
  summaryLabel: {
    fontSize: 12,
    color: appColors.textMuted,
  },
  summaryValue: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: '600',
    color: appColors.textPrimary,
  },
  summaryRight: {
    alignItems: 'flex-end',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: height(1.5),
    marginTop: height(1),
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: appColors.textSecondary,
  },
  liveAuctionsHeader: {
    marginBottom: height(2.5),
    marginTop: height(1),
  },
  liveAuctionsHeaderTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width(3),
    marginBottom: height(0.8),
  },
  liveAuctionsIconBox: {
    padding: width(2),
    backgroundColor: appColors.primary + '33', // 20% opacity equivalent
    borderRadius: 8,
    borderWidth: 1,
    borderColor: appColors.primary + '4D', // 30% opacity equivalent
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveAuctionsTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: appColors.textPrimary,
  },
  liveAuctionsSubtitle: {
    fontSize: 13,
    color: appColors.textMuted,
    marginLeft: width(14), // ml-14 equivalent (icon box + gap + icon size)
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
  emptySubtitle: {
    fontSize: 12,
    color: appColors.textMuted,
    textAlign: 'center',
  },
  statusText: {
    marginTop: height(1),
    fontSize: 13,
    color: appColors.textMuted,
  },
  sectionLink: {
    fontSize: 12,
    color: appColors.primary,
  },
  listContent: {
    paddingBottom: height(1),
  },
  card: {
    backgroundColor: appColors.surface,
    borderRadius: 16,
    paddingVertical: height(1.5),
    paddingHorizontal: width(4),
    marginBottom: height(1.5),
  },
  recommendationCard: {
    backgroundColor: appColors.surface,
    borderRadius: 16,
    paddingVertical: height(1.5),
    paddingHorizontal: width(4),
    marginBottom: height(1.5),
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: appColors.textPrimary,
    marginBottom: height(1),
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardLabel: {
    fontSize: 12,
    color: appColors.textMuted,
  },
  cardValue: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: '600',
    color: appColors.textSecondary,
  },
  cardRight: {
    alignItems: 'flex-end',
  },
  liveAuctionsHeader: {
    marginBottom: height(2.5),
    marginTop: height(1),
  },
  liveAuctionsHeaderTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width(3),
    marginBottom: height(0.8),
  },
  liveAuctionsIconBox: {
    padding: width(2),
    backgroundColor: appColors.primary + '33', // 20% opacity equivalent
    borderRadius: 8,
    borderWidth: 1,
    borderColor: appColors.primary + '4D', // 30% opacity equivalent
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveAuctionsTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: appColors.textPrimary,
  },
  liveAuctionsSubtitle: {
    fontSize: 13,
    color: appColors.textMuted,
    marginLeft: width(14), // ml-14 equivalent (icon box + gap + icon size)
  },
});
