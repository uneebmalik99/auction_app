import { StyleSheet } from 'react-native';
import { height } from '../../utils/dimensions';
import { appColors } from '../../utils/appColors';

export const styles = StyleSheet.create({
  container: {
    marginBottom: height(1.5),
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: appColors.textSecondary,
    marginBottom: 6,
  },
  input: {
    height: height(6),
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: appColors.inputBackground,
    borderWidth: 1,
    borderColor: appColors.inputBorder,
    color: appColors.textPrimary,
  },
  error: {
    marginTop: 4,
    fontSize: 12,
    color: appColors.red,
  },
});
