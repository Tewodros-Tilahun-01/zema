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
