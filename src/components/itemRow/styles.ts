import { StyleSheet } from 'react-native';
import { appColors } from '../../utils/appColors';
import { height, width } from '../../utils/dimensions';

// Optional: Move styles here or keep them shared
export const styles = StyleSheet.create({
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: appColors.inputBorder,
    flex: 1,
  },
  itemTextContainer: {
    flex: 2,
    marginRight: 12,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: appColors.textPrimary,
  },
  itemSubtitle: {
    marginTop: 3,
    fontSize: 12,
    color: appColors.textMuted,
  },
  itemStatus: {
    fontSize: 12,
    color: appColors.textSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeStatusContainer: {
    flex: 1.5,
  },
  itemStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 5,
    backgroundColor: appColors.green,
    marginRight: 2,
  },
});
