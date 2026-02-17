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
  },
  contentContainer: {
    paddingTop: height(4),
    paddingHorizontal: width(6),
    paddingBottom: height(4),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height(3),
  },
  welcomeText: {
    fontSize: 14,
    color: appColors.textMuted,
  },
  userName: {
    marginTop: 4,
    fontSize: 22,
    fontWeight: '700',
    color: appColors.textPrimary,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: appColors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: appColors.textSecondary,
    fontWeight: '600',
  },
  summaryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: appColors.surface,
    paddingVertical: height(2),
    paddingHorizontal: width(4),
    borderRadius: 16,
    marginBottom: height(3),
  },
  summaryLabel: {
    fontSize: 12,
    color: appColors.textMuted,
  },
  summaryValue: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: '600',
    color: appColors.textPrimary,
  },
  summaryRight: {
    alignItems: 'flex-end',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: height(1.5),
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: appColors.textSecondary,
  },
  sectionLink: {
    fontSize: 12,
    color: appColors.primary,
  },
  chipRow: {
    flexDirection: 'row',
    marginBottom: height(3),
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: appColors.outline,
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: appColors.primary,
    borderColor: appColors.primary,
  },
  chipText: {
    fontSize: 12,
    color: appColors.textMuted,
  },
  chipTextActive: {
    color: appColors.buttonText,
  },
  listContent: {
    paddingBottom: height(2),
  },
  card: {
    backgroundColor: appColors.surface,
    borderRadius: 16,
    marginBottom: height(2),
    overflow: 'hidden',
  },
  cardContent: {
    paddingVertical: height(2),
    paddingHorizontal: width(4),
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: appColors.textPrimary,
    marginBottom: height(1.5),
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardLabel: {
    fontSize: 12,
    color: appColors.textMuted,
  },
  cardValue: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: '600',
    color: appColors.textSecondary,
  },
  cardRight: {
    alignItems: 'flex-end',
  },
});
