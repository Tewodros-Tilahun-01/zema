import { StyleSheet, Text, View } from 'react-native';
import { SharedValue } from 'react-native-reanimated';
import { WaveBar } from './WaveBar';

type WaveformProps = {
  bars: SharedValue<number[]>;
  barCount: number;
  minBarHeight: number;
  maxBarHeight: number;
  enabled: boolean;
  canSample: boolean;
};

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
