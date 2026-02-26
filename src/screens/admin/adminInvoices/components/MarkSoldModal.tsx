import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { X, CheckCircle } from 'lucide-react-native';
import { appColors } from '../../../../utils/appColors';
import type { Vehicle, BuyerInfo } from '../lib/types';

interface MarkSoldModalProps {
  visible: boolean;
  vehicle: Vehicle | null;
  buyerInfo: BuyerInfo;
  onClose: () => void;
  onConfirm: () => void;
  onBuyerInfoChange: (info: BuyerInfo) => void;
}

export default function MarkSoldModal({
  visible,
  vehicle,
  buyerInfo,
  onClose,
  onConfirm,
  onBuyerInfoChange,
}: MarkSoldModalProps) {
  const handleConfirm = () => {
    if (!buyerInfo.winnerName.trim()) {
      Alert.alert('Error', 'Buyer name is required');
      return;
    }
    onConfirm();
  };

  if (!vehicle) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.headerIcon}>
                <CheckCircle size={20} color={appColors.green} />
              </View>
              <Text style={styles.headerTitle}>Mark Vehicle as Sold</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={20} color={appColors.textMuted} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={styles.vehicleInfoBox}>
              <Text style={styles.vehicleInfoLabel}>Selected Vehicle</Text>
              <Text style={styles.vehicleInfoTitle}>{vehicle.title}</Text>
              <Text style={styles.vehicleInfoVin}>VIN: {vehicle.vin}</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Buyer Name *</Text>
                <TextInput
                  style={styles.input}
                  value={buyerInfo.winnerName}
                  onChangeText={(text) =>
                    onBuyerInfoChange({ ...buyerInfo, winnerName: text })
                  }
                  placeholder="Enter buyer's full name"
                  placeholderTextColor={appColors.textMuted}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Buyer Email</Text>
                <TextInput
                  style={styles.input}
                  value={buyerInfo.winnerEmail}
                  onChangeText={(text) =>
                    onBuyerInfoChange({ ...buyerInfo, winnerEmail: text })
                  }
                  placeholder="Enter buyer's email"
                  placeholderTextColor={appColors.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Buyer Phone</Text>
                <TextInput
                  style={styles.input}
                  value={buyerInfo.winnerPhone}
                  onChangeText={(text) =>
                    onBuyerInfoChange({ ...buyerInfo, winnerPhone: text })
                  }
                  placeholder="Enter buyer's phone number"
                  placeholderTextColor={appColors.textMuted}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  !buyerInfo.winnerName.trim() && styles.confirmButtonDisabled,
                ]}
                onPress={handleConfirm}
                disabled={!buyerInfo.winnerName.trim()}
                activeOpacity={0.7}
              >
                <Text style={styles.confirmButtonText}>Confirm Sale</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modal: {
    backgroundColor: appColors.surface,
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: appColors.green + '40',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: appColors.inputBorder,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: appColors.green + '20',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: appColors.green + '40',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: appColors.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 20,
  },
  vehicleInfoBox: {
    backgroundColor: appColors.background,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: appColors.inputBorder,
  },
  vehicleInfoLabel: {
    fontSize: 12,
    color: appColors.textMuted,
    marginBottom: 4,
  },
  vehicleInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: appColors.textPrimary,
  },
  vehicleInfoVin: {
    fontSize: 11,
    color: appColors.textMuted,
    marginTop: 4,
  },
  form: {
    gap: 16,
    marginBottom: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: appColors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: appColors.background,
    borderWidth: 1,
    borderColor: appColors.inputBorder,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: appColors.textPrimary,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: appColors.green,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    opacity: 0.5,
  },
  confirmButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: appColors.white,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: appColors.background,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: appColors.textPrimary,
  },
});
