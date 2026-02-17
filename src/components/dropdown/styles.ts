import { StyleSheet } from 'react-native';
import { height, width } from '../../utils/dimensions';
import { appColors } from '../../utils/appColors';

export const styles = StyleSheet.create({
  container: {
    marginVertical: height(1.5),
  },
  label: {
    fontSize: 13,
    color: appColors.textSecondary,
    marginBottom: 6,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: appColors.inputBorder,
    paddingHorizontal: width(4),
    paddingVertical: height(1.2),
    backgroundColor: appColors.inputBackground,
    height: height(6),
  },
  valueText: {
    fontSize: 14,
    color: appColors.textPrimary,
  },
  icon: {
    color: appColors.textMuted,
  },
  dropdown: {
    marginVertical: height(1),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: appColors.inputBorder,
    backgroundColor: appColors.surface,
    // overflow: 'hidden',
  },
  option: {
    paddingHorizontal: width(4),
    paddingVertical: height(1.2),
  },
  optionSelected: {
    backgroundColor: appColors.primarySoft,
  },
  optionText: {
    fontSize: 14,
    color: appColors.textSecondary,
  },
  optionTextSelected: {
    color: appColors.textPrimary,
    fontWeight: '600',
  },
});
