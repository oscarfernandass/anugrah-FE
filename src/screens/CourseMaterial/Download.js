import RNFetchBlob from 'rn-fetch-blob';
import {Platform, PermissionsAndroid, Alert} from 'react-native';

/// grant permission in android
export const getDownloadPermissionAndroid = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'File Download Permission',
        message: 'Your permission is required to save Files to your device',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) return true;
  } catch (err) {
    Alert.alert(err);
    console.log('err', err);
  }
};

const cleanFilename = (url) => {
  const baseFilename = url.split('/').pop();
  return baseFilename.split('?')[0]; // Remove query parameters
};

export const downloadFile = async (url) => {
  const { config, fs } = RNFetchBlob;
  const cacheDir = fs.dirs.DownloadDir || fs.dirs.DocumentDir;
  const filename = cleanFilename(url);
  const dirPath = `${cacheDir}/MyAppDownloads`;
  const filePath = `${dirPath}/${filename}`;

  console.log('Download path:', filePath);

  try {
    const dirExists = await fs.exists(dirPath);
    if (!dirExists) {
      await fs.mkdir(dirPath);
    }

    const configOptions = Platform.select({
      ios: {
        fileCache: true,
        path: filePath,
        appendExt: filename.split('.').pop(),
      },
      android: {
        fileCache: true,
        path: filePath,
        appendExt: filename.split('.').pop(),
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: filePath,
          description: 'Downloading file...',
          mediaScannable: true,
          mime: 'application/octet-stream',
        },
      },
    });

    const response = await RNFetchBlob.config(configOptions).fetch('GET', url);
    console.log('Response:', response);
    
    // Return the file path after a successful download
    return filePath;
  } catch (error) {
    console.error('Download error:', error);
    Alert.alert('Error', `Failed to download file: ${error.message}`);
    return null;
  }
};
