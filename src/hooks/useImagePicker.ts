import { useCallback, useState } from 'react';
import {
  launchCamera,
  launchImageLibrary,
  type ImagePickerResponse,
  type ImageLibraryOptions,
  type CameraOptions,
} from 'react-native-image-picker';
import { Alert, PermissionsAndroid, Platform } from 'react-native';

export interface PickedImage {
  uri: string;
  fileName?: string | null;
  type?: string | null;
}

export interface UseImagePickerOptions {
  maxImages?: number;
}

export function useImagePicker(options: UseImagePickerOptions = {}) {
  const { maxImages = 10 } = options;
  const [images, setImages] = useState<PickedImage[]>([]);

  const commonOptions = {
    mediaType: 'photo' as const,
    quality: 0.8 as const,
    includeBase64: false as const,
  };

  // Request Camera Permission
  const requestCameraPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'ios') return true;

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'This app needs access to your camera to take photos.',
          buttonPositive: 'OK',
          buttonNegative: 'Cancel',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('Camera permission error:', err);
      return false;
    }
  };

  // Request Gallery (Storage) Permission
  const requestGalleryPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'ios') return true;

    console.log('Platform.Version', Platform.Version);

    // Android 13+ uses READ_MEDIA_IMAGES
    const permission =
      Platform.Version && Number(Platform.Version) >= 33
        ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

    try {
      const granted = await PermissionsAndroid.request(permission, {
        title: 'Gallery Permission',
        message: 'This app needs access to your photos.',
        buttonPositive: 'OK',
        buttonNegative: 'Cancel',
      });
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('Gallery permission error:', err);
      return false;
    }
  };

  const handlePickerResponse = useCallback(
    (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
        return;
      }
      if (response.errorCode) {
        Alert.alert('Error', response.errorMessage || 'Something went wrong');
        return;
      }
      if (!response.assets) return;

      const newImages: PickedImage[] = response.assets
        .filter(asset => asset.uri)
        .map(asset => ({
          uri: asset.uri!,
          fileName: asset.fileName ?? null,
          type: asset.type ?? null,
        }));

      setImages(prev => [...prev, ...newImages].slice(0, maxImages));
    },
    [maxImages],
  );

  const openCamera = useCallback(async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert(
        'Permission Denied',
        'Camera access is required to take photos.',
      );
      return;
    }

    const options: CameraOptions = { ...commonOptions };
    const response = await launchCamera(options);
    handlePickerResponse(response);
  }, [handlePickerResponse]);

  const openGallery = useCallback(async () => {
    const remaining = maxImages - images.length;
    if (remaining <= 0) {
      Alert.alert(
        'Limit Reached',
        `You can only select up to ${maxImages} images.`,
      );
      return;
    }

    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Gallery access is required.');
      return;
    }

    const options: ImageLibraryOptions = {
      ...commonOptions,
      selectionLimit: remaining > 1 ? remaining : 1,
    };

    const response = await launchImageLibrary(options);
    handlePickerResponse(response);
  }, [handlePickerResponse, images.length, maxImages]);

  const pickImages = useCallback(() => {
    const remaining = maxImages - images.length;
    if (remaining <= 0) {
      Alert.alert(
        'Limit Reached',
        `You can only select up to ${maxImages} images.`,
      );
      return;
    }

    Alert.alert(
      'Select Image',
      'Choose how to add a photo',
      [
        { text: 'Take Photo', onPress: openCamera },
        { text: 'Choose from Library', onPress: openGallery },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true },
    );
  }, [maxImages, images.length, openCamera, openGallery]);

  const removeImage = useCallback((uri: string) => {
    setImages(prev => prev.filter(img => img.uri !== uri));
  }, []);

  const clearImages = useCallback(() => {
    setImages([]);
  }, []);

  const setImagesFromUris = useCallback(
    (uris: string[]) => {
      const mapped: PickedImage[] = uris.map(uri => ({
        uri,
        fileName: null,
        type: null,
      }));
      setImages(mapped.slice(0, maxImages));
    },
    [maxImages],
  );

  return {
    images,
    pickImages,
    removeImage,
    clearImages,
    setImagesFromUris,
  };
}

// import { useCallback, useState } from 'react';
// import {
//   launchCamera,
//   launchImageLibrary,
//   type ImagePickerResponse,
//   type ImageLibraryOptions,
//   type CameraOptions,
// } from 'react-native-image-picker';
// import { Alert, Platform } from 'react-native';

// export interface PickedImage {
//   uri: string;
//   fileName?: string | null;
//   type?: string | null;
// }

// export interface UseImagePickerOptions {
//   maxImages?: number;
// }

// export function useImagePicker(options: UseImagePickerOptions = {}) {
//   const { maxImages = 10 } = options;
//   const [images, setImages] = useState<PickedImage[]>([]);

