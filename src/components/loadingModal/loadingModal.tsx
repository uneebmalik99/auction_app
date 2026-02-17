import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import Modal from 'react-native-modal';
import { styles } from './styles';
import { appColors } from '../../utils/appColors';

interface LoadingModalProps {
  visible: boolean;
  message?: string;
}

export default function LoadingModal({
  visible,
  message = 'Please wait...',
}: LoadingModalProps) {
  return (
    <Modal
      isVisible={visible}
      backdropOpacity={0.6}
      animationIn="fadeIn"
      animationOut="fadeOut"
      useNativeDriver
      hideModalContentWhileAnimating
    >
      <View style={styles.backdrop}>
        <View style={styles.container}>
          <ActivityIndicator
            style={styles.spinner}
            size="large"
            color={appColors.primary}
          />
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
}
