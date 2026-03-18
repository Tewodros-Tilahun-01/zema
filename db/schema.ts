import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const recentlyPlayed = sqliteTable('recently_played', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  trackId: integer('track_id').notNull().unique(),
  title: text('title').notNull(),
  artist: text('artist').notNull(),
  artistId: integer('artist_id').notNull(),
  albumTitle: text('album_title').notNull(),
  albumId: integer('album_id').notNull(),
  coverSmall: text('cover_small').notNull(),
  coverMedium: text('cover_medium').notNull(),
  duration: integer('duration').notNull(),
  previewUrl: text('preview_url').notNull(),
  playedAt: integer('played_at').notNull(),
});

export type RecentlyPlayed = typeof recentlyPlayed.$inferSelect;
export type NewRecentlyPlayed = typeof recentlyPlayed.$inferInsert;

export const recentSearches = sqliteTable('recent_searches', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  query: text('query').notNull().unique(),
  searchMode: text('search_mode').notNull(), // 'track' | 'artist' | 'playlist'
  searchedAt: integer('searched_at').notNull(),
});

export type RecentSearch = typeof recentSearches.$inferSelect;
export type NewRecentSearch = typeof recentSearches.$inferInsert;

// Collections (Playlists + Favorites)
export const collections = sqliteTable('collections', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  type: text('type').notNull(), // 'system' | 'user'
  systemType: text('system_type'), // 'favorites' | 'downloads' | null
  description: text('description'),
  coverUrl: text('cover_url'),
  trackCount: integer('track_count').notNull().default(0),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

export type Collection = typeof collections.$inferSelect;
export type NewCollection = typeof collections.$inferInsert;

// Collection Tracks
export const collectionTracks = sqliteTable('collection_tracks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  collectionId: integer('collection_id')
    .notNull()
    .references(() => collections.id, { onDelete: 'cascade' }),
  trackId: integer('track_id').notNull(),
  title: text('title').notNull(),
  artist: text('artist').notNull(),
  artistId: integer('artist_id').notNull(),
  albumTitle: text('album_title').notNull(),
  albumId: integer('album_id').notNull(),
  coverSmall: text('cover_small').notNull(),
  coverMedium: text('cover_medium').notNull(),
  coverBig: text('cover_big').notNull(),
  coverXl: text('cover_xl').notNull(),
  duration: integer('duration').notNull(),
  previewUrl: text('preview_url').notNull(),
  position: integer('position').notNull(),
  addedAt: integer('added_at').notNull(),
});

export type CollectionTrack = typeof collectionTracks.$inferSelect;
export type NewCollectionTrack = typeof collectionTracks.$inferInsert;
