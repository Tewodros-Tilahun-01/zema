import { PortalProvider } from '@gorhom/portal';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { PlayerManager } from '../components/player/PlayerManager';
import { migrateDbIfNeeded } from '../config/db';
import { queryClient } from '../config/queryClient';
import { useAudioPlayback } from '../hooks/usePlayerInitializer';
import './global.css';

export default function RootLayout() {
  // Initialize audio playback at root level
  useAudioPlayback();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PortalProvider>
        <QueryClientProvider client={queryClient}>
          <SQLiteProvider databaseName="zema.db" onInit={migrateDbIfNeeded}>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: '#0B0E14' },
              }}
            />
            <PlayerManager />
          </SQLiteProvider>
        </QueryClientProvider>
      </PortalProvider>
    </GestureHandlerRootView>
  );
}
