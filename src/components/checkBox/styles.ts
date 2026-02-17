import { StyleSheet } from 'react-native';
import { height } from '../../utils/dimensions';
import { appColors } from '../../utils/appColors';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: height(1),
  },
  box: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: appColors.outline,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  boxChecked: {
    backgroundColor: appColors.primary,
    borderColor: appColors.primary,
  },
  label: {
    flex: 1,
    fontSize: 12,
    color: appColors.textSecondary,
  },
  disabled: {
    opacity: 0.6,
  },
});
