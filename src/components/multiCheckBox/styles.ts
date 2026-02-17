import { StyleSheet } from 'react-native';
import { height, width } from '../../utils/dimensions';

export const styles = StyleSheet.create({
  container: {
    // marginTop: height(0.5),
  },
  listContainer: {
    flexDirection: 'column',
  },
  optionRow: {
    flexDirection: 'row',
    marginBottom: height(0.5),
  },
  optionItem: {
    flex: 1,
    marginRight: width(2),
  },
});
