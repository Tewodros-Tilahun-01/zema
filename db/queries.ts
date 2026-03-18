import { SearchMode, Track } from '@/types/deezer';
import { desc, eq, sql } from 'drizzle-orm';
import { db } from './client';
import {
  collections,
  collectionTracks,
  NewRecentlyPlayed,
  NewRecentSearch,
  recentlyPlayed,
  recentSearches,
} from './schema';

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

// Collections Queries
export async function initializeFavoritesCollection() {
  try {
    const existing = await db
      .select()
      .from(collections)
      .where(eq(collections.systemType, 'favorites'))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(collections).values({
        name: 'Favorites',
        type: 'system',
        systemType: 'favorites',
        description: 'Your favorite tracks',
        trackCount: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
  } catch (error) {
    console.error('Error initializing favorites collection:', error);
  }
}

export async function getAllCollections() {
  try {
    const allCollections = await db
      .select()
      .from(collections)
      .orderBy(
        sql`CASE 
        WHEN system_type = 'favorites' THEN 0 
        ELSE 1 
      END`,
        desc(collections.updatedAt),
      );

    // Get first track cover for collections without custom cover
    const collectionsWithCovers = await Promise.all(
      allCollections.map(async (collection) => {
        if (collection.coverUrl) {
          return collection;
        }

        const firstTrack = await db
          .select()
          .from(collectionTracks)
          .where(eq(collectionTracks.collectionId, collection.id))
          .limit(1);

        return {
          ...collection,
          coverUrl: firstTrack[0]?.coverMedium || null,
        };
      }),
    );

    return collectionsWithCovers;
  } catch (error) {
    console.error('Error fetching collections:', error);
    return [];
  }
}

export async function getCollectionById(collectionId: number) {
  try {
    const collection = await db
      .select()
      .from(collections)
      .where(eq(collections.id, collectionId))
      .limit(1);

    return collection[0] || null;
  } catch (error) {
    console.error('Error fetching collection:', error);
    return null;
  }
}

export async function getCollectionTracks(collectionId: number) {
  try {
    return await db
      .select()
      .from(collectionTracks)
      .where(eq(collectionTracks.collectionId, collectionId))
      .orderBy(collectionTracks.position);
  } catch (error) {
    console.error('Error fetching collection tracks:', error);
    return [];
  }
}

export async function createCollection(name: string, description?: string) {
  try {
    const result = await db.insert(collections).values({
      name,
      type: 'user',
      systemType: null,
      description: description || null,
      coverUrl: null,
      trackCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error creating collection:', error);
    return null;
  }
}

export async function addTrackToCollection(collectionId: number, track: Track) {
  try {
    // Get current max position
    const existingTracks = await db
      .select()
      .from(collectionTracks)
      .where(eq(collectionTracks.collectionId, collectionId));

    const maxPosition = existingTracks.reduce((max, t) => Math.max(max, t.position), -1);

    // Check if track already exists
    const exists = existingTracks.find((t) => t.trackId === track.id);
    if (exists) {
      return false; // Track already in collection
    }

    await db.insert(collectionTracks).values({
      collectionId,
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
      position: maxPosition + 1,
      addedAt: Date.now(),
    });

    // Update collection's trackCount and updatedAt
    await db
      .update(collections)
      .set({
        trackCount: existingTracks.length + 1,
        updatedAt: Date.now(),
      })
      .where(eq(collections.id, collectionId));

    return true;
  } catch (error) {
    console.error('Error adding track to collection:', error);
    return false;
  }
}

export async function removeTrackFromCollection(collectionId: number, trackId: number) {
  try {
    await db
      .delete(collectionTracks)
      .where(
        sql`${collectionTracks.collectionId} = ${collectionId} AND ${collectionTracks.trackId} = ${trackId}`,
      );

    // Get updated track count
    const remainingTracks = await db
      .select()
      .from(collectionTracks)
      .where(eq(collectionTracks.collectionId, collectionId));

    // Update collection's trackCount and updatedAt
    await db
      .update(collections)
      .set({
        trackCount: remainingTracks.length,
        updatedAt: Date.now(),
      })
      .where(eq(collections.id, collectionId));

    return true;
  } catch (error) {
    console.error('Error removing track from collection:', error);
    return false;
  }
}

export async function deleteCollection(collectionId: number) {
  try {
    // Check if it's a system collection
    const collection = await getCollectionById(collectionId);
    if (collection?.type === 'system') {
      return false; // Cannot delete system collections
    }

    await db.delete(collections).where(eq(collections.id, collectionId));
    return true;
  } catch (error) {
    console.error('Error deleting collection:', error);
    return false;
  }
}

export async function getCollectionsWithTrackStatus(trackId: number) {
  try {
    const allCollections = await db
      .select()
      .from(collections)
      .orderBy(
        sql`CASE 
        WHEN system_type = 'favorites' THEN 0 
        ELSE 1 
      END`,
        desc(collections.updatedAt),
      );

    // Check which collections contain this track
    const collectionsWithStatus = await Promise.all(
      allCollections.map(async (collection) => {
        const trackInCollection = await db
          .select()
          .from(collectionTracks)
          .where(
            sql`${collectionTracks.collectionId} = ${collection.id} AND ${collectionTracks.trackId} = ${trackId}`,
          )
          .limit(1);

        const firstTrack = await db
          .select()
          .from(collectionTracks)
          .where(eq(collectionTracks.collectionId, collection.id))
          .limit(1);

        return {
          ...collection,
          isTrackInCollection: trackInCollection.length > 0,
          coverUrl: collection.coverUrl || firstTrack[0]?.coverMedium || null,
        };
      }),
    );

    // Sort: Favorites first, then collections without track, then collections with track
    return collectionsWithStatus.sort((a, b) => {
      // Favorites always first
      if (a.systemType === 'favorites') return -1;
      if (b.systemType === 'favorites') return 1;

      // Then sort by track status
      if (a.isTrackInCollection === b.isTrackInCollection) return 0;
      return a.isTrackInCollection ? 1 : -1;
    });
  } catch (error) {
    console.error('Error fetching collections with track status:', error);
    return [];
  }
}

export async function getFavoritesCollectionId() {
  try {
    await initializeFavoritesCollection();

    const favCollection = await db
      .select()
      .from(collections)
      .where(eq(collections.systemType, 'favorites'))
      .limit(1);

    return favCollection[0]?.id || null;
  } catch (error) {
    console.error('Error getting favorites collection ID:', error);
    return null;
  }
}
