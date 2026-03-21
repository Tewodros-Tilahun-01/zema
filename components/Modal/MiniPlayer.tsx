import Button from '@/components/common/Button';
import { usePlayerStore } from '@/store/playerStore';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

type MiniPlayerProps = {
  onExpand?: () => void;
};

export function MiniPlayer({ onExpand }: MiniPlayerProps) {
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const togglePlayPause = usePlayerStore((state) => state.togglePlayPause);
  const clearTrack = usePlayerStore((state) => state.clearTrack);

  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  const [hasImageError, setHasImageError] = React.useState(false);

  if (!currentTrack) return null;

  const handlePlayPausePress = (e: any) => {
    e.stopPropagation();
    togglePlayPause();
  };

  const handleDismiss = () => {
    clearTrack();
  };

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-10, 10])
    .onUpdate((event) => {
      // Only allow left swipe (negative translationX)
      if (event.translationX < 0) {
        translateX.value = event.translationX;
        // Fade out as user swipes
        opacity.value = Math.max(0, 1 + event.translationX / 200);
      }
    })
    .onEnd((event) => {
      // If swiped more than 100px to the left, dismiss
      if (event.translationX < -100) {
        translateX.value = withTiming(-400, { duration: 200 });
        opacity.value = withTiming(0, { duration: 200 }, () => {
          runOnJS(handleDismiss)();
        });
      } else {
        // Snap back to original position
        translateX.value = withSpring(0);
        opacity.value = withSpring(1);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <View style={styles.wrapper2}>
        <Animated.View style={[styles.wrapper, animatedStyle]}>
          <Button style={styles.container} onPress={onExpand} pressedScale={0.98}>
            <View style={styles.content}>
              {hasImageError ? (
                <View style={styles.artworkPlaceholder}>
                  <Ionicons name="musical-notes" size={24} color="rgba(255, 255, 255, 0.3)" />
                </View>
              ) : (
                <Image
                  source={{ uri: currentTrack.album.cover_medium }}
                  cachePolicy="memory-disk"
                  style={styles.artwork}
                  onError={() => setHasImageError(true)}
                />
              )}
              <View style={styles.info}>
                <Text style={styles.title} numberOfLines={1}>
                  {currentTrack.title}
                </Text>
                <Text style={styles.artist} numberOfLines={1}>
                  {currentTrack.artist.name}
                </Text>
              </View>
            </View>

            <Button onPress={handlePlayPausePress} style={styles.playButton} pressedScale={0.9}>
              <Ionicons name={isPlaying ? 'pause' : 'play'} size={28} color="#FFFFFF" />
            </Button>
          </Button>
        </Animated.View>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  wrapper2: {
    backgroundColor: '#121212',
    width: '100%',
  },
  wrapper: {
    width: '100%',
  },
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
  artworkPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#2C2C2E',
    alignItems: 'center',
    justifyContent: 'center',
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
