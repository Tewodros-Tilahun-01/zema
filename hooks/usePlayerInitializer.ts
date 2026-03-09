import { usePlayerStore } from '@/store/playerStore';
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useEffect, useRef } from 'react';

export function useAudioPlayback() {
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const updatePlaybackState = usePlayerStore((state) => state.updatePlaybackState);
  const setPlayer = usePlayerStore((state) => state.setPlayer);

  const currentTrackIdRef = useRef<number | null>(null);
  const isPlayingRef = useRef<boolean>(false);

  // Create audio player when track changes
  const audioSource = currentTrack?.preview || null;
  const player = useAudioPlayer(audioSource, { updateInterval: 100 });
  const status = useAudioPlayerStatus(player);

  // When track changes, reset and start playing
  useEffect(() => {
    if (currentTrack && currentTrack.id !== currentTrackIdRef.current) {
      currentTrackIdRef.current = currentTrack.id;
      isPlayingRef.current = true;
      console.log('🎵 Track changed:', currentTrack.title);
      console.log('🎵 Preview URL:', currentTrack.preview);

      // Start playing the new track
      if (player && isPlaying) {
        console.log('▶️ Auto-starting new track');
        try {
          player.play();
        } catch (error) {
          console.error('❌ Playback error:', error);
        }
      }
    }
  }, [currentTrack, player, isPlaying]);

  // Store player reference
  useEffect(() => {
    if (player) {
      setPlayer(player);
    }
  }, [player, setPlayer]);

  // Configure audio mode once
  useEffect(() => {
    void setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
    });
  }, []);

  // Handle play/pause based on store state - only when it actually changes
  useEffect(() => {
    if (!player || !currentTrack) return;

    // Only act if isPlaying state actually changed
    if (isPlaying !== isPlayingRef.current) {
      isPlayingRef.current = isPlaying;

      if (isPlaying) {
        console.log('▶️ Starting playback');
        try {
          player.play();
        } catch (error) {
          console.error('❌ Playback error:', error);
        }
      } else {
        console.log('⏸️ Pausing playback');
        player.pause();
      }
    }
  }, [isPlaying, player, currentTrack]);

  // Sync playback status to store - but don't update isPlaying to avoid loop
  useEffect(() => {
    updatePlaybackState({
      currentTime: status.currentTime ?? 0,
      duration: status.duration ?? 0,
    });
  }, [status.currentTime, status.duration, updatePlaybackState]);

  return { player, status };
}
