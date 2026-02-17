import { StyleSheet } from 'react-native';
import { height } from '../../utils/dimensions';
import { appColors } from '../../utils/appColors';

export const styles = StyleSheet.create({
  base: {
    height: height(6),
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height(1.5),
  },
  primary: {
    backgroundColor: appColors.primary,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: appColors.outline,
  },
  disabled: {
    opacity: 0.6,
  },
  label: {
    color: appColors.buttonText,
    fontSize: 16,
    fontWeight: '600',
  },
});
