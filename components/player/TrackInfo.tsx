import { usePlayerStore } from '@/store/playerStore';
import { StyleSheet, Text, View } from 'react-native';

export function TrackInfo() {
  const currentTrack = usePlayerStore((state) => state.currentTrack);

  if (!currentTrack) return null;

  return (
    <View style={styles.info}>
      <Text style={styles.trackTitle}>{currentTrack.title}</Text>
      <Text style={styles.artist}>{currentTrack.artist}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  info: {
    marginTop: 28,
    alignItems: 'center',
  },
  trackTitle: {
    fontSize: 21,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  artist: {
    marginTop: 5,
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
});
