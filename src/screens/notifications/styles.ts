import { StyleSheet } from 'react-native';
import { height, width } from '../../utils/dimensions';
import { appColors } from '../../utils/appColors';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: appColors.background,
  },
  listContent: {
    paddingHorizontal: width(6),
    paddingTop: height(2),
    paddingBottom: height(4),
  },
  card: {
    backgroundColor: appColors.surface,
    borderRadius: 16,
    paddingVertical: height(1.5),
    paddingHorizontal: width(4),
    marginBottom: height(1.5),
    borderWidth: 1,
    borderColor: appColors.inputBorder,
  },
  cardUnread: {
    borderColor: appColors.primary,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: height(0.5),
  },
  title: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: appColors.textPrimary,
    marginRight: width(2),
  },
  time: {
    fontSize: 11,
    color: appColors.textMuted,
  },
  body: {
    fontSize: 13,
    color: appColors.textSecondary,
    marginTop: height(0.5),
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
  markAllReadTouchable: {
    width: width(85),
    alignSelf: 'center',
    alignContent: 'flex-end',
    marginRight: width(4),
  },
  markAllReadText: {
    fontSize: 13,
    textAlign: 'right',
    textDecorationLine: 'underline',
    color: appColors.primary,
  },
});
