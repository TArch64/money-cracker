import {
  CameraType,
  getCameraPermissionsAsync,
  getMediaLibraryPermissionsAsync,
  type ImagePickerAsset,
  type ImagePickerOptions,
  type ImagePickerResult,
  launchCameraAsync,
  launchImageLibraryAsync,
  requestCameraPermissionsAsync,
  requestMediaLibraryPermissionsAsync,
} from 'expo-image-picker';

export interface IImagePicker {
  open: () => Promise<ImagePickerAsset[] | null>;
}

interface IPermissions {
  granted: boolean;
}

interface IPickerConfig {
  getPermissions: () => Promise<IPermissions>;
  requestPermissions: () => Promise<IPermissions>;
  launchPicker: (options: ImagePickerOptions) => Promise<ImagePickerResult>;
}

function useBasePicker(config: IPickerConfig): IImagePicker {
  async function isPermissionGranted(): Promise<boolean> {
    let permissions = await config.getPermissions();

    if (!permissions.granted) {
      permissions = await config.requestPermissions();
    }

    return permissions.granted;
  }

  async function open(): Promise<ImagePickerAsset[] | null> {
    if (!(await isPermissionGranted())) {
      return null;
    }

    const result = await config.launchPicker({
      mediaTypes: 'images',
      cameraType: CameraType.back,
    });

    return result.canceled ? null : result.assets;
  }

  return { open };
}

export const useImagePicker = () => useBasePicker({
  getPermissions: getMediaLibraryPermissionsAsync,
  requestPermissions: requestMediaLibraryPermissionsAsync,
  launchPicker: launchImageLibraryAsync,
});

export const usePhoneCamera = () => useBasePicker({
  getPermissions: getCameraPermissionsAsync,
  requestPermissions: requestCameraPermissionsAsync,
  launchPicker: launchCameraAsync,
});
