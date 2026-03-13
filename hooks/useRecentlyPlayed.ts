import { getRecentlyPlayed } from '@/db/queries';
import { RecentlyPlayed } from '@/db/schema';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';

export function useRecentlyPlayed() {
  const [tracks, setTracks] = useState<RecentlyPlayed[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTracks = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getRecentlyPlayed();
      setTracks(data);
    } catch (error) {
      console.error('Error fetching recently played:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchTracks();
    }, [fetchTracks]),
  );

  return { tracks, isLoading, refetch: fetchTracks };
}
