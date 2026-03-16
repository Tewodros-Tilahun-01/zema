import { SearchMode, Track } from '@/types/deezer';
import { desc, eq, sql } from 'drizzle-orm';
import { db } from './client';
import { NewRecentlyPlayed, NewRecentSearch, recentlyPlayed, recentSearches } from './schema';

const MAX_RECENT_TRACKS = 10;

export async function saveRecentlyPlayed(track: Track) {
  const trackData: NewRecentlyPlayed = {
    trackId: track.id,
    title: track.title,
    artist: track.artist.name,
    artistId: track.artist.id,
    albumTitle: track.album.title,
    albumId: track.album.id,
    coverSmall: track.album.cover_small,
    coverMedium: track.album.cover_medium,
    duration: track.duration,
    previewUrl: track.preview,
    playedAt: Date.now(),
  };

  try {
    // Update if exists, insert if not
    await db
      .insert(recentlyPlayed)
      .values(trackData)
      .onConflictDoUpdate({
        target: recentlyPlayed.trackId,
        set: { playedAt: Date.now() },
      });

    // Delete oldest tracks if over limit using a single query
    await db.run(sql`
      DELETE FROM recently_played 
      WHERE id IN (
        SELECT id FROM recently_played 
        ORDER BY played_at DESC 
        LIMIT -1 OFFSET ${MAX_RECENT_TRACKS}
      )
    `);
  } catch (error) {
    console.error('Error saving recently played track:', error);
  }
}

export async function getRecentlyPlayed(limit: number = 10) {
  try {
    return await db
      .select()
      .from(recentlyPlayed)
      .orderBy(desc(recentlyPlayed.playedAt))
      .limit(limit);
  } catch (error) {
    console.error('Error fetching recently played tracks:', error);
    return [];
  }
}

export async function clearRecentlyPlayed() {
  try {
    await db.delete(recentlyPlayed);
  } catch (error) {
    console.error('Error clearing recently played tracks:', error);
  }
}

export async function removeRecentlyPlayed(trackId: number) {
  try {
    await db.delete(recentlyPlayed).where(eq(recentlyPlayed.trackId, trackId));
  } catch (error) {
    console.error('Error removing recently played track:', error);
  }
}

// Recent Searches
const MAX_RECENT_SEARCHES = 10;

export async function saveRecentSearch(query: string, searchMode: SearchMode) {
  const searchData: NewRecentSearch = {
    query: query.trim(),
    searchMode,
    searchedAt: Date.now(),
  };

  try {
    // Update if exists, insert if not
    await db
      .insert(recentSearches)
      .values(searchData)
      .onConflictDoUpdate({
        target: recentSearches.query,
        set: { searchedAt: Date.now(), searchMode },
      });

    // Delete oldest searches if over limit
    await db.run(sql`
      DELETE FROM recent_searches 
      WHERE id IN (
        SELECT id FROM recent_searches 
        ORDER BY searched_at DESC 
        LIMIT -1 OFFSET ${MAX_RECENT_SEARCHES}
      )
    `);
  } catch (error) {
    console.error('Error saving recent search:', error);
  }
}

export async function getRecentSearches(limit: number = 10) {
  try {
    return await db
      .select()
      .from(recentSearches)
      .orderBy(desc(recentSearches.searchedAt))
      .limit(limit);
  } catch (error) {
    console.error('Error fetching recent searches:', error);
    return [];
  }
}

export async function clearRecentSearches() {
  try {
    await db.delete(recentSearches);
  } catch (error) {
    console.error('Error clearing recent searches:', error);
  }
}

export async function removeRecentSearch(id: number) {
  try {
    await db.delete(recentSearches).where(eq(recentSearches.id, id));
  } catch (error) {
    console.error('Error removing recent search:', error);
  }
}
