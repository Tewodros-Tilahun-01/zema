import { getCollectionTracks } from '@/db/queries';
import { useCallback, useEffect, useState } from 'react';

export function useCollectionTracks(collectionId: number | null) {
  const [tracks, setTracks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTracks = useCallback(async () => {
    if (!collectionId) {
      setTracks([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const data = await getCollectionTracks(collectionId);
    setTracks(data);
    setIsLoading(false);
  }, [collectionId]);

  useEffect(() => {
    fetchTracks();
  }, [fetchTracks]);

  return {
    tracks,
    isLoading,
    refetch: fetchTracks,
  };
}
