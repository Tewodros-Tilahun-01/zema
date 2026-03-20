import * as FileSystem from 'expo-file-system/legacy';

export type DownloadedTrack = {
  id: string;
  title: string;
  artist: string;
  artwork: string;
  localUri: string;
  remoteUrl: string;
  downloadedAt: number;
  fileSize: number;
};

// Get the mp3 directory path - using cache directory which is accessible
const getMp3DirectoryPath = (): string => {
  // For Android: Use SAF (Storage Access Framework) or cache directory
  // FileSystem.cacheDirectory is accessible but gets cleared
  // FileSystem.documentDirectory is private to the app
  return `${FileSystem.documentDirectory}mp3/`;
};

// Create the mp3 folder if it doesn't exist
export async function ensureMp3FolderExists(): Promise<void> {
  const dirPath = getMp3DirectoryPath();
  const dirInfo = await FileSystem.getInfoAsync(dirPath);

  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(dirPath, { intermediates: true });
  }
}

// Download a track to the mp3 folder
export async function downloadTrack(
  trackId: string,
  remoteUrl: string,
  onProgress?: (progress: number) => void,
): Promise<string> {
  await ensureMp3FolderExists();

  const fileName = `${trackId}.mp3`;
  const fileUri = `${getMp3DirectoryPath()}${fileName}`;

  // Check if already downloaded
  const fileInfo = await FileSystem.getInfoAsync(fileUri);
  if (fileInfo.exists) {
    return fileUri;
  }

  // Download with progress callback
  const downloadResumable = FileSystem.createDownloadResumable(
    remoteUrl,
    fileUri,
    {},
    (downloadProgress) => {
      const progress =
        downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
      onProgress?.(progress);
    },
  );

  const result = await downloadResumable.downloadAsync();
  if (!result) {
    throw new Error('Download failed');
  }

  return result.uri;
}

// List all MP3 files in the mp3 folder
export async function listDownloadedTracks(): Promise<string[]> {
  await ensureMp3FolderExists();

  try {
    const dirPath = getMp3DirectoryPath();
    const files = await FileSystem.readDirectoryAsync(dirPath);
    const mp3Files = files.filter((file) => file.endsWith('.mp3'));
    return mp3Files.map((file) => `${dirPath}${file}`);
  } catch (error) {
    return [];
  }
}

// Get file info for a downloaded track
export async function getTrackFileInfo(localUri: string): Promise<{
  exists: boolean;
  size: number;
}> {
  try {
    const fileInfo = await FileSystem.getInfoAsync(localUri);

    if (!fileInfo.exists) {
      return { exists: false, size: 0 };
    }

    return {
      exists: true,
      size: fileInfo.size || 0,
    };
  } catch (error) {
    return { exists: false, size: 0 };
  }
}

// Delete a downloaded track
export async function deleteTrack(trackId: string): Promise<void> {
  const fileName = `${trackId}.mp3`;
  const fileUri = `${getMp3DirectoryPath()}${fileName}`;

  try {
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(fileUri);
    }
  } catch (error) {
    // File doesn't exist or already deleted
  }
}

// Delete all downloaded tracks
export async function clearAllDownloads(): Promise<void> {
  try {
    const dirPath = getMp3DirectoryPath();
    const dirInfo = await FileSystem.getInfoAsync(dirPath);

    if (dirInfo.exists) {
      await FileSystem.deleteAsync(dirPath, { idempotent: true });
      // Recreate the directory
      await FileSystem.makeDirectoryAsync(dirPath, { intermediates: true });
    }
  } catch (error) {
    // Folder doesn't exist
  }
}

// Get local URI for a track ID
export function getLocalUri(trackId: string): string {
  return `${getMp3DirectoryPath()}${trackId}.mp3`;
}
