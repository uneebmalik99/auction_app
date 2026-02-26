import { StyleSheet } from 'react-native';
import { appColors } from '../../../utils/appColors';
import { width, height } from '../../../utils/dimensions';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: appColors.background,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: width(4),
    paddingBottom: height(4),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: height(2),
  },
  backButton: {
    padding: 4,
    marginTop: 4,
  },
  headerContent: {
    flex: 1,
    marginLeft: 12,
  },
  headerLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    color: appColors.textMuted,
    fontWeight: '600',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: appColors.textPrimary,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: appColors.textMuted,
  },
  markSoldButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: appColors.green + '20',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: appColors.green + '40',
    marginTop: 12,
  },
  markSoldButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: appColors.green,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: appColors.red + '10',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: appColors.red,
    marginBottom: height(2),
  },
  errorContent: {
    flex: 1,
    marginLeft: 12,
  },
  errorTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: appColors.red,
    marginBottom: 4,
  },
  errorText: {
    fontSize: 13,
    color: appColors.red,
  },
  invoicesSection: {
    marginTop: height(2),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: appColors.textPrimary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: appColors.textMuted,
  },
  invoiceCount: {
    backgroundColor: appColors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: appColors.inputBorder,
  },
  invoiceCountText: {
    fontSize: 14,
    fontWeight: '600',
    color: appColors.textPrimary,
  },
});
