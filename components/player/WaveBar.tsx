import { StyleSheet } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

type WaveBarProps = {
  bars: SharedValue<number[]>;
  index: number;
  minBarHeight: number;
  maxBarHeight: number;
};

export function WaveBar({
  bars,
  index,
  minBarHeight,
  maxBarHeight,
}: WaveBarProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const value = bars.value[index] ?? 0.14;
    return {
      height: minBarHeight + value * (maxBarHeight - minBarHeight),
    };
  }, [bars, index, maxBarHeight, minBarHeight]);

  return <Animated.View style={[styles.waveBar, animatedStyle]} />;
}

const styles = StyleSheet.create({
  waveBar: {
    width: 4,
    opacity: 0.94,
    borderRadius: 9999,
    backgroundColor: '#7A58FF',
  },
});
