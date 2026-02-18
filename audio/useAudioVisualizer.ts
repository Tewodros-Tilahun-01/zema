import {
  requestRecordingPermissionsAsync,
  useAudioSampleListener,
} from 'expo-audio';
import { Platform } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { useSharedValue } from 'react-native-reanimated';

const DEFAULT_BAR_COUNT = 40;
const UPDATE_THROTTLE_MS = 50;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function mapFramesToBars(frames: number[], barCount: number) {
  if (!frames.length) {
    return new Array(barCount).fill(0.06);
  }

  const chunkSize = Math.max(1, Math.floor(frames.length / barCount));
  const energyByBar: number[] = [];

  for (let i = 0; i < barCount; i += 1) {
    const start = i * chunkSize;
    const end = i === barCount - 1 ? frames.length : start + chunkSize;
    let sumAbs = 0;
    let sumSquares = 0;
    let peak = 0;

    for (let j = start; j < end; j += 1) {
      const sample = Math.abs(frames[j] ?? 0);
      sumAbs += sample;
      sumSquares += sample * sample;
      if (sample > peak) peak = sample;
    }

    const length = Math.max(1, end - start);
    const avg = sumAbs / length;
    const rms = Math.sqrt(sumSquares / length);

    energyByBar.push(rms * 0.72 + peak * 0.2 + avg * 0.08);
  }

  const maxEnergy = Math.max(...energyByBar, 0.001);
  return energyByBar.map((energy) => {
    const normalized = energy / maxEnergy;
    return clamp(Math.pow(normalized, 0.58), 0.03, 1);
  });
}

type SamplePlayer = Parameters<typeof useAudioSampleListener>[0];

export function useAudioVisualizer(
  player: SamplePlayer,
  options?: { barCount?: number; enabled?: boolean },
) {
  const barCount = options?.barCount ?? DEFAULT_BAR_COUNT;
  const enabled = options?.enabled ?? true;

  const bars = useSharedValue<number[]>(new Array(barCount).fill(0.14));
  const [canSample, setCanSample] = useState(true);
  const lastUpdateRef = useRef(0);

  useEffect(() => {
    bars.value = new Array(barCount).fill(0.14);
  }, [barCount, bars]);

  useEffect(() => {
    const setupSampling = async () => {
      if (!enabled) {
        setCanSample(true);
        return;
      }

      if (!player.isAudioSamplingSupported) {
        setCanSample(false);
        return;
      }

      if (Platform.OS === 'android') {
        const permission = await requestRecordingPermissionsAsync();
        if (!permission.granted) {
          setCanSample(false);
          return;
        }
      }

      setCanSample(true);
    };

    void setupSampling();
  }, [enabled, player]);

  useAudioSampleListener(player, (sample) => {
    if (!enabled || !canSample) return;

    const now = Date.now();
    if (now - lastUpdateRef.current < UPDATE_THROTTLE_MS) {
      return;
    }
    lastUpdateRef.current = now;

    const frames = sample.channels[0]?.frames ?? [];
    const nextBars = mapFramesToBars(frames, barCount);

    const previous = bars.value;
    const smoothed = new Array(barCount);
    for (let i = 0; i < barCount; i += 1) {
      const prev = previous[i] ?? 0.14;
      smoothed[i] = prev * 0.45 + (nextBars[i] ?? 0.1) * 0.55;
    }
    bars.value = smoothed;
  });

  return { bars, barCount, canSample };
}
