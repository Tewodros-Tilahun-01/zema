import axios from 'axios';
import { useApiErrorStore } from '../store/apiErrorStore';

export const deezerApi = axios.create({
  baseURL: 'https://api.deezer.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
deezerApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const { setError, error: e } = useApiErrorStore.getState();

    if (error.response) {
      // Server responded with error status
      setError({
        type: 'server',
        message: error.response.data?.message || 'Server error occurred',
        status: error.response.status,
      });
    } else if (error.request) {
      // Request made but no response
      if (!e) {
        setError({
          type: 'network',
          message: 'Check your internet connection',
        });
      }
    } else {
      // Something else happened

      setError({
        type: 'unknown',
        message: error.message || 'An unexpected error occurred',
      });
    }

    return Promise.reject(error);
  },
);
