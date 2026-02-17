import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles';
import { Input, Button, Header } from '../../components';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { updateProfile } from '../../api/autentication';
import { setUser } from '../../redux/profileSlice';
import { getItem } from '../../utils/methods';
import type { RootNavigationProp, User } from '../../utils/types';
import { useImagePicker } from '../../hooks/useImagePicker';
import { Camera, X } from 'lucide-react-native';
import { appColors } from '../../utils/appColors';

export default function EditProfile() {
  const navigation = useNavigation<RootNavigationProp>();
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.profile.user);

  console.log('user', user);

  const { images, pickImages, removeImage, clearImages, setImagesFromUris } =
    useImagePicker({
      maxImages: 1,
    });

  // Pre-fill from current user data stored in Redux
  const [name, setName] = useState(user?.name ?? '');
  const [email] = useState(user?.email ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [address, setAddress] = useState(user?.address ?? '');
  const [saving, setSaving] = useState(false);

  // Current profile image (from user data)
  const currentImageUri = user?.profileImage || ''; // adjust field name if different

  // The image to show: picked new one > current one > placeholder
  const displayImageUri = images.length > 0 ? images[0].uri : currentImageUri;

  const handleSave = async () => {
    console.log('images', images);

    try {
      setSaving(true);

      // Get stored auth token from AsyncStorage
      const token = await getItem<string>('auth_token');
      const payload = {
        id: user?.id,
        name,
        email,
        phone,
        address,
        profileImage: images.length > 0 ? images[0].uri : user?.profileImage,
      };

      const updated = await updateProfile(payload as User, token as string);

      console.log('updated', updated);

      dispatch(setUser(updated?.user || {}));

      Alert.alert('Profile updated', 'Your changes have been saved.', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error('Update profile error', error);
      Alert.alert(
        'Update failed',
        error instanceof Error
          ? error.message
          : 'Unable to update profile. Please try again.',
      );
    } finally {
      setSaving(false);
    }
  };

  const handlePickImage = async () => {
    if (images.length > 0) {
      clearImages();
    } else {
      pickImages();
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header titleKey="editProfile.title" />
      <View style={styles.container}>
        {/* <Text style={styles.title}>Edit profile</Text>
        <Text style={styles.subtitle}>
          Update your personal information used across the app.
        </Text> */}

        <View style={styles.avatarSection}>
          <TouchableOpacity>
            {displayImageUri ? (
              <Image source={{ uri: displayImageUri }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarInitial}>
                  {user?.name?.charAt(0).toUpperCase() || '?'}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={handlePickImage}
              disabled={saving}
            >
              {images.length > 0 ? (
                <X size={18} color={appColors.textPrimary} />
              ) : (
                <Camera size={18} color={appColors.textPrimary} />
              )}
            </TouchableOpacity>

            {saving && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="small" color={appColors.textPrimary} />
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.formSection}>
          <Input
            label="Full name"
            value={name}
            onChangeText={setName}
            placeholder="Your name"
          />

          <Input
            label="Email address"
            value={email}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={false}
          />

          <Input
            label="Phone number"
            value={phone}
            onChangeText={setPhone}
            placeholder="Your phone number"
          />

          <Input
            label="Address"
            value={address}
            onChangeText={setAddress}
            placeholder="Your address"
          />
        </View>

        <View style={styles.actionsRow}>
          <Button
            label={saving ? 'Saving...' : 'Save changes'}
            onPress={handleSave}
            buttonStyle={styles.primaryButton}
            disabled={saving}
          />
          <Button
            label="Cancel"
            variant="secondary"
            onPress={handleCancel}
            buttonStyle={styles.secondaryButton}
            disabled={saving}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
