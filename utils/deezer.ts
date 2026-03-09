import { deezerApi } from '@/config/axios';
import { DeezerPlaylistResponse } from '@/types/deezer';

export async function fetchTrendingPlaylists(): Promise<DeezerPlaylistResponse> {
  const { data } = await deezerApi.get<DeezerPlaylistResponse>('/chart/0/playlists');

  return data;
}
