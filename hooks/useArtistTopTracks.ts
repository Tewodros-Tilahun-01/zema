import { Track } from '@/types/deezer';
import { fetchArtistTopTracks } from '@/utils/deezer';
import { useQuery } from '@tanstack/react-query';

export const useArtistTopTracks = (id: string) => {
  return useQuery({
    queryKey: ['artist-top-tracks', id],
    queryFn: async (): Promise<Track[]> => {
      const response = await fetchArtistTopTracks(id);
      return response.data;
    },
    enabled: !!id,
  });
};
