import { Track } from '@/types/deezer';
import { useQuery } from '@tanstack/react-query';

export const useGenreSearch = (genre: string | null) => {
  return useQuery({
    queryKey: ['genre-tracks', genre],
    queryFn: async (): Promise<Track[]> => {
      const response = await fetch(
        `https://api.deezer.com/search/track?q=${encodeURIComponent(genre || '')}`,
      );
      const data = await response.json();
      return data.data || [];
    },
    enabled: !!genre,
  });
};