//   // Common options for both camera and library
//   const commonOptions = {
//     mediaType: 'photo' as const,
//     quality: 0.8 as const,
//     includeBase64: false as const,
//   };

//   // Shared handler to process picker result
//   const handlePickerResponse = useCallback(
//     (response: ImagePickerResponse) => {
//       if (response.didCancel || response.errorCode || !response.assets) {
//         return;
//       }

//       const newImages: PickedImage[] = response.assets
//         .filter(asset => asset.uri)
//         .map(asset => ({
//           uri: asset.uri!,
//           fileName: asset.fileName ?? null,
//           type: asset.type ?? null,
//         }));

//       setImages(prev => [...prev, ...newImages].slice(0, maxImages));
//     },
//     [maxImages],
//   );

//   // Open Camera
//   const openCamera = useCallback(async () => {
//     const options: CameraOptions = {
//       ...commonOptions,
//     };

//     const response = await launchCamera(options);
//     handlePickerResponse(response);
//   }, [handlePickerResponse]);

//   // Open Gallery
//   const openGallery = useCallback(async () => {
//     const remaining = maxImages - images.length;
//     if (remaining <= 0) return;

//     const options: ImageLibraryOptions = {
//       ...commonOptions,
//       selectionLimit: remaining > 1 ? remaining : 1,
//     };

//     const response = await launchImageLibrary(options);
//     handlePickerResponse(response);
//   }, [handlePickerResponse, images.length, maxImages]);

//   // Main function: Show action sheet with options
//   const pickImages = useCallback(() => {
//     const remaining = maxImages - images.length;
//     if (remaining <= 0) {
//       return;
//     }

//     Alert.alert(
//       'Select Image',
//       'Choose an option',
//       [
//         {
//           text: 'Take Photo',
//           onPress: openCamera,
//         },
//         {
//           text: 'Choose from Library',
//           onPress: openGallery,
//         },
//         {
//           text: 'Cancel',
//           style: 'cancel',
//         },
//       ],
//       { cancelable: true },
//     );
//   }, [maxImages, images.length, openCamera, openGallery]);

//   const removeImage = useCallback((uri: string) => {
//     setImages(prev => prev.filter(img => img.uri !== uri));
//   }, []);

//   const clearImages = useCallback(() => {
//     setImages([]);
//   }, []);

//   const setImagesFromUris = useCallback(
//     (uris: string[]) => {
//       const mapped: PickedImage[] = uris.map(uri => ({
//         uri,
//         fileName: null,
//         type: null,
//       }));
//       setImages(mapped.slice(0, maxImages));
//     },
//     [maxImages],
//   );

//   return {
//     images,
//     pickImages, // Now shows action sheet with Camera & Gallery
//     removeImage,
//     clearImages,
//     setImagesFromUris,
//   };
// }

// import { useCallback, useState } from 'react';
// import {
//   launchImageLibrary,
//   type ImageLibraryOptions,
// } from 'react-native-image-picker';

// export interface PickedImage {
//   uri: string;
//   fileName?: string | null;
//   type?: string | null;
// }

// export interface UseImagePickerOptions {
//   maxImages?: number;
// }

// export function useImagePicker(options: UseImagePickerOptions = {}) {
//   const { maxImages = 10 } = options;
//   const [images, setImages] = useState<PickedImage[]>([]);

//   const pickImages = useCallback(async () => {
//     try {
//       const remaining = maxImages - images.length;
//       if (remaining <= 0) {
//         return;
//       }

//       const pickerOptions: ImageLibraryOptions = {
//         mediaType: 'photo',
//         selectionLimit: remaining,
//         quality: 0.8,
//       };

//       const result = await launchImageLibrary(pickerOptions);

//       if (result.didCancel || !result.assets || result.errorCode) {
//         return;
//       }

//       const next = result.assets
//         .filter(asset => asset.uri)
//         .map(asset => ({
//           uri: asset.uri as string,
//           fileName: asset.fileName ?? null,
//           type: asset.type ?? null,
//         }));

//       setImages(prev => [...prev, ...next].slice(0, maxImages));
//     } catch (error) {
//       // eslint-disable-next-line no-console
//       console.log('Image picker error', error);
//     }
//   }, [images.length, maxImages]);

//   const removeImage = useCallback((uri: string) => {
//     setImages(prev => prev.filter(img => img.uri !== uri));
//   }, []);

//   const clearImages = useCallback(() => {
//     setImages([]);
//   }, []);

//   return {
//     images,
//     pickImages,
//     removeImage,
//     clearImages,
//     // Allow callers (like edit flows) to prefill images from URIs
//     setImagesFromUris: useCallback(
//       (uris: string[]) => {
//         const mapped: PickedImage[] = uris.map(uri => ({
//           uri,
//           fileName: null,
//           type: null,
//         }));
//         setImages(mapped.slice(0, maxImages));
//       },
//       [maxImages],
//     ),
//   };
// }
