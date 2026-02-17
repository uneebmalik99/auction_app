import { StyleSheet } from 'react-native';
import { appColors } from '../../utils/appColors';
import { height } from '../../utils/dimensions';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityIndicator: {
    marginBottom: height(2),
  },
  text: {
    fontSize: 16,
    color: appColors.textPrimary,
  },
});
