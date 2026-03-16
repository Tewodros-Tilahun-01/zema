import { ArtistSearchResult, DeezerPlaylist, SearchMode, Track } from '@/types/deezer';
import { searchDeezer } from '@/utils/deezer';
import { useQuery } from '@tanstack/react-query';

type SearchResult = Track | ArtistSearchResult | DeezerPlaylist;

export const useDeezerSearch = (query: string, mode: SearchMode = 'track') => {
  return useQuery({
    queryKey: ['deezer-search', query, mode],
    queryFn: async (): Promise<SearchResult[]> => {
      if (!query.trim()) {
        return [];
      }

      if (mode === 'track') {
        const response = await searchDeezer<Track>(query, mode);
        return response.data;
      } else if (mode === 'artist') {
        const response = await searchDeezer<ArtistSearchResult>(query, mode);
        return response.data;
      } else {
        const response = await searchDeezer<DeezerPlaylist>(query, mode);
        return response.data;
      }
    },
    enabled: query.trim().length > 0,
  });
};
