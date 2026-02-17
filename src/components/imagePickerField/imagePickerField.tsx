import React from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { X } from 'lucide-react-native';
import { styles } from './styles';
import type { PickedImage } from '../../hooks/useImagePicker';

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
  const canAddMore = images.length < maxImages;

  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.helperText}>
        {helperText ?? 'Add clear exterior and interior photos of the car.'}
      </Text>

      <View style={styles.row}>
        {canAddMore && (
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.addCard}
            onPress={onAddPress}
          >
            <Text style={styles.addIcon}>＋</Text>
            <Text style={styles.addText}>Add images</Text>
          </TouchableOpacity>
        )}

        {images.length > 0 && (
          <FlatList
            horizontal
            data={images}
            keyExtractor={item => item.uri}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <View style={styles.thumbWrapper}>
                <Image source={{ uri: item.uri }} style={styles.thumb} />
                {onRemoveImage ? (
                  <TouchableOpacity
                    style={styles.removeButton}
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

      <Text style={styles.counterText}>
        {images.length}/{maxImages} images selected
      </Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}
