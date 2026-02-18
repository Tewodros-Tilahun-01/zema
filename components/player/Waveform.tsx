import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

type WaveformProps = {
  bars: SharedValue<number[]>;
  barCount: number;
  minBarHeight: number;
  maxBarHeight: number;
  enabled: boolean;
  canSample: boolean;
};

type WaveBarProps = {
  bars: SharedValue<number[]>;
  index: number;
  minBarHeight: number;
  maxBarHeight: number;
};

function WaveBar({ bars, index, minBarHeight, maxBarHeight }: WaveBarProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const value = bars.value[index] ?? 0.14;
    return {
      height: minBarHeight + value * (maxBarHeight - minBarHeight),
    };
  }, [bars, index, maxBarHeight, minBarHeight]);

  return (
    <Animated.View
      style={[styles.waveBar, animatedStyle]}
    />
  );
}

export function Waveform({
  bars,
  barCount,
  minBarHeight,
  maxBarHeight,
  enabled,
  canSample,
}: WaveformProps) {
  if (!enabled) {
    return null;
  }

  if (!canSample) {
    return (
      <View style={styles.waveFallbackRow}>
        <Text style={styles.waveFallbackText}>
          Visualizer unavailable
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.waveRow}>
      {Array.from({ length: barCount }, (_, index) => (
        <WaveBar
          key={String(index)}
          bars={bars}
          index={index}
          minBarHeight={minBarHeight}
          maxBarHeight={maxBarHeight}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  waveRow: {
    marginTop: 34,
    height: 52,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  waveBar: {
    width: 4,
    opacity: 0.94,
    borderRadius: 9999,
    backgroundColor: '#7A58FF',
  },
  waveFallbackRow: {
    marginTop: 34,
    height: 52,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  waveFallbackText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: 0.4,
  },
});
