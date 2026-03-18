import {
  addTrackToCollection,
  getCollectionsWithTrackStatus,
  getFavoritesCollectionId,
  removeTrackFromCollection,
} from '@/db/queries';
import { Track } from '@/types/deezer';
import { useCallback, useState } from 'react';

export function useTrackOptions() {
  const [collections, setCollections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadCollections = useCallback(async (trackId: number) => {
    setIsLoading(true);
    const collectionsWithStatus = await getCollectionsWithTrackStatus(trackId);
    setCollections(collectionsWithStatus);
    setIsLoading(false);
  }, []);

  const addToFavorites = useCallback(async (track: Track) => {
    const favoritesId = await getFavoritesCollectionId();
    if (favoritesId) {
      const success = await addTrackToCollection(favoritesId, track);
      return success;
    }
    return false;
  }, []);

  const toggleTrackInCollection = useCallback(
    async (collectionId: number, track: Track, isInCollection: boolean) => {
      if (isInCollection) {
        return await removeTrackFromCollection(collectionId, track.id);
      } else {
        return await addTrackToCollection(collectionId, track);
      }
    },
    [],
  );

  return {
    collections,
    isLoading,
    loadCollections,
    addToFavorites,
    toggleTrackInCollection,
  };
}
