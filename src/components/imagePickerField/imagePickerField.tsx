import React from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { X } from 'lucide-react-native';
import { styles } from './styles';
import type { PickedImage } from '../../hooks/useImagePicker';
import { useI18n } from '../../i18n';

interface ImagePickerFieldProps {
  label?: string;
  helperText?: string;
  images: PickedImage[];
  error?: string;
  maxImages?: number;
  onAddPress: () => void;
  onRemoveImage?: (uri: string) => void;
}

export default function ImagePickerField({
  label = 'Photos',
  helperText,
  images,
  error,
  maxImages = 10,
  onAddPress,
  onRemoveImage,
}: ImagePickerFieldProps) {
  const { t, isRTL } = useI18n();
  const canAddMore = images.length < maxImages;

  return (
    <View>
      <Text style={[styles.label, isRTL && styles.labelRTL]}>{label}</Text>
      {helperText && (
        <Text style={[styles.helperText, isRTL && styles.helperTextRTL]}>
          {helperText}
        </Text>
      )}

      <View style={[styles.row, isRTL && styles.rowRTL]}>
        {canAddMore && (
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.addCard, isRTL && styles.addCardRTL]}
            onPress={onAddPress}
          >
            <Text style={styles.addIcon}>＋</Text>
            <Text style={[styles.addText, isRTL && styles.addTextRTL]}>
              {t('imagePicker.addImages')}
            </Text>
          </TouchableOpacity>
        )}

        {images.length > 0 && (
          <FlatList
            horizontal
            data={images}
            keyExtractor={item => item.uri}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.listContent, isRTL && styles.listContentRTL]}
            renderItem={({ item }) => (
              <View style={[styles.thumbWrapper, isRTL && styles.thumbWrapperRTL]}>
                <Image source={{ uri: item.uri }} style={styles.thumb} />
                {onRemoveImage ? (
                  <TouchableOpacity
                    style={[styles.removeButton, isRTL && styles.removeButtonRTL]}
                    activeOpacity={0.8}
                    onPress={() => onRemoveImage(item.uri)}
                  >
                    <X size={12} color="#fff" strokeWidth={3} />
                  </TouchableOpacity>
                ) : null}
              </View>
            )}
          />
        )}
      </View>

      <Text style={[styles.counterText, isRTL && styles.counterTextRTL]}>
        {images.length}/{maxImages} {t('imagePicker.imagesSelected')}
      </Text>
      {error ? <Text style={[styles.errorText, isRTL && styles.errorTextRTL]}>{error}</Text> : null}
    </View>
  );
}
