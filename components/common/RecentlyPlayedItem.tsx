import { RecentlyPlayed } from '@/db/schema';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type RecentlyPlayedItemProps = {
  track: RecentlyPlayed;
  onPress: (track: RecentlyPlayed) => void;
};

export default function RecentlyPlayedItem({ track, onPress }: RecentlyPlayedItemProps) {
  return (
    <TouchableOpacity style={styles.trackItem} onPress={() => onPress(track)} activeOpacity={0.7}>
      <Image source={{ uri: track.coverMedium }} style={styles.trackCover} />
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle} numberOfLines={1}>
          {track.title}
        </Text>
        <Text style={styles.trackArtist} numberOfLines={1}>
          {track.artist}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
});
