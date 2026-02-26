import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FileText, DollarSign, BarChart3 } from 'lucide-react-native';
import { appColors } from '../../../../utils/appColors';
import type { InvoiceStats } from '../lib/types';

interface StatsCardsProps {
  stats: InvoiceStats;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <View style={styles.cardInfo}>
            <Text style={styles.cardLabel}>Total Invoices</Text>
            <Text style={styles.cardValue}>{stats.totalInvoices}</Text>
            <Text style={styles.cardSubtext}>Available for download</Text>
          </View>
          <View style={styles.cardIcon}>
            <FileText size={32} color={appColors.yellow} />
          </View>
        </View>
      </View>

      <View style={[styles.card, styles.cardGreen]}>
        <View style={styles.cardContent}>
          <View style={styles.cardInfo}>
            <Text style={styles.cardLabelGreen}>Total Revenue</Text>
            <Text style={styles.cardValueGreen}>
              ${stats.totalRevenue.toLocaleString()}
            </Text>
            <Text style={styles.cardSubtextGreen}>From all sales</Text>
          </View>
          <View style={styles.cardIconGreen}>
            <DollarSign size={32} color={appColors.green} />
          </View>
        </View>
      </View>

      <View style={[styles.card, styles.cardOrange]}>
        <View style={styles.cardContent}>
          <View style={styles.cardInfo}>
            <Text style={styles.cardLabelOrange}>Average Sale</Text>
            <Text style={styles.cardValueOrange}>
              ${stats.averageSale.toLocaleString()}
            </Text>
            <Text style={styles.cardSubtextOrange}>Per vehicle</Text>
          </View>
          <View style={styles.cardIconOrange}>
            <BarChart3 size={32} color={appColors.orange} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  card: {
    flex: 1,
    backgroundColor: appColors.surface,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: appColors.inputBorder,
    marginRight: 12,
  },
  cardGreen: {
    borderColor: appColors.green + '40',
  },
  cardOrange: {
    borderColor: appColors.orange + '40',
    marginRight: 0,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardInfo: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 12,
    color: appColors.yellow,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardLabelGreen: {
    fontSize: 12,
    color: appColors.green,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardLabelOrange: {
    fontSize: 12,
    color: appColors.orange,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: '700',
    color: appColors.yellow,
    marginBottom: 4,
  },
  cardValueGreen: {
    fontSize: 20,
    fontWeight: '700',
    color: appColors.green,
    marginBottom: 4,
  },
  cardValueOrange: {
    fontSize: 20,
    fontWeight: '700',
    color: appColors.orange,
    marginBottom: 4,
  },
  cardSubtext: {
    fontSize: 10,
    color: appColors.textMuted,
  },
  cardSubtextGreen: {
    fontSize: 10,
    color: appColors.textMuted,
  },
  cardSubtextOrange: {
    fontSize: 10,
    color: appColors.textMuted,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: appColors.yellow + '20',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: appColors.yellow + '40',
  },
  cardIconGreen: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: appColors.green + '20',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: appColors.green + '40',
  },
  cardIconOrange: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: appColors.orange + '20',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: appColors.orange + '40',
  },
});
