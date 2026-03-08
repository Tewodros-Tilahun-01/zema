import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';

import { migrateDbIfNeeded } from '../config/db';
import './global.css';

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="zema.db" onInit={migrateDbIfNeeded}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0B0E14' },
        }}
      />
    </SQLiteProvider>
  );
}
