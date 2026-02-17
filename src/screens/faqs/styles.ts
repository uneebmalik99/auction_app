import { StyleSheet } from 'react-native';
import { appColors } from '../../utils/appColors';
import { height, width } from '../../utils/dimensions';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: appColors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: width(6),
    paddingTop: height(2),
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: height(3),
  },
  centerGrow: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 13,
    color: appColors.textMuted,
  },
  emptyText: {
    fontSize: 13,
    color: appColors.textMuted,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: height(3),
  },
  card: {
    width: '100%',
    backgroundColor: appColors.surface,
    borderRadius: 16,
    paddingHorizontal: width(4),
    paddingVertical: height(1.6),
    marginBottom: height(1.2),
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  question: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: appColors.textPrimary,
    paddingRight: 10,
  },
  chevron: {
    width: 22,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: appColors.textPrimary,
  },
  cardBody: {
    marginTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: appColors.inputBorder,
    paddingTop: 10,
  },
  answer: {
    fontSize: 13,
    color: appColors.textSecondary,
    lineHeight: 19,
  },
});

