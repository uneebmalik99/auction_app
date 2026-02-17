import { StyleSheet } from 'react-native';
import { height, width } from '../../utils/dimensions';
import { appColors } from '../../utils/appColors';

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    minWidth: width(60),
    paddingHorizontal: width(6),
    paddingVertical: height(2.5),
    borderRadius: 18,
    backgroundColor: appColors.surface,
    alignItems: 'center',
  },
  spinner: {
    marginBottom: height(1.5),
  },
  message: {
    fontSize: 14,
    color: appColors.textPrimary,
    textAlign: 'center',
  },
});
