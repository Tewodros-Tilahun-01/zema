import { usePlayerStore } from '@/store/playerStore';
import { clamp } from '@/utils/player';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

export function PlayerControls() {
  const player = usePlayerStore((state) => state.player);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const currentTime = usePlayerStore((state) => state.currentTime);
  const duration = usePlayerStore((state) => state.duration);

  const togglePlayPause = () => {
    if (!player) return;
    try {
      if (isPlaying) {
        player.pause();
      } else {
        player.play();
      }
    } catch (error) {
      console.error('Error toggling playback:', error);
    }
  };

  const jumpBy = (deltaSeconds: number) => {
    if (!player || duration <= 0) return;
    try {
      const target = clamp(currentTime + deltaSeconds, 0, duration);
      void player.seekTo(target);
    } catch (error) {
      console.error('Error seeking:', error);
    }
  };

  return (
    <View style={styles.controls}>
      <Pressable style={styles.ghostIcon}>
        <Ionicons name="heart-outline" size={20} color="#C9CBD8" />
      </Pressable>
      <Pressable onPress={() => jumpBy(-10)} style={styles.mediaAction}>
        <Ionicons name="play-back" size={22} color="#FFFFFF" />
      </Pressable>
      <Pressable style={styles.playButton} onPress={togglePlayPause}>
        <Ionicons name={isPlaying ? 'pause' : 'play'} size={30} color="#1A1E2F" />
      </Pressable>
      <Pressable onPress={() => jumpBy(10)} style={styles.mediaAction}>
        <Ionicons name="play-forward" size={22} color="#FFFFFF" />
      </Pressable>
      <Pressable style={styles.ghostIcon}>
        <Ionicons name="heart-outline" size={20} color="#C9CBD8" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  controls: {
    marginTop: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ghostIcon: {
    height: 38,
    width: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9999,
  },
  mediaAction: {
    height: 44,
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9999,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  playButton: {
    height: 82,
    width: 82,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9999,
    backgroundColor: '#FFFFFF',
    shadowColor: '#A38BFF',
    shadowOpacity: 0.55,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    elevation: 12,
  },
});
