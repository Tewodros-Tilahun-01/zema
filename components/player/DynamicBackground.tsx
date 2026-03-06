import { useImageColors } from '@/hooks/useImageColors';
import { LinearGradient } from 'expo-linear-gradient';
import { memo, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type DynamicBackgroundProps = {
  imageUri: string | null;
  children: React.ReactNode;
};

const DEFAULT_COLORS = {
  top: '#121212',
  middle: '#0a0a0a',
  bottom: '#000000',
};

function adjustColorBrightness(color: string, percent: number): string {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const adjust = (value: number) => {
    const adjusted = Math.round(value * (1 + percent / 100));
    return Math.max(0, Math.min(255, adjusted));
  };

  const newR = adjust(r);
  const newG = adjust(g);
  const newB = adjust(b);

  const toHex = (value: number) => value.toString(16).padStart(2, '0');
  return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
}

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

function DynamicBackgroundComponent({ imageUri, children }: DynamicBackgroundProps) {
  const { colors, isLoading } = useImageColors(imageUri);
  const [currentColors, setCurrentColors] = useState(DEFAULT_COLORS);
  const [nextColors, setNextColors] = useState(DEFAULT_COLORS);
  const crossfadeProgress = useSharedValue(0);

  useEffect(() => {
    if (!isLoading) {
      // Ensure we have vibrant colors, not black
      const ensureVibrant = (color: string) => {
        const hex = color.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        // If color is too dark (close to black), boost it
        const brightness = (r + g + b) / 3;
        if (brightness < 30) {
          // Boost all channels proportionally
          const boost = 60 / Math.max(r, g, b, 1);
          return `#${Math.min(255, Math.round(r * boost))
            .toString(16)
            .padStart(2, '0')}${Math.min(255, Math.round(g * boost))
            .toString(16)
            .padStart(2, '0')}${Math.min(255, Math.round(b * boost))
            .toString(16)
            .padStart(2, '0')}`;
        }
        return color;
      };

      const vibrantPrimary = ensureVibrant(colors.primary);

      // Create gradient with vibrant colors
      const topColor = adjustColorBrightness(vibrantPrimary, 0);
      const middleColor = adjustColorBrightness(vibrantPrimary, -40);
      const bottomColor = adjustColorBrightness(vibrantPrimary, -70);

      const newColors = {
        top: topColor,
        middle: middleColor,
        bottom: bottomColor,
      };

      setNextColors(newColors);

      // Spotify-style slow crossfade
      crossfadeProgress.value = 0;
      crossfadeProgress.value = withTiming(
        1,
        {
          duration: 1200, // Spotify uses ~1-1.5 seconds
          easing: Easing.bezier(0.25, 0.1, 0.25, 1), // Spotify's easing curve
        },
        (finished) => {
          if (finished) {
            // Update current colors and keep progress at 1 to avoid flicker
            runOnJS(setCurrentColors)(newColors);
          }
        },
      );
    }
  }, [colors, isLoading, crossfadeProgress]);

  const currentGradientStyle = useAnimatedStyle(() => {
    return {
      opacity: 1 - crossfadeProgress.value,
    };
  });

  const nextGradientStyle = useAnimatedStyle(() => {
    return {
      opacity: crossfadeProgress.value,
    };
  });

  return (
    <View style={styles.container}>
      {/* Current gradient layer */}
      <AnimatedLinearGradient
        colors={[currentColors.top, currentColors.middle, currentColors.bottom]}
        locations={[0, 0.4, 1]} // Spotify gradient distribution
        style={[StyleSheet.absoluteFill]}
      />
      {/* Next gradient layer */}
      <AnimatedLinearGradient
        colors={[nextColors.top, nextColors.middle, nextColors.bottom]}
        locations={[0, 0.4, 1]}
        style={[StyleSheet.absoluteFill, nextGradientStyle]}
      />
      {/* Content */}
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
  },
});
