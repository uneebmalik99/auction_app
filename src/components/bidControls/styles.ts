import { StyleSheet, Platform } from 'react-native';
import { height, width } from '../../utils/dimensions';
import { appColors } from '../../utils/appColors';

export const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  bidInput: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1976d2',
    textAlign: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#1976d2',
    minWidth: 160,
    ...Platform.select({
      ios: {
        paddingBottom: 4,
      },
    }),
  },
  currentBidLabel: {
    marginTop: 6,
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  minIncrementText: {
    marginTop: 4,
    fontSize: 12,
    color: '#888',
  },

  bottomCard: {
    marginTop: height(1.5),
    marginHorizontal: width(6),
    paddingHorizontal: width(4),
    paddingTop: height(1.5),
    paddingBottom: height(2.5),
    borderRadius: 24,
    backgroundColor: appColors.surface,
  },
  bidControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: height(1.5),
  },
  adjustButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: height(1.1),
    borderRadius: 999,
    backgroundColor: appColors.background,
  },
  adjustButtonPlus: {
    borderWidth: 1,
    borderColor: '#f97316',
    backgroundColor: 'transparent',
  },
  adjustIcon: {
    fontSize: 16,
    fontWeight: '700',
    color: appColors.textPrimary,
  },
  adjustText: {
    fontSize: 13,
    color: appColors.textPrimary,
  },
  currentBidBlock: {
    alignItems: 'center',
  },
  currentBidMain: {
    fontSize: 18,
    fontWeight: '700',
    color: appColors.textPrimary,
  },
  currentBidSecondary: {
    fontSize: 13,
    color: appColors.textMuted,
    marginTop: 2,
  },
  makeBidButton: {
    marginTop: height(1),
    borderRadius: 999,
    backgroundColor: '#f97316',
  },
});
