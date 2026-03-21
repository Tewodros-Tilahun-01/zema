/**
 * Theme configuration for the app
 * Centralized color management for maintainability
 */

export const theme = {
  colors: {
    background: '#121212',
    // Add other theme colors here as needed
    primary: '#7A58FF',
    text: {
      primary: '#FFFFFF',
      secondary: '#B3B3B3',
    },
  },
} as const;

export type Theme = typeof theme;
