import { SQLiteDatabase } from 'expo-sqlite';

export async function runMigrations(db: SQLiteDatabase) {
  try {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      
      CREATE TABLE IF NOT EXISTS recently_played (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        track_id INTEGER NOT NULL UNIQUE,
        title TEXT NOT NULL,
        artist TEXT NOT NULL,
        artist_id INTEGER NOT NULL,
        album_title TEXT NOT NULL,
        album_id INTEGER NOT NULL,
        cover_small TEXT NOT NULL,
        cover_medium TEXT NOT NULL,
        duration INTEGER NOT NULL,
        preview_url TEXT NOT NULL,
        played_at INTEGER NOT NULL
      );
      
      CREATE INDEX IF NOT EXISTS idx_played_at ON recently_played(played_at DESC);
      CREATE INDEX IF NOT EXISTS idx_track_id ON recently_played(track_id);
      
      CREATE TABLE IF NOT EXISTS recent_searches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        query TEXT NOT NULL UNIQUE,
        search_mode TEXT NOT NULL,
        searched_at INTEGER NOT NULL
      );
      
      CREATE INDEX IF NOT EXISTS idx_searched_at ON recent_searches(searched_at DESC);
      CREATE INDEX IF NOT EXISTS idx_query ON recent_searches(query);
    `);
    console.log('✅ Database migrations completed successfully');
  } catch (error) {
    console.error('❌ Error running migrations:', error);
    throw error;
  }
}
