import { StyleSheet } from 'react-native';
import { height } from '../../utils/dimensions';
import { appColors } from '../../utils/appColors';

export const styles = StyleSheet.create({
  container: {
    marginVertical: height(1.5),
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: appColors.textSecondary,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: height(6),
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: appColors.inputBackground,
    borderWidth: 1,
    borderColor: appColors.inputBorder,
  },
  input: {
    flex: 1,
    color: appColors.textPrimary,
  },
  toggleButton: {
    marginLeft: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '500',
    color: appColors.textSecondary,
  },
  error: {
    marginTop: 4,
    fontSize: 12,
    color: appColors.textError,
  },
});
