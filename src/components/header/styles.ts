import { StyleSheet } from 'react-native';
import { height, width } from '../../utils/dimensions';
import { appColors } from '../../utils/appColors';

const ICON_BOX_SIZE = height(4.2);

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: width(2),
    paddingVertical: height(1.5),
    backgroundColor: appColors.background,
  },
  backButton: {
    width: ICON_BOX_SIZE,
    height: ICON_BOX_SIZE,
    borderRadius: ICON_BOX_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: appColors.surface,
  },
  backButtonPlaceholder: {
    width: ICON_BOX_SIZE,
    height: ICON_BOX_SIZE,
  },
  title: {
    flex: 1,
    marginHorizontal: width(3),
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '600',
    color: appColors.textPrimary,
  },
  rightPlaceholder: {
    width: ICON_BOX_SIZE,
    height: ICON_BOX_SIZE,
  },
});
