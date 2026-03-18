import { Track } from '@/types/deezer';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type ArtistTrackItemProps = {
  track: Track;
  index: number;
  onPress: (track: Track) => void;
};

export default function ArtistTrackItem({ track, index, onPress }: ArtistTrackItemProps) {
  return (
    <Pressable
      style={styles.trackCard}
      onPress={() => onPress(track)}
      android_ripple={{ color: 'rgba(255, 255, 255, 0.1)' }}
    >
      <View style={styles.trackRank}>
        <Text style={styles.rankNumber}>{index + 1}</Text>
      </View>
      <Image
        source={{ uri: track.album.cover_medium }}
        style={styles.trackImage}
        contentFit="cover"
      />
      <View style={styles.trackDetails}>
        <Text style={styles.trackName} numberOfLines={1}>
          {track.title}
        </Text>
        <Text style={styles.albumName} numberOfLines={1}>
          {track.album.title}
        </Text>
        <View style={styles.trackMeta}>
          <Ionicons name="play" size={10} color="rgba(255, 255, 255, 0.5)" />
          <Text style={styles.metaText}>{(track.rank / 1000).toFixed(0)}K plays</Text>
        </View>
      </View>
      <Ionicons name="play-circle" size={32} color="rgba(255, 255, 255, 0.8)" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  trackCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 12,
    gap: 12,
  },
  trackRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  trackImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
  },
  trackDetails: {
    flex: 1,
    gap: 4,
  },
  trackName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  albumName: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  trackMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  metaText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
  },
});
