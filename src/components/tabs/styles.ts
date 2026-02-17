import { StyleSheet } from 'react-native';
import { appColors } from '../../utils/appColors';
import { height, width } from '../../utils/dimensions';

export const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    marginTop: height(2),
    marginBottom: height(1.5),
    marginHorizontal: width(6),
    backgroundColor: appColors.surface,
    borderRadius: 999,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: height(1.2),
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonActive: {
    backgroundColor: appColors.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: appColors.textMuted,
  },
  tabTextActive: {
    color: appColors.buttonText,
  },
});

export default styles;
