import { deleteDownload as deleteDownloadQuery, getAllDownloads, saveDownload } from '@/db/queries';
import { Track } from '@/types';
import * as DownloadManager from '@/utils/downloadManager';
import { useCallback, useEffect, useState } from 'react';

export type DownloadedTrack = {
  id: string;
  trackId: number;
  title: string;
  artist: string;
  artistId: number;
  albumTitle: string;
  albumId: number;
  coverSmall: string;
  coverMedium: string;
  coverBig: string;
  coverXl: string;
  duration: number;
  localUri: string;
  remoteUrl: string;
  downloadedAt: number;
  fileSize: number;
};

export function useDownloads() {
  const [downloadsList, setDownloadsList] = useState<DownloadedTrack[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sync database with actual files on disk
  const syncWithFileSystem = useCallback(async () => {
    try {
      // Get all files from disk
      const localUris = await DownloadManager.listDownloadedTracks();
      const fileIds = new Set(
        localUris.map((uri) => uri.split('/').pop()?.replace('.mp3', '') || ''),
      );

      // Get all records from database
      const dbRecords = await getAllDownloads();

      // Remove database records for files that don't exist
      for (const record of dbRecords) {
        if (!fileIds.has(record.id)) {
          await deleteDownloadQuery(record.id);
        }
      }

      // Verify file sizes and update if needed
      const validRecords: DownloadedTrack[] = [];
      for (const record of dbRecords) {
        if (fileIds.has(record.id)) {
          const fileInfo = await DownloadManager.getTrackFileInfo(record.localUri);
          if (fileInfo.exists) {
            validRecords.push(record);
          }
        }
      }

      setDownloadsList(validRecords);
    } catch (error) {
      console.error('Error syncing downloads:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load downloads on mount
  useEffect(() => {
    void syncWithFileSystem();
  }, [syncWithFileSystem]);

  // Download a track
  const downloadTrack = useCallback(
    async (track: Track, onProgress?: (progress: number) => void) => {
      try {
        const localUri = await DownloadManager.downloadTrack(
          track.id.toString(),
          track.preview,
          onProgress,
        );

        const fileInfo = await DownloadManager.getTrackFileInfo(localUri);

        // Save to database with full track metadata
        await saveDownload({
          id: track.id.toString(),
          trackId: track.id,
          title: track.title,
          artist: track.artist.name,
          artistId: track.artist.id,
          albumTitle: track.album.title,
          albumId: track.album.id,
          coverSmall: track.album.cover_small,
          coverMedium: track.album.cover_medium,
          coverBig: track.album.cover_big,
          coverXl: track.album.cover_xl,
          duration: track.duration,
          localUri: localUri,
          remoteUrl: track.preview,
          fileSize: fileInfo.size,
        });

        await syncWithFileSystem();
      } catch (error) {
        console.error('Error downloading track:', error);
        throw error;
      }
    },
    [syncWithFileSystem],
  );

  // Delete a track
  const deleteTrack = useCallback(
    async (trackId: string) => {
      try {
        await DownloadManager.deleteTrack(trackId);
        await deleteDownloadQuery(trackId);
        await syncWithFileSystem();
      } catch (error) {
        console.error('Error deleting track:', error);
        throw error;
      }
    },
    [syncWithFileSystem],
  );

  // Check if a track is downloaded
  const isDownloaded = useCallback(
    (trackId: string) => {
      return downloadsList.some((d) => d.id === trackId);
    },
    [downloadsList],
  );

  // Get downloaded track by ID
  const getDownloadedTrack = useCallback(
    (trackId: string) => {
      return downloadsList.find((d) => d.id === trackId);
    },
    [downloadsList],
  );

  return {
    downloads: downloadsList,
    isLoading,
    downloadTrack,
    deleteTrack,
    isDownloaded,
    getDownloadedTrack,
    refresh: syncWithFileSystem,
  };
}
