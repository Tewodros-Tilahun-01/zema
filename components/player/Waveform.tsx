import { useAudioVisualizer } from '@/audio/useAudioVisualizer';
import { usePlayerStore } from '@/store/playerStore';
import { AudioPlayer } from 'expo-audio';
import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { WaveBar } from './WaveBar';

type WaveformProps = {
  barCount: number;
  minBarHeight: number;
  maxBarHeight: number;
  enabled: boolean;
};

export function Waveform({ barCount, minBarHeight, maxBarHeight, enabled }: WaveformProps) {
  const player = usePlayerStore((state) => state.player);

  // Don't render until player is ready
  if (!player || !enabled) {
    return null;
  }

  return (
    <WaveformContent
      key={player.id}
      player={player}
      barCount={barCount}
      minBarHeight={minBarHeight}
      maxBarHeight={maxBarHeight}
    />
  );
}

type WaveformContentProps = {
  player: AudioPlayer;
  barCount: number;
  minBarHeight: number;
  maxBarHeight: number;
};

const WaveformContent = memo(function WaveformContent({
  player,
  barCount,
  minBarHeight,
  maxBarHeight,
}: WaveformContentProps) {
  const { bars, canSample } = useAudioVisualizer(player, {
    barCount,
    enabled: true,
  });

  if (!canSample) {
    return (
      <View style={styles.waveFallbackRow}>
        <Text style={styles.waveFallbackText}>Visualizer unavailable</Text>
      </View>
    );
  }

  return (
    <View style={styles.waveRow}>
      {Array.from({ length: barCount }, (_, index) => (
        <WaveBar
          key={index}
          bars={bars}
          index={index}
          minBarHeight={minBarHeight}
          maxBarHeight={maxBarHeight}
        />
      ))}
    </View>
  );
});

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
