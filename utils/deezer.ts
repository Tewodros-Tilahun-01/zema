import { deezerApi } from '@/config/axios';
import {
  DeezerPaginatedTracks,
  DeezerPlaylist,
  DeezerPlaylistResponse,
  DeezerTracksResponse,
} from '@/types/deezer';

export async function fetchTrendingPlaylists(): Promise<DeezerPlaylistResponse> {
  const { data } = await deezerApi.get<DeezerPlaylistResponse>('/chart/0/playlists');

  return data;
}

export async function fetchTopTracks(): Promise<DeezerTracksResponse> {
  const { data } = await deezerApi.get<DeezerTracksResponse>('/chart/0/tracks');
  return data;
}

export async function fetchPlaylist(id: string): Promise<DeezerPlaylist> {
  const { data } = await deezerApi.get<DeezerPlaylist>(`/playlist/${id}`, {
    params: { index: 0, limit: 1 },
  });
  return data;
}

export async function fetchPlaylistTracks(
  id: string,
  index: number,
): Promise<DeezerPaginatedTracks> {
  const { data } = await deezerApi.get<DeezerPaginatedTracks>(`/playlist/${id}/tracks`, {
    params: { index, limit: 20 },
  });
  return data;
}
