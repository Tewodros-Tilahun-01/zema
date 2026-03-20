import { SQLiteDatabase } from 'expo-sqlite';

export async function runMigrations(db: SQLiteDatabase) {
  try {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      
      -- Migration: Update downloads table schema
      -- Drop old downloads table if it exists with old schema
      DROP TABLE IF EXISTS downloads;
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
      
      CREATE TABLE IF NOT EXISTS collections (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        system_type TEXT,
        description TEXT,
        cover_url TEXT,
        track_count INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );
      
      CREATE INDEX IF NOT EXISTS idx_collections_type ON collections(type);
      CREATE INDEX IF NOT EXISTS idx_collections_system_type ON collections(system_type);
      CREATE INDEX IF NOT EXISTS idx_collections_updated_at ON collections(updated_at DESC);
      
      CREATE TABLE IF NOT EXISTS collection_tracks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        collection_id INTEGER NOT NULL,
        track_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        artist TEXT NOT NULL,
        artist_id INTEGER NOT NULL,
        album_title TEXT NOT NULL,
        album_id INTEGER NOT NULL,
        cover_small TEXT NOT NULL,
        cover_medium TEXT NOT NULL,
        cover_big TEXT NOT NULL,
        cover_xl TEXT NOT NULL,
        duration INTEGER NOT NULL,
        preview_url TEXT NOT NULL,
        position INTEGER NOT NULL,
        added_at INTEGER NOT NULL,
        FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE
      );
      
      CREATE INDEX IF NOT EXISTS idx_collection_tracks_collection_id ON collection_tracks(collection_id);
      CREATE INDEX IF NOT EXISTS idx_collection_tracks_track_id ON collection_tracks(track_id);
      CREATE INDEX IF NOT EXISTS idx_collection_tracks_position ON collection_tracks(position);
      
      CREATE TABLE IF NOT EXISTS downloads (
        id TEXT PRIMARY KEY,
        track_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        artist TEXT NOT NULL,
        artist_id INTEGER NOT NULL,
        album_title TEXT NOT NULL,
        album_id INTEGER NOT NULL,
        cover_small TEXT NOT NULL,
        cover_medium TEXT NOT NULL,
        cover_big TEXT NOT NULL,
        cover_xl TEXT NOT NULL,
        duration INTEGER NOT NULL,
        local_uri TEXT NOT NULL,
        remote_url TEXT NOT NULL,
        downloaded_at INTEGER NOT NULL,
        file_size INTEGER NOT NULL
      );
      
      CREATE INDEX IF NOT EXISTS idx_downloads_downloaded_at ON downloads(downloaded_at DESC);
      CREATE INDEX IF NOT EXISTS idx_downloads_track_id ON downloads(track_id);
    `);
    console.log('✅ Database migrations completed successfully');
  } catch (error) {
    console.error('❌ Error running migrations:', error);
    throw error;
  }
}
