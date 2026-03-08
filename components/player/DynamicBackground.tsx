import { useImageColors } from '@/hooks/useImageColors';
import { LinearGradient } from 'expo-linear-gradient';
import { memo, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

type DynamicBackgroundProps = {
  imageUri: string | null;
  children: React.ReactNode;
};

const DEFAULT_COLORS = {
  top: '#0B0E14',
  middle: '#0B0E14',
  bottom: '#0B0E14',
};

function DynamicBackgroundComponent({ imageUri, children }: DynamicBackgroundProps) {
  const { colors, isLoading } = useImageColors(imageUri);
  const [displayColors, setDisplayColors] = useState(DEFAULT_COLORS);

  useEffect(() => {
    if (!isLoading && colors.primary) {
      setDisplayColors({
        top: colors.primary,
        middle: colors.secondary,
        bottom: colors.background,
      });
    }
  }, [colors, isLoading]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[displayColors.top, displayColors.top, displayColors.bottom]}
        locations={[0, 0.4, 1]}
        style={StyleSheet.absoluteFill}
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
  },
});
