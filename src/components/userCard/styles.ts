import { StyleSheet } from 'react-native';
import { appColors } from '../../utils/appColors';
import { width } from '../../utils/dimensions';
import { height } from '../../utils/dimensions';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: height(2),
    marginHorizontal: width(6),
    paddingHorizontal: width(4),
    paddingTop: height(2.5),
    paddingBottom: height(2),
    borderRadius: 24,
    backgroundColor: appColors.surface,
    alignItems: 'center',
  },
  avatarWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: appColors.background,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: appColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    color: appColors.textPrimary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  info: {
    flex: 1,
    marginLeft: 14,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    color: appColors.textPrimary,
  },
  username: {
    fontSize: 14,
    color: appColors.textMuted,
    marginTop: 2,
  },
  location: {
    fontSize: 13,
    color: appColors.textMuted,
    marginTop: 4,
  },
  arrow: {
    paddingLeft: 8,
  },
  arrowText: {
    fontSize: 24,
    color: appColors.textMuted,
  },
});
