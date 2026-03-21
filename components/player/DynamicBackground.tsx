import { useImageColors } from '@/hooks/useImageColors';
import { LinearGradient } from 'expo-linear-gradient';
import { memo, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

type DynamicBackgroundProps = {
  imageUri: string | null;
  children: React.ReactNode;
};

const DEFAULT_COLORS = {
  top: '#121212',
  middle: '#121212',
  bottom: '#121212',
};

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

function DynamicBackgroundComponent({ imageUri, children }: DynamicBackgroundProps) {
  const { colors, isLoading } = useImageColors(imageUri);
  const [displayColors, setDisplayColors] = useState(DEFAULT_COLORS);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (!isLoading && colors.primary) {
      const newColors = {
        top: colors.primary,
        middle: colors.secondary,
        bottom: colors.background,
      };

      // Scale up and fade out (blur-like effect)
      scale.value = withTiming(1.2, { duration: 400 });
      opacity.value = withTiming(0.4, { duration: 400 });

      // Change colors in the middle, then scale back and fade in
      setTimeout(() => {
        setDisplayColors(newColors);
        scale.value = withTiming(1, { duration: 500 });
        opacity.value = withTiming(1, { duration: 500 });
      }, 400);
    }
  }, [colors, isLoading, scale, opacity]);

  const gradientStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  return (
    <View style={styles.container}>
      <AnimatedLinearGradient
        colors={[displayColors.top, displayColors.top, displayColors.bottom]}
        locations={[0, 0.4, 1]}
        style={[StyleSheet.absoluteFill, gradientStyle]}
      />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

export const DynamicBackground = memo(DynamicBackgroundComponent);
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: 8,
    paddingBottom: 16,
    paddingHorizontal: 22,
  },
});
