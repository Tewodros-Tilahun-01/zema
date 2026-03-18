import { Track } from '@/types/deezer';
import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

type TrackInfoHeaderProps = {
  track: Track;
};

export default function TrackInfoHeader({ track }: TrackInfoHeaderProps) {
  return (
    <View style={styles.container}>
      <Image source={{ uri: track.album.cover_medium }} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.title} numberOfLines={1}>
          {track.title}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {track.artist.name}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },
  details: {
    marginLeft: 16,
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  artist: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
});
