import { StyleSheet } from 'react-native';
import { height, width } from '../../utils/dimensions';
import { appColors } from '../../utils/appColors';

export const styles = StyleSheet.create({
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: appColors.textSecondary,
    marginBottom: height(0.5),
  },
  labelRTL: {
    textAlign: 'right',
  },
  helperText: {
    fontSize: 12,
    color: appColors.textMuted,
    marginBottom: height(1.2),
  },
  helperTextRTL: {
    textAlign: 'right',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowRTL: {
    flexDirection: 'row-reverse',
  },
  addCard: {
    width: width(26),
    height: height(12),
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: appColors.outline,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: width(3),
    backgroundColor: appColors.background,
  },
  addCardRTL: {
    marginRight: 0,
    marginLeft: width(3),
  },
  addIcon: {
    fontSize: 20,
    color: appColors.textSecondary,
  },
  addText: {
    marginTop: 4,
    fontSize: 12,
    color: appColors.textSecondary,
    textAlign: 'center',
  },
  addTextRTL: {
    textAlign: 'center',
  },
  listContent: {
    paddingRight: width(2),
  },
  listContentRTL: {
    paddingRight: 0,
    paddingLeft: width(2),
  },
  thumbWrapper: {
    marginRight: width(2),
  },
  thumbWrapperRTL: {
    marginRight: 0,
    marginLeft: width(2),
  },
  thumb: {
    width: width(18),
    height: height(10),
    borderRadius: 12,
    backgroundColor: appColors.surface,
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15,23,42,0.8)',
  },
  removeButtonRTL: {
    right: 'auto',
    left: 4,
  },
  counterText: {
    marginTop: height(0.8),
    fontSize: 12,
    color: appColors.textMuted,
  },
  counterTextRTL: {
    textAlign: 'right',
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: appColors.red,
  },
  errorTextRTL: {
    textAlign: 'right',
  },
});
