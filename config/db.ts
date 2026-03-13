import { runMigrations } from '@/db/migrations';
import type { SQLiteDatabase } from 'expo-sqlite';

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  await runMigrations(db);
}
