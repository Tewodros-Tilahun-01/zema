import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';

import { migrateDbIfNeeded } from '../config/db';
import { queryClient } from '../config/queryClient';
import './global.css';

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SQLiteProvider databaseName="zema.db" onInit={migrateDbIfNeeded}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#0B0E14' },
          }}
        />
      </SQLiteProvider>
    </QueryClientProvider>
  );
}
