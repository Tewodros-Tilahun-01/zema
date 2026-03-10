import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

export default function ProfileCardSkeleton() {
  const shimmerAnim = useSharedValue(0.3);

  useEffect(() => {
    shimmerAnim.value = withRepeat(withTiming(0.7, { duration: 1000 }), -1, true);
  }, [shimmerAnim]);

  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: shimmerAnim.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.image, shimmerStyle]} />
      <Animated.View style={[styles.name, shimmerStyle]} />
      <Animated.View style={[styles.song, shimmerStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 168, // w-42 in Tailwind
    marginRight: 16,
  },
  image: {
    width: 168, // w-42 in Tailwind
    height: 168, // h-42 in Tailwind
    borderRadius: 8, // rounded-lg
    backgroundColor: '#2C2C2E',
    marginBottom: 8, // mt-2
  },
  name: {
    height: 18, // text-lg
    backgroundColor: '#2C2C2E',
    borderRadius: 4,
    marginBottom: 4,
  },
  song: {
    height: 12, // text-xs
    width: '80%',
    backgroundColor: '#2C2C2E',
    borderRadius: 4,
  },
});
