import { create } from 'zustand';

type ApiError = {
  type: 'network' | 'server' | 'unknown';
  message: string;
  status?: number;
};

type ApiErrorState = {
  error: ApiError | null;
  showAlert: boolean;
  setError: (error: ApiError) => void;
  clearError: () => void;
};

export const useApiErrorStore = create<ApiErrorState>((set) => ({
  error: null,
  showAlert: false,

  setError: (error) => {
    set({ error, showAlert: true });

    // Auto-hide after 4 seconds
    setTimeout(() => {
      set({ showAlert: false });
      // Clear error after animation completes
      setTimeout(() => {
        set({ error: null });
      }, 300);
    }, 4000);
  },

  clearError: () => {
    set({ showAlert: false });
    setTimeout(() => {
      set({ error: null });
    }, 300);
  },
}));
