import { StyleSheet } from 'react-native';
import { height } from '../../utils/dimensions';
import { appColors } from '../../utils/appColors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: height(4),
    paddingTop: height(2),
  },
  headerText: {
    fontSize: 20,
    fontWeight: '600',
    color: appColors.textSecondary,
    marginBottom: height(2),
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: height(1),
  },
  checkboxBox: {
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
  checkboxBoxChecked: {
    backgroundColor: appColors.primary,
    borderColor: appColors.primary,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 12,
    color: appColors.textSecondary,
  },
  helperRow: {
    marginTop: height(1),
    alignItems: 'flex-start',
  },
  helperText: {
    fontSize: 12,
    color: appColors.textMuted,
  },
  createAccountText: {
    color: appColors.gray,
  },
  submitButton: {
    marginTop: height(2),
  },
});
