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

// Search API
export async function searchDeezer<T>(
  query: string,
  mode: 'track' | 'artist' | 'playlist' = 'track',
): Promise<{ data: T[]; total: number; next?: string }> {
  const endpoint = `/search/${mode}`;
  const { data } = await deezerApi.get<{ data: T[]; total: number; next?: string }>(endpoint, {
    params: { q: query },
  });
  return data;
}

// Artist API
export async function fetchArtist(id: string): Promise<any> {
  const { data } = await deezerApi.get(`/artist/${id}`);
  return data;
}

export async function fetchArtistTopTracks(id: string): Promise<{ data: any[] }> {
  const { data } = await deezerApi.get(`/artist/${id}/top`, {
    params: { limit: 20 },
  });
  return data;
}
