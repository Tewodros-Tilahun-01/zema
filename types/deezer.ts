export interface DeezerUser {
  id: number;
  name: string;
  tracklist: string;
  type: 'user';
}

export interface DeezerPlaylist {
  id: number;
  title: string;
  description?: string;
  duration?: number;
  public: boolean;
  is_loved_track?: boolean;
  collaborative?: boolean;
  nb_tracks: number;
  fans?: number;
  link: string;
  share?: string;
  picture: string;
  picture_small: string;
  picture_medium: string;
  picture_big: string;
  picture_xl: string;
  checksum: string;
  tracklist: string;
  creation_date: string;
  add_date: string;
  mod_date: string;
  md5_image: string;
  picture_type: string;
  creator?: DeezerUser;
  user?: DeezerUser;
  type: 'playlist';
  tracks?: {
    data: Track[];
    checksum: string;
  };
}

export interface DeezerPlaylistResponse {
  data: DeezerPlaylist[];
  total: number;
}

export interface DeezerPaginatedTracks {
  data: Track[];
  checksum: string;
  total: number;
  prev?: string;
  next?: string;
}
export interface Artist {
  id: number;
  name: string;
  link: string;
  picture: string;
  picture_small: string;
  picture_medium: string;
  picture_big: string;
  picture_xl: string;
  radio: boolean;
  tracklist: string;
  type: 'artist';
}

export interface Album {
  id: number;
  title: string;
  cover: string;
  cover_small: string;
  cover_medium: string;
  cover_big: string;
  cover_xl: string;
  md5_image: string;
  tracklist: string;
  type: 'album';
}

export interface Track {
  id: number;
  title: string;
  title_short: string;
  title_version: string;
  link: string;
  duration: number;
  rank: number;
  explicit_lyrics: boolean;
  explicit_content_lyrics: number;
  explicit_content_cover: number;
  preview: string;
  md5_image: string;
  position: number;
  artist: Artist;
  album: Album;
  type: 'track';
}

export interface DeezerTracksResponse {
  data: Track[];
  total: number;
}
