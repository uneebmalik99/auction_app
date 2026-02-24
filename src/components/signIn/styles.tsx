import { StyleSheet } from 'react-native';
import { height } from '../../utils/dimensions';
import { appColors } from '../../utils/appColors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  headerText: {
    fontSize: 20,
    fontWeight: '600',
    color: appColors.textSecondary,
    marginBottom: height(2),
  },
  helperRow: {
    marginTop: height(1),
    alignItems: 'flex-end',
  },
  helperText: {
    fontSize: 12,
    color: appColors.textMuted,
  },
  submitButton: {
    marginTop: height(2),
  },
  createAccountText: {
    color: appColors.gray,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: height(1),
  },
  checkboxLabel: {
    fontSize: 12,
    color: appColors.textSecondary,
  },
});
