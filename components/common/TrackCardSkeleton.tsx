import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

export default function TrackCardSkeleton() {
  const shimmerAnim = useSharedValue(0.3);

  useEffect(() => {
    shimmerAnim.value = withRepeat(withTiming(0.7, { duration: 1000 }), -1, true);
  }, [shimmerAnim]);

  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: shimmerAnim.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.imageContainer, shimmerStyle]} />
      <Animated.View style={[styles.songTitle, shimmerStyle]} />
      <Animated.View style={[styles.artistName, shimmerStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 144,
    overflow: 'hidden',
    marginRight: 16,
  },
  imageContainer: {
    width: 144,
    height: 144,
    borderRadius: 8,
    borderWidth: 1,

    backgroundColor: '#2C2C2E',
    overflow: 'hidden',
  },
  songTitle: {
    marginTop: 8,
    height: 20,
    width: '100%',
    borderRadius: 4,
    backgroundColor: '#1C1C1E',
  },
  artistName: {
    marginTop: 4,
    height: 14,
    width: '75%',
    borderRadius: 4,
    backgroundColor: '#1C1C1E',
  },
});
