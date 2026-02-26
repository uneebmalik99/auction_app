import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Download, UserCircle, Phone, CalendarDays, Bolt } from 'lucide-react-native';
import { appColors } from '../../../../utils/appColors';
import type { Vehicle } from '../lib/types';
import { getSalePrice } from '../lib/utils';

interface InvoiceItemProps {
  vehicle: Vehicle;
  onDownload: (vehicle: Vehicle) => void;
}

export default function InvoiceItem({ vehicle, onDownload }: InvoiceItemProps) {
  const salePrice = getSalePrice(vehicle);
  const saleDate = new Date(vehicle.updatedAt || vehicle.createdAt);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onDownload(vehicle)}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.vehicleInfo}>
          {vehicle.photos && vehicle.photos[0] && (
            <Image
              source={{ uri: vehicle.photos[0] }}
              style={styles.image}
            />
          )}
          <View style={[styles.vehicleDetails, { marginLeft: vehicle.photos && vehicle.photos[0] ? 12 : 0 }]}>
            <Text style={styles.title}>{vehicle.title}</Text>
            <Text style={styles.subtitle}>
              {vehicle.make} {vehicle.model} • {vehicle.year}
            </Text>
            <Text style={styles.vin}>VIN: {vehicle.vin}</Text>
          </View>
        </View>

        <View style={styles.priceSection}>
          <Text style={styles.price}>${salePrice.toLocaleString()}</Text>
          {vehicle.buyNowEnabled && (
            <View style={styles.buyNowBadge}>
              <Bolt size={12} color={appColors.yellow} />
              <Text style={[styles.buyNowText, { marginLeft: 4 }]}>Buy Now</Text>
            </View>
          )}
        </View>

        <View style={styles.buyerSection}>
          {vehicle.winnerName ? (
            <View style={styles.buyerInfo}>
              <UserCircle size={16} color={appColors.purple} />
              <View style={[styles.buyerDetails, { marginLeft: 8 }]}>
                <Text style={styles.buyerName}>{vehicle.winnerName}</Text>
                {vehicle.winnerEmail && (
                  <Text style={styles.buyerEmail}>{vehicle.winnerEmail}</Text>
                )}
                {vehicle.winnerPhone && (
                  <View style={styles.phoneRow}>
                    <Phone size={12} color={appColors.textMuted} />
                    <Text style={[styles.buyerPhone, { marginLeft: 4 }]}>{vehicle.winnerPhone}</Text>
                  </View>
                )}
              </View>
            </View>
          ) : (
            <Text style={styles.noBuyer}>No buyer info</Text>
          )}
        </View>

        <View style={styles.dateSection}>
          <CalendarDays size={14} color={appColors.blue} />
          <View style={[styles.dateInfo, { marginLeft: 8 }]}>
            <Text style={styles.date}>
              {saleDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </Text>
            <Text style={styles.time}>
              {saleDate.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.downloadButton}
        onPress={() => onDownload(vehicle)}
        activeOpacity={0.7}
      >
        <Download size={16} color={appColors.red} />
        <Text style={[styles.downloadText, { marginLeft: 8 }]}>Download</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: appColors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: appColors.inputBorder,
  },
  content: {
    marginBottom: 12,
  },
  vehicleInfo: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: appColors.inputBorder,
  },
  vehicleDetails: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: appColors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: appColors.textMuted,
    fontWeight: '500',
  },
  vin: {
    fontSize: 11,
    color: appColors.textMuted,
    fontFamily: 'monospace',
    marginTop: 4,
  },
  priceSection: {
    marginBottom: 12,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: appColors.textPrimary,
    marginBottom: 4,
  },
  buyNowBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: appColors.yellow + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: appColors.yellow + '40',
  },
  buyNowText: {
    fontSize: 10,
    fontWeight: '600',
    color: appColors.yellow,
  },
  buyerSection: {
    marginBottom: 12,
  },
  buyerInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  buyerDetails: {
    flex: 1,
  },
  buyerName: {
    fontSize: 13,
    fontWeight: '600',
    color: appColors.textPrimary,
  },
  buyerEmail: {
    fontSize: 11,
    color: appColors.textMuted,
    marginTop: 2,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  buyerPhone: {
    fontSize: 11,
    color: appColors.textMuted,
  },
  noBuyer: {
    fontSize: 12,
    color: appColors.textMuted,
    fontStyle: 'italic',
  },
  dateSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateInfo: {
    flex: 1,
  },
  date: {
    fontSize: 13,
    fontWeight: '600',
    color: appColors.textPrimary,
  },
  time: {
    fontSize: 11,
    color: appColors.textMuted,
    marginTop: 2,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: appColors.red + '20',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: appColors.red + '40',
  },
  downloadText: {
    fontSize: 14,
    fontWeight: '600',
    color: appColors.red,
  },
});
