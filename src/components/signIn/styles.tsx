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
  headerTextRTL: {
    textAlign: 'right',
  },
  helperRow: {
    marginTop: height(1),
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  helperRowRTL: {
    flexDirection: 'row-reverse',
  },
  helperText: {
    fontSize: 12,
    color: appColors.textMuted,
  },
  helperTextRTL: {
    textAlign: 'right',
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
