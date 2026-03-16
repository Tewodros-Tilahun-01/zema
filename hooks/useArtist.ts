import { ArtistSearchResult } from '@/types/deezer';
import { fetchArtist } from '@/utils/deezer';
import { useQuery } from '@tanstack/react-query';

export const useArtist = (id: string) => {
  return useQuery({
    queryKey: ['artist', id],
    queryFn: async (): Promise<ArtistSearchResult> => {
      const response = await fetchArtist(id);
      return response;
    },
    enabled: !!id,
  });
};
