import { StyleSheet } from 'react-native';
import { appColors } from '../../utils/appColors';
import { height } from '../../utils/dimensions';

const styles = StyleSheet.create({
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: height(1),
  },
  divider: {
    marginTop: height(1.8),
    height: 1,
    backgroundColor: appColors.inputBorder,
  },
  footerLabel: {
    fontSize: 12,
    color: appColors.textSecondary,
    marginRight: 4,
  },
  footerValue: {
    fontSize: 12,
    fontWeight: '600',
    color: appColors.primary,
  },
});

export default styles;
