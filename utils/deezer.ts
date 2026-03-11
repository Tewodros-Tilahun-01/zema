import { deezerApi } from '@/config/axios';
import { DeezerPlaylistResponse, DeezerTracksResponse } from '@/types/deezer';

export { deezerApi };

export async function fetchTrendingPlaylists(): Promise<DeezerPlaylistResponse> {
  const { data } = await deezerApi.get<DeezerPlaylistResponse>('/chart/0/playlists');

  return data;
}

export async function fetchTopTracks(): Promise<DeezerTracksResponse> {
  const { data } = await deezerApi.get<DeezerTracksResponse>('/chart/0/tracks');
  return data;
}
