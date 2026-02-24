/**
 * ChatInput.tsx
 * Bottom input bar with:
 *  - Attach file button (image / video / document picker)
 *  - Text input
 *  - Send button with loading spinner
 *  - Upload progress banner
 *
 * Dependencies (bare React Native):
 *   yarn add react-native-image-picker react-native-document-picker
 *   cd ios && pod install
 *
 * Permissions setup:
 *   Android – add to AndroidManifest.xml:
 *     <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
 *     <uses-permission android:name="android.permission.READ_MEDIA_VIDEO" />
 *     <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
 *
 *   iOS – add to Info.plist:
 *     NSPhotoLibraryUsageDescription
 *     NSCameraUsageDescription (if camera is needed)
 */

import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import {
  launchImageLibrary,
  type ImageLibraryOptions,
  type Asset,
} from 'react-native-image-picker';
import DocumentPicker, {
  type DocumentPickerResponse,
  types,
} from 'react-native-document-picker';
import { styles } from './styles';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface PickedFile {
  uri: string;
  name: string;
  type: string; // MIME type
  size: number;
}

interface Props {
  value: string;
  onChange: (text: string) => void;
  onSend: () => void;
  onFileSelected: (file: PickedFile) => void;
  sending: boolean;
  uploading: boolean;
  disabled: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Request READ_MEDIA_* permissions on Android 13+, READ_EXTERNAL_STORAGE below. */
async function requestAndroidMediaPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') return true;

  const sdkVersion = Platform.Version as number;

  if (sdkVersion >= 33) {
    const statuses = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
    ]);
    return Object.values(statuses).every(
      (s) => s === PermissionsAndroid.RESULTS.GRANTED,
    );
  }

  const status = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
  );
  return status === PermissionsAndroid.RESULTS.GRANTED;
}

/** Derive MIME type from an image/video asset returned by react-native-image-picker. */
function assetToPickedFile(asset: Asset): PickedFile {
  const uri = asset.uri ?? '';
  const ext = uri.split('.').pop()?.toLowerCase() ?? 'jpg';
  const isVideo = asset.type?.startsWith('video') ?? false;
  const mime = asset.type ?? (isVideo ? `video/${ext}` : `image/${ext}`);

  return {
    uri,
    name: asset.fileName ?? `file.${ext}`,
    type: mime,
    size: asset.fileSize ?? 0,
  };
}

/** Convert a react-native-document-picker result to PickedFile. */
function docToPickedFile(doc: DocumentPickerResponse): PickedFile {
  return {
    uri: doc.uri,
    name: doc.name ?? 'document',
    type: doc.type ?? 'application/octet-stream',
    size: doc.size ?? 0,
  };
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ChatInput({
  value,
  onChange,
  onSend,
  onFileSelected,
  sending,
  uploading,
  disabled,
}: Props) {
  // ── Photo / Video picker ───────────────────────────────────────────────────
  const pickMedia = async () => {
    const granted = await requestAndroidMediaPermission();
    if (!granted) {
      Alert.alert(
        'Permission denied',
        'Please grant media access in your device settings.',
      );
      return;
    }

    const options: ImageLibraryOptions = {
      mediaType: 'mixed', // allows both images and videos
      // quality: 0.85,
      selectionLimit: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel || response.errorCode) return;

      const asset = response.assets?.[0];
      if (asset) {
        onFileSelected(assetToPickedFile(asset));
      }
    });
  };

  // ── Document picker ────────────────────────────────────────────────────────
  const pickDocument = async () => {
    try {
      // Single file pick; use pickMultiple for multi-select
      const result = await DocumentPicker.pickSingle({
        type: [types.allFiles],
        copyTo: 'cachesDirectory', // ensures a local file:// URI on both platforms
      });

      onFileSelected(docToPickedFile(result));
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        Alert.alert('Error', 'Could not open the document picker.');
      }
    }
  };

  // ── Action sheet ───────────────────────────────────────────────────────────
  const showAttachOptions = () => {
    Alert.alert('Attach', 'Choose a source', [
      { text: 'Photo / Video', onPress: pickMedia },
      { text: 'Document', onPress: pickDocument },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {uploading && (
        <View style={styles.uploadingBanner}>
          <ActivityIndicator size="small" color="#ef4444" />
          <Text style={styles.uploadingText}>Uploading file…</Text>
        </View>
      )}

      <View style={styles.inputContainer}>
        {/* Attach button */}
        <TouchableOpacity
          style={[
            styles.attachBtn,
            (disabled || uploading) && styles.disabledBtn,
          ]}
          onPress={showAttachOptions}
          disabled={disabled || uploading}
          accessibilityLabel="Attach file"
          accessibilityRole="button"
        >
          <Text style={{ fontSize: 20 }}>📎</Text>
        </TouchableOpacity>

        {/* Text input */}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChange}
          placeholder={disabled ? 'Connecting…' : 'Type a message…'}
          placeholderTextColor="#64748b"
          multiline
          editable={!disabled && !sending}
          // On Android, blurOnSubmit={false} + onSubmitEditing lets users send
          // via the keyboard action button while still supporting newlines.
          blurOnSubmit={false}
          onSubmitEditing={Platform.OS === 'android' ? onSend : undefined}
        />

        {/* Send button */}
        <TouchableOpacity
          style={[
            styles.sendBtn,
            (!value.trim() || disabled || sending) && styles.disabledBtn,
          ]}
          onPress={onSend}
          disabled={!value.trim() || disabled || sending}
          accessibilityLabel="Send message"
          accessibilityRole="button"
        >
          {sending ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={{ color: '#fff', fontSize: 18 }}>➤</Text>
          )}
        </TouchableOpacity>
      </View>
    </>
  );
}