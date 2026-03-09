import { Track } from '@/types/deezer';
import { fetchTopTracks } from '@/utils/deezer';
import { useQuery } from '@tanstack/react-query';

export const useTopTracks = () => {
  return useQuery({
    queryKey: ['top-tracks'],
    queryFn: async (): Promise<Track[]> => {
      const response = await fetchTopTracks();
      return response.data;
    },
  });
};
