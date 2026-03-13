import { saveRecentlyPlayed } from '@/db/queries';
import { Track } from '@/types/deezer';
import { AudioPlayer } from 'expo-audio';
import { create } from 'zustand';

type PlayerState = {
  // Audio state
  player: AudioPlayer | null;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  volume: number;

  // Track info
  currentTrack: Track | null;

  // Actions
  setPlayer: (player: AudioPlayer | null) => void;
  updatePlaybackState: (state: {
    currentTime?: number;
    duration?: number;
    isPlaying?: boolean;
  }) => void;
  setVolume: (volume: number) => void;
  playTrack: (track: Track) => void;
  togglePlayPause: () => void;
  clearTrack: () => void;
  reset: () => void;

  // Computed
  getProgress: () => number;
};

const initialState = {
  player: null,
  currentTime: 0,
  duration: 0,
  isPlaying: false,
  volume: 0.8,
  currentTrack: null,
};

export const usePlayerStore = create<PlayerState>((set, get) => ({
  ...initialState,

  // Actions
  setPlayer: (player) => set({ player }),

  updatePlaybackState: (state) => set(state),

  setVolume: (volume) => {
    const { player } = get();
    if (player) {
      player.volume = volume;
    }
    set({ volume });
  },

  playTrack: (track) => {
    console.log('🎵 Playing track:', track.title);
    set({ currentTrack: track, isPlaying: true, currentTime: 0 });

    // Save to recently played
    saveRecentlyPlayed(track).catch((error) => {
      console.error('Failed to save recently played track:', error);
    });
  },

  togglePlayPause: () => {
    set((state) => ({ isPlaying: !state.isPlaying }));
  },

  clearTrack: () => {
    const { player } = get();
    if (player) {
      player.pause();
    }
    set({ currentTrack: null, isPlaying: false, currentTime: 0, duration: 0 });
  },

  reset: () => set(initialState),

  // Computed
  getProgress: () => {
    const { currentTime, duration } = get();
    return duration > 0 ? Math.min(Math.max(currentTime / duration, 0), 1) : 0;
  },
}));
