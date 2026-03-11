import { DeezerPlaylist } from '@/types/deezer';
import { fetchPlaylist } from '@/utils/deezer';
import { useQuery } from '@tanstack/react-query';

export const usePlaylist = (id: string) => {
  return useQuery({
    queryKey: ['playlist', id],
    queryFn: (): Promise<DeezerPlaylist> => fetchPlaylist(id),
    enabled: !!id,
  });
};
