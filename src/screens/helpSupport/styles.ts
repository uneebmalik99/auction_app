import { StyleSheet } from 'react-native';
import { appColors } from '../../utils/appColors';
import { height, width } from '../../utils/dimensions';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: appColors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: width(6),
    paddingTop: height(2),
  },
  introCard: {
    width: '100%',
    backgroundColor: appColors.surface,
    borderRadius: 20,
    paddingVertical: height(2.5),
    paddingHorizontal: width(6),
    marginBottom: height(2),
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: appColors.textPrimary,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 13,
    color: appColors.textMuted,
    lineHeight: 18,
  },
  actionsContainer: {
    width: '100%',
  },
  actionButton: {
    marginTop: height(1.2),
  },

  sheetModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  sheet: {
    backgroundColor: appColors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: width(6),
    paddingTop: height(1.5),
    maxHeight: '85%',
  },
  sheetHandle: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: appColors.outline,
    alignSelf: 'center',
    marginBottom: height(1.2),
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: appColors.textPrimary,
    textAlign: 'center',
  },
  sheetSubtitle: {
    marginTop: 6,
    fontSize: 12,
    color: appColors.textMuted,
    textAlign: 'center',
  },
  sheetScroll: {
    marginTop: height(1.5),
  },
  sheetContent: {
    paddingBottom: height(2),
  },
  descriptionInput: {
    height: height(14),
    paddingTop: 12,
  },
  submitButton: {
    marginTop: height(1.2),
  },
  sheetBottomSpace: {
    height: height(2),
  },
});

