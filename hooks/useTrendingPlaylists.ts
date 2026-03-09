import { DeezerPlaylist } from '@/types/deezer';
import { fetchTrendingPlaylists } from '@/utils/deezer';
import { useQuery } from '@tanstack/react-query';

export const useTrendingPlaylists = () => {
  return useQuery({
    queryKey: ['trending-playlists'],
    queryFn: async (): Promise<DeezerPlaylist[]> => {
      const response = await fetchTrendingPlaylists();
      return response.data;
    },
  });
};
