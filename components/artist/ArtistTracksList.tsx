import { Track } from '@/types/deezer';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import ArtistTrackItem from './ArtistTrackItem';

type ArtistTracksListProps = {
  tracks: Track[];
  isLoading: boolean;
  onTrackPress: (track: Track) => void;
};

export default function ArtistTracksList({
  tracks,
  isLoading,
  onTrackPress,
}: ArtistTracksListProps) {
  return (
    <View style={styles.tracksSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Popular Tracks</Text>
        <Text style={styles.sectionSubtitle}>Most played songs</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator size="small" color="#FFFFFF" style={styles.loader} />
      ) : tracks.length > 0 ? (
        <View style={styles.tracksList}>
          {tracks.map((track, index) => (
            <ArtistTrackItem key={track.id} track={track} index={index} onPress={onTrackPress} />
          ))}
        </View>
      ) : (
        <View>
          <Text className="text-white"> no Popular track found </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tracksSection: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 100,
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  loader: {
    marginTop: 40,
  },
  tracksList: {
    gap: 12,
  },
});
