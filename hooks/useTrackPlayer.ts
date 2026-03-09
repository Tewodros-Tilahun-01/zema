import { usePlayerStore } from '@/store/playerStore';
import { Track } from '@/types/deezer';
import { useCallback } from 'react';

export const useTrackPlayer = () => {
  const playTrack = usePlayerStore((state) => state.playTrack);

  const handleTrackPress = useCallback(
    (track: Track) => {
      console.log('🎯 Track pressed:', track.title);
      playTrack(track);
    },
    [playTrack],
  );

  return { handleTrackPress };
};
