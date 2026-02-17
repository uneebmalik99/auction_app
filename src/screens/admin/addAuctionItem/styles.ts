import { StyleSheet } from 'react-native';
import { height, width } from '../../../utils/dimensions';
import { appColors } from '../../../utils/appColors';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: appColors.background,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: height(2),
    paddingHorizontal: width(6),
    paddingBottom: height(12), // leave space for bottom bar
  },
  wizardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: appColors.textMuted,
    letterSpacing: 1,
    marginBottom: height(0.6),
  },
  wizardSubtitle: {
    fontSize: 12,
    color: appColors.textMuted,
    lineHeight: 16,
    marginBottom: height(2),
  },
  stepperWrap: {
    backgroundColor: appColors.surface,
    borderRadius: 18,
    paddingHorizontal: width(4),
    paddingVertical: height(1.8),
    marginBottom: height(2),
  },
  stepperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepItem: {
    alignItems: 'center',
    width: '25%',
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: appColors.inputBackground,
    borderWidth: 1,
    borderColor: appColors.inputBorder,
  },
  stepCircleActive: {
    backgroundColor: appColors.primary,
    borderColor: appColors.primary,
  },
  stepCircleDone: {
    backgroundColor: appColors.primarySoft,
    borderColor: appColors.primarySoft,
  },
  stepLabel: {
    marginTop: 8,
    fontSize: 11,
    color: appColors.textMuted,
    fontWeight: '600',
  },
  stepLabelActive: {
    color: appColors.textPrimary,
  },
  progressTrack: {
    marginTop: height(1.4),
    height: 6,
    borderRadius: 999,
    backgroundColor: appColors.inputBackground,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: appColors.primary,
    borderRadius: 999,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: height(1),
  },
  validationHint: {
    marginTop: -height(0.6),
    marginBottom: height(1.2),
    fontSize: 12,
    color: appColors.orange,
    lineHeight: 16,
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: appColors.textPrimary,
  },
  stepCount: {
    fontSize: 12,
    color: appColors.textMuted,
    fontWeight: '600',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: appColors.textPrimary,
    marginBottom: height(0.8),
  },
  subtitle: {
    fontSize: 13,
    color: appColors.textMuted,
    marginBottom: height(2.5),
    lineHeight: 18,
  },
  formSection: {
    backgroundColor: appColors.surface,
    borderRadius: 18,
    paddingHorizontal: width(5),
    paddingVertical: height(2),
    marginBottom: height(1.8),
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: appColors.textPrimary,
    marginBottom: height(1.2),
  },
  sectionSubtitle: {
    marginTop: -height(0.6),
    marginBottom: height(1.2),
    fontSize: 12,
    color: appColors.textMuted,
    lineHeight: 16,
  },
  optionsLabel: {
    marginTop: height(1.5),
    marginBottom: height(0.5),
    fontSize: 13,
    fontWeight: '500',
    color: appColors.textSecondary,
  },
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionItem: {
    flex: 1,
    marginRight: width(2),
  },
  textArea: {
    height: height(12),
    textAlignVertical: 'top',
  },
  helperText: {
    marginTop: -8,
    marginBottom: 8,
    fontSize: 12,
    color: appColors.textMuted,
  },
  vinStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: -8,
    marginBottom: 8,
  },
  primaryButton: {
    marginTop: height(1),
  },
  reviewLine: {
    fontSize: 14,
    fontWeight: '700',
    color: appColors.textPrimary,
  },
  reviewSubLine: {
    marginTop: 6,
    fontSize: 12,
    color: appColors.textMuted,
    lineHeight: 16,
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: width(6),
    paddingTop: height(1.2),
    paddingBottom: height(2.5),
    backgroundColor: appColors.background,
    borderTopWidth: 1,
    borderTopColor: appColors.inputBorder,
    flexDirection: 'row',
    gap: 12,
  },
  bottomButton: {
    flex: 1,
    marginTop: 0,
  },
  // Optional label
  optionalLabel: {
    fontSize: 12,
    fontWeight: '400',
    color: appColors.textMuted,
  },
  // Media display
  uploadedMediaCard: {
    backgroundColor: appColors.surface,
    borderWidth: 1,
    borderColor: appColors.gray,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
  },

  uploadedMediaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  uploadedFileName: {
    flex: 1,
    fontSize: 13,
    color: appColors.textPrimary,
    fontWeight: '500',
  },
   mediaImagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },

  mediaImageItem: {
    position: 'relative',
    width: '32%',
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: appColors.surface,
    borderWidth: 1,
    borderColor: appColors.gray,
  },

  mediaImage: {
    width: '100%',
    height: '100%',
  },

  mediaImageRemoveBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: appColors.red,
    justifyContent: 'center',
    alignItems: 'center',
  },

   // Upload Button Styles
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: appColors.primary,
    borderRadius: 8,
    backgroundColor: appColors.green,
    marginBottom: 12,
  },

