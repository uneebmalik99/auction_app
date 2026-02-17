import { StyleSheet } from 'react-native';
import { height, width } from '../../utils/dimensions';
import { appColors } from '../../utils/appColors';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: appColors.surface,
    borderRadius: 18,
    paddingVertical: height(1.8),
    paddingHorizontal: width(4),
    marginBottom: height(1.5),
    borderWidth: 1,
    borderColor: appColors.inputBorder,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerMain: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: width(2),
  },
  avatar: {
    width: height(6),
    height: height(6),
    borderRadius: height(3),
    borderWidth: 2,
    borderColor: appColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: width(3),
    backgroundColor: appColors.background,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: appColors.textSecondary,
  },
  headerInfo: {
    flex: 1,
  },
  favoriteButton: {
    width: height(4),
    height: height(4),
    borderRadius: height(2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  editText: {
    fontSize: 12,
    fontWeight: '500',
    // color: appColors.primary,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: appColors.textPrimary,
    marginBottom: height(0.8),
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  mainValue: {
    fontSize: 22,
    fontWeight: '800',
    color: appColors.textPrimary,
    marginRight: 8,
  },
  secondaryValue: {
    fontSize: 13,
    fontWeight: '500',
    color: appColors.textMuted,
    // textDecorationLine: 'line-through',
  },
  metaText: {
    marginTop: height(0.5),
    fontSize: 12,
    color: appColors.textSecondary,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: height(0.5),
  },
  locationIcon: {
    marginRight: 4,
  },
  specRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: height(1.8),
  },
  specItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  specItemPlaceholder: {
    flex: 1,
  },
  specIcon: {
    marginRight: 4,
  },
  specText: {
    fontSize: 12,
    color: appColors.textSecondary,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: height(1.5),
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
    fontSize: 14,
    fontWeight: '600',
    color: appColors.textSecondary,
  },
  bidRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: height(1.2),
  },
  bidLabel: {
    fontSize: 12,
    color: appColors.textMuted,
  },
  bidRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bidValue: {
    fontSize: 14,
    fontWeight: '600',
    color: appColors.textPrimary,
    marginRight: 8,
  },
  bidStatus: {
    fontSize: 11,
    fontWeight: '500',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  bidStatusLeading: {
    color: appColors.primary,
  },
  bidStatusOutbid: {
    backgroundColor: appColors.surface,
    color: appColors.textSecondary,
    borderWidth: 1,
    borderColor: appColors.outline,
  },
  divider: {
    marginTop: height(1.8),
    height: 1,
    backgroundColor: appColors.inputBorder,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: height(1),
  },
  footerLabel: {
    fontSize: 12,
    color: appColors.textSecondary,
    marginRight: 4,
  },
  footerValue: {
    fontSize: 12,
    fontWeight: '600',
    color: appColors.primary,
  },
});
