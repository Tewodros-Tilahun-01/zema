import { AudioPlayer } from 'expo-audio';
import { create } from 'zustand';

export type Track = {
  id: string;
  title: string;
  artist: string;
  artwork: string;
  source: any;
};

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
  setCurrentTrack: (track: Track | null) => void;
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

  setCurrentTrack: (currentTrack) => set({ currentTrack }),

  reset: () => set(initialState),

  // Computed
  getProgress: () => {
    const { currentTime, duration } = get();
    return duration > 0 ? Math.min(Math.max(currentTime / duration, 0), 1) : 0;
  },
}));
