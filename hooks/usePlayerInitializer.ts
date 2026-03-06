import { Track, usePlayerStore } from '@/store/playerStore';
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useEffect } from 'react';
import { AppState } from 'react-native';

export function usePlayerInitializer(track: Track) {
  const player = useAudioPlayer(track.source, { updateInterval: 60 });
  const status = useAudioPlayerStatus(player);

  const setPlayer = usePlayerStore((state) => state.setPlayer);
  const updatePlaybackState = usePlayerStore((state) => state.updatePlaybackState);
  const setVolume = usePlayerStore((state) => state.setVolume);
  const setCurrentTrack = usePlayerStore((state) => state.setCurrentTrack);
  const reset = usePlayerStore((state) => state.reset);

  // Initialize player on mount
  useEffect(() => {
    setPlayer(player);
    setCurrentTrack(track);
    player.volume = 0.8;
    setVolume(0.8);
    player.play();

    void setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
    });

    // Cleanup on unmount
    return () => {
      try {
        player.pause();
      } catch (error) {
        // Ignore if already released
      }
      reset();
    };
  }, [player, setPlayer, setCurrentTrack, setVolume, track, reset]);

  // Sync status to store
  useEffect(() => {
    updatePlaybackState({
      currentTime: status.currentTime ?? 0,
      duration: status.duration ?? 0,
      isPlaying: status.playing ?? false,
    });
  }, [status.currentTime, status.duration, status.playing, updatePlaybackState]);

  // Handle app state changes
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state !== 'active') {
        try {
          player.pause();
        } catch (error) {
          const message = String(error);
          if (message.includes('already released')) {
            return;
          }
          console.error('Error pausing player:', error);
        }
      }
    });
  }, [player]);
}
