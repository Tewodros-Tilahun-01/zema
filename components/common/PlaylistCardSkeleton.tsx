import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

export default function PlaylistCardSkeleton() {
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
      <Animated.View style={[styles.title, shimmerStyle]} />
      <Animated.View style={[styles.subtitle, shimmerStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 200,
    width: 140,
    marginRight: 16,
    borderRadius: 16,
    backgroundColor: '#2C2C2E',
    paddingHorizontal: 8,
    paddingVertical: 16,
  },
  image: {
    height: 96,
    width: 110,
    borderRadius: 16,
    backgroundColor: '#1C1C1E',
    alignSelf: 'center',
    marginBottom: 14,
  },
  title: {
    height: 16,
    backgroundColor: '#1C1C1E',
    borderRadius: 4,
    marginBottom: 4,
  },
  subtitle: {
    height: 12,
    width: '70%',
    backgroundColor: '#1C1C1E',
    borderRadius: 4,
  },
});
