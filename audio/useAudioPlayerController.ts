import {
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
} from 'expo-audio';
import { useCallback, useEffect } from 'react';
import { AppState } from 'react-native';

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

type PlayerSource = Parameters<typeof useAudioPlayer>[0];

export function useAudioPlayerController(source: PlayerSource) {
  const player = useAudioPlayer(source, { updateInterval: 60 });
  const status = useAudioPlayerStatus(player);

  const safePause = useCallback(() => {
    try {
      player.pause();
    } catch (error) {
      const message = String(error);
      // Ignore teardown race when useAudioPlayer already released the shared object.
      if (message.includes('already released')) {
        return;
      }
      throw error;
    }
  }, [player]);

  useEffect(() => {
    player.volume = 0.8;
    player.play();

    void setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
    });
  }, [player]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state !== 'active') {
        safePause();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [safePause]);

  const jumpBy = useCallback(
    (deltaSeconds: number) => {
      const duration = status.duration ?? 0;
      const target = clamp(
        (status.currentTime ?? 0) + deltaSeconds,
        0,
        duration,
      );
      void player.seekTo(target);
    },
    [player, status.currentTime, status.duration],
  );

  const seekToProgress = useCallback(
    async (progress: number) => {
      const duration = status.duration ?? 0;
      if (duration <= 0) return;
      await player.seekTo(clamp(progress, 0, 1) * duration);
    },
    [player, status.duration],
  );

  return {
    player,
    status,
    jumpBy,
    seekToProgress,
  };
}
