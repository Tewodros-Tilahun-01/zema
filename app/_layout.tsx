import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { BottomSheetPlayer } from '../components/player/BottomSheetPlayer';
import { migrateDbIfNeeded } from '../config/db';
import { queryClient } from '../config/queryClient';
import { useAudioPlayback } from '../hooks/usePlayerInitializer';
import './global.css';

function AppContent() {
  // Initialize audio playback at root level
  useAudioPlayback();

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0B0E14' },
        }}
      />
      <BottomSheetPlayer />
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <SQLiteProvider databaseName="zema.db" onInit={migrateDbIfNeeded}>
          <AppContent />
        </SQLiteProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
