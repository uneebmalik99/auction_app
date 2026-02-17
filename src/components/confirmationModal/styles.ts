import { StyleSheet } from 'react-native';
import { width } from '../../utils/dimensions';
import { appColors } from '../../utils/appColors';

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
  },
  container: {
    backgroundColor: appColors.surface,
    borderRadius: 20,
    padding: 24,
    width: width(100),
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: appColors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 12,
    borderRadius: 8,
    backgroundColor: appColors.background,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    color: appColors.textPrimary,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 12,
    borderRadius: 8,
    backgroundColor: appColors.primary,
    alignItems: 'center',
  },
  confirmText: {
    fontSize: 16,
    color: appColors.buttonText,
    fontWeight: '600',
  },
});

export default styles;
