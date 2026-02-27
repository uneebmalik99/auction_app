import React from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { FileText } from 'lucide-react-native';
import { appColors } from '../../../../utils/appColors';
import type { Vehicle } from '../lib/types';
import InvoiceItem from './InvoiceItem';

interface InvoiceListProps {
  vehicles: Vehicle[];
  loading: boolean;
  onDownload: (vehicle: Vehicle) => void;
}

export default function InvoiceList({ vehicles, loading, onDownload }: InvoiceListProps) {
  const sortedVehicles = [...vehicles].sort((a, b) => {
    const dateA = new Date(a.updatedAt || a.createdAt).getTime();
    const dateB = new Date(b.updatedAt || b.createdAt).getTime();
    return dateB - dateA;
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={appColors.primary} />
        <Text style={styles.loadingText}>Loading invoices...</Text>
      </View>
    );
  }

  if (sortedVehicles.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIcon}>
          <FileText size={32} color={appColors.blue} />
        </View>
        <Text style={styles.emptyTitle}>No invoices available</Text>
        <Text style={styles.emptyText}>
          Invoices will automatically appear here once vehicles are marked as sold
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={sortedVehicles}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <InvoiceItem vehicle={item} onDownload={onDownload} />
      )}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: appColors.textMuted,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: appColors.blue + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: appColors.blue + '40',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: appColors.textPrimary,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: appColors.textMuted,
    textAlign: 'center',
    maxWidth: 280,
  },
});
