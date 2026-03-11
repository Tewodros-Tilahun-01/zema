import { DeezerPaginatedTracks } from '@/types/deezer';
import { fetchPlaylistTracks } from '@/utils/deezer';
import { useInfiniteQuery } from '@tanstack/react-query';

export const usePlaylistTracks = (id: string) => {
  return useInfiniteQuery({
    queryKey: ['playlist-tracks', id],
    queryFn: ({ pageParam = 0 }): Promise<DeezerPaginatedTracks> =>
      fetchPlaylistTracks(id, pageParam),
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.length * 20;
      return lastPage.data.length === 20 ? totalFetched : undefined;
    },
    enabled: !!id,
    initialPageParam: 0,
  });
};
