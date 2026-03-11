import { usePlayerStore } from '@/store/playerStore';
import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

type MiniPlayerProps = {
  onExpand?: () => void;
};

export function MiniPlayer({ onExpand }: MiniPlayerProps) {
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const togglePlayPause = usePlayerStore((state) => state.togglePlayPause);

  if (!currentTrack) return null;

  const handlePlayPausePress = (e: any) => {
    e.stopPropagation();
    togglePlayPause();
  };

  return (
    <Pressable style={styles.container} onPress={onExpand}>
      <View style={styles.content}>
        <Image source={{ uri: currentTrack.album.cover_medium }} style={styles.artwork} />
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {currentTrack.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {currentTrack.artist.name}
          </Text>
        </View>
      </View>

      <Pressable onPress={handlePlayPausePress} style={styles.playButton}>
        <Ionicons name={isPlaying ? 'pause' : 'play'} size={28} color="#FFFFFF" />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#1C1C1E',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  artwork: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#2C2C2E',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  artist: {
    fontSize: 12,
    color: '#8E8E93',
  },
  playButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
