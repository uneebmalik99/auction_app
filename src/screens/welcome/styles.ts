import { StyleSheet } from 'react-native';
import { height, width } from '../../utils/dimensions';
import { appColors } from '../../utils/appColors';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: appColors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: width(6),
    paddingTop: height(3),
    paddingBottom: height(4),
    justifyContent: 'space-between',
  },
  heroContainer: {
    marginTop: height(4),
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: appColors.surface,
    marginBottom: height(1.5),
  },
  badgeRTL: {
    alignSelf: 'flex-end',
  },
  badgeText: {
    fontSize: 11,
    color: appColors.textMuted,
  },
  badgeTextRTL: {
    textAlign: 'right',
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: appColors.textPrimary,
    marginBottom: height(1),
  },
  titleRTL: {
    textAlign: 'right',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: appColors.textSecondary,
    marginBottom: height(2.5),
  },
  subtitleRTL: {
    textAlign: 'right',
  },
  highlightRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  highlightRowRTL: {
    flexDirection: 'row-reverse',
  },
  highlightPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: appColors.surface,
    marginRight: 8,
    marginBottom: 8,
  },
  highlightText: {
    fontSize: 12,
    color: appColors.textMuted,
  },
  highlightTextRTL: {
    textAlign: 'right',
  },
  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: height(1),
  },
  languageRowRTL: {
    flexDirection: 'row-reverse',
  },
  languageLabel: {
    fontSize: 13,
    color: appColors.textMuted,
    fontWeight: '600',
  },
  languageLabelRTL: {
    textAlign: 'right',
  },
  languageDropdown: {
    width: width(50),
    marginVertical: 0,
  },

  actionsContainer: {
    paddingTop: height(2),
  },
  primaryButton: {
    marginTop: 0,
  },
  secondaryButton: {
    marginTop: height(1.5),
  },
  secondaryButtonText: {
    color: appColors.gray,
  },
  footerText: {
    marginTop: height(2),
    textAlign: 'center',
    fontSize: 13,
    color: appColors.textMuted,
  },
  footerLink: {
    color: appColors.primary,
    fontWeight: '600',
  },
});
