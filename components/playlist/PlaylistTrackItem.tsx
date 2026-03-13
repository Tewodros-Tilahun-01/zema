import { Track } from '@/types/deezer';
import { memo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type PlaylistTrackItemProps = {
  track: Track;
  onPress: (track: Track) => void;
};

function PlaylistTrackItem({ track, onPress }: PlaylistTrackItemProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <TouchableOpacity style={styles.trackItem} onPress={() => onPress(track)} activeOpacity={0.7}>
      <Image source={{ uri: track.album.cover_medium }} style={styles.trackCover} />
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle} numberOfLines={1}>
          {track.title}
        </Text>
        <Text style={styles.trackArtist} numberOfLines={1}>
          {track.artist.name}
        </Text>
      </View>
      <Text style={styles.trackDuration}>{formatDuration(track.duration)}</Text>
    </TouchableOpacity>
  );
}

export default memo(PlaylistTrackItem);

const styles = StyleSheet.create({
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#0B0E14',
  },
  trackCover: {
    width: 56,
    height: 56,
    borderRadius: 8,
  },
  trackInfo: {
    flex: 1,
    marginLeft: 12,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  trackArtist: {
    fontSize: 14,
    color: '#8E8E93',
  },
  trackDuration: {
    fontSize: 14,
    color: '#8E8E93',
    marginLeft: 12,
  },
});