// Required indicator
   requiredStar: {
    color: appColors.red,
    fontSize: 14,
    fontWeight: '700',
  },

  uploadButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: appColors.primary,
    marginLeft: 8,
  },

  emptyStateBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
    backgroundColor: appColors.surface,
    borderWidth: 1,
    borderColor: appColors.gray,
    borderRadius: 8,
    marginTop: 12,
  },

  emptyStateText: {
    fontSize: 13,
    color: appColors.textMuted,
    marginTop: 12,
    textAlign: 'center',
  },

  documentsList: {
    backgroundColor: appColors.surface,
    borderWidth: 1,
    borderColor: appColors.gray,
    borderRadius: 8,
    marginBottom: 12,
  },

  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: appColors.gray,
  },

  documentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },

  documentName: {
    fontSize: 13,
    color: appColors.textPrimary,
    fontWeight: '500',
    flex: 1,
  },

  readOnlyOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 8,
  },

  // Condition Card Styles
  conditionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 8,
  },
  conditionCard: {
    flex: 1,
    minWidth: '48%',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: appColors.gray,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: appColors.surface,
  },
  conditionCardActive: {
    borderColor: appColors.primary,
    backgroundColor: appColors.background,
  },
  conditionDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  conditionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: appColors.textPrimary,
    textAlign: 'center',
  },
  conditionDescription: {
    fontSize: 10,
    color: appColors.textMuted,
    textAlign: 'center',
    marginTop: 4,
  },

  // Image Selector Styles
  imageSelectorRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  imageThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: appColors.blue,
    overflow: 'hidden',
  },
  imageThumbnailActive: {
    borderColor: appColors.primary,
  },
  imageThumbnailImg: {
    width: '100%',
    height: '100%',
  },

  // Damage Canvas Styles
  damageCanvasWrapper: {
    position: 'relative',
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: appColors.surface,
    aspectRatio: 1,
  },
  damageCanvasImage: {
    width: '100%',
    height: '100%',
  },
  damageMark: {
    position: 'absolute',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -20,
    marginTop: -20,
  },
  damageMarkCircle: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#EF4444',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  damageMarkLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#EF4444',
    zIndex: 1,
  },

  // Damage Type Buttons
  damageTypeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 8,
  },
  damageTypeButton: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: appColors.blue,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  damageTypeButtonActive: {
    borderColor: appColors.primary,
    backgroundColor: appColors.black,
  },
  damageTypeText: {
    fontSize: 12,
    fontWeight: '500',
    color: appColors.textMuted,
    textAlign: 'center',
  },
  damageTypeTextActive: {
    color: appColors.primary,
    fontWeight: '600',
  },

  // Damage Report List
  damageReportList: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: appColors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: appColors.black,
  },
  damageReportItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: appColors.outline,
  },
  damageReportItemText: {
    fontSize: 13,
    color: appColors.textPrimary,
    fontWeight: '500',
  },
  removeDamageText: {
    fontSize: 12,
    color: appColors.red,
    fontWeight: '600',
  },

  // Review Card
  reviewCard: {
    backgroundColor: appColors.surface,
    borderWidth: 1,
    borderColor: appColors.outline,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  // reviewLine: {
  //   fontSize: 14,
  //   fontWeight: '600',
  //   color: appColors.textPrimary,
  //   marginBottom: 8,
  // },
  // reviewSubLine: {
  //   fontSize: 12,
  //   color: appColors.textMuted,
  //   marginBottom: 4,
  // },

  // // Text Area
  // textArea: {
  //   minHeight: 120,
  //   textAlignVertical: 'top',
  // },

  // Bottom Bar
  // bottomBar: {
  //   position: 'absolute',
  //   bottom: 0,
  //   left: 0,
  //   right: 0,
  //   flexDirection: 'row',
  //   paddingHorizontal: 16,
  //   paddingVertical: 12,
  //   paddingBottom: 20,
  //   backgroundColor: appColors.background,
  //   borderTopWidth: 1,
  //   borderTopColor: appColors.surfaceSecondary,
  //   gap: 12,
  // },
  // bottomButton: {
  //   flex: 1,
  // },

  // Utility
  marginTop20: {
    marginTop: 20,
  },
});
