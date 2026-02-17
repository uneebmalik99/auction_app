import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import styles from './styles';
import { Button } from '..';

interface ConfirmationModalProps {
  isVisible: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationModal({
  isVisible,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onCancel} // Tap outside to cancel
      onBackButtonPress={onCancel} // Android back button
      animationIn="lightSpeedIn"
      animationOut="lightSpeedOut"
      backdropOpacity={0.5}
      style={styles.modal}
      useNativeDriverForBackdrop={true}
      useNativeDriver={true}
      animationInTiming={700}
      animationOutTiming={700}
    >
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>

        <View style={styles.buttonsRow}>
          <Button
            label={cancelText}
            onPress={onCancel}
            variant="secondary"
            buttonStyle={styles.cancelButton}
            textStyle={styles.cancelText}
          />

          <Button
            label={confirmText}
            onPress={onConfirm}
            variant="primary"
            buttonStyle={styles.confirmButton}
            textStyle={styles.confirmText}
          />
        </View>
      </View>
    </Modal>
  );
}
