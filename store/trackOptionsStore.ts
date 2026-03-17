import { Track } from '@/types/deezer';
import { create } from 'zustand';

type TrackOptionsState = {
  isVisible: boolean;
  fullTrack: Track | null;

  // Actions
  showTrackOptions: (track: Track) => void;
  hideTrackOptions: () => void;
};

export const useTrackOptionsStore = create<TrackOptionsState>((set) => ({
  isVisible: false,
  fullTrack: null,

  showTrackOptions: (track: Track) => {
    set({
      fullTrack: track,
      isVisible: true,
    });
  },

  hideTrackOptions: () => {
    set({
      isVisible: false,
      fullTrack: null,
    });
  },
}));
