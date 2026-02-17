// components/ImagePreviewModal.tsx
import React from 'react';
import { View, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import styles from './styles';
import { X } from 'lucide-react-native';
import { appColors } from '../../utils/appColors';
import Modal from 'react-native-modal';

interface ImagePreviewModalProps {
  visible: boolean;
  imageUri: string | null;
  onClose: () => void;
}

export default function ImagePreviewModal({
  visible,
  imageUri,
  onClose,
}: ImagePreviewModalProps) {
  if (!imageUri) return null;

  return (
    <Modal
      isVisible={visible}
      animationIn="fadeIn"
      animationOut="fadeOut"
      style={styles.container}
      animationInTiming={300}
      animationOutTiming={300}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={28} color={appColors.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
}
