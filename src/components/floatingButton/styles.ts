import { StyleSheet } from 'react-native';
import { appColors } from '../../utils/appColors';
import { height, width } from '../../utils/dimensions';

export const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: height(2),
    right: width(2),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    backgroundColor: appColors.primary,
    zIndex: 1000,
  },
});

export default styles;
