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
  helperText: {
    fontSize: 12,
    color: appColors.textMuted,
    marginBottom: height(1.2),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
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
  addIcon: {
    fontSize: 20,
    color: appColors.textSecondary,
  },
  addText: {
    marginTop: 4,
    fontSize: 12,
    color: appColors.textSecondary,
  },
  listContent: {
    paddingRight: width(2),
  },
  thumbWrapper: {
    marginRight: width(2),
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
  counterText: {
    marginTop: height(0.8),
    fontSize: 12,
    color: appColors.textMuted,
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: appColors.red,
  },
});
