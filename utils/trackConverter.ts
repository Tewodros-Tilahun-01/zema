import { RecentlyPlayed } from '@/db/schema';
import { Track } from '@/types/deezer';

export function recentlyPlayedToTrack(recent: RecentlyPlayed): Track {
  return {
    id: recent.trackId,
    title: recent.title,
    title_short: recent.title,
    title_version: '',
    link: '',
    duration: recent.duration,
    rank: 0,
    explicit_lyrics: false,
    explicit_content_lyrics: 0,
    explicit_content_cover: 0,
    preview: recent.previewUrl,
    md5_image: '',
    position: 0,
    artist: {
      id: recent.artistId,
      name: recent.artist,
      link: '',
      picture: '',
      picture_small: '',
      picture_medium: '',
      picture_big: '',
      picture_xl: '',
      radio: false,
      tracklist: '',
      type: 'artist',
    },
    album: {
      id: recent.albumId,
      title: recent.albumTitle,
      cover: recent.coverMedium,
      cover_small: recent.coverSmall,
      cover_medium: recent.coverMedium,
      cover_big: recent.coverMedium,
      cover_xl: recent.coverMedium,
      md5_image: '',
      tracklist: '',
      type: 'album',
    },
    type: 'track',
  };
}
