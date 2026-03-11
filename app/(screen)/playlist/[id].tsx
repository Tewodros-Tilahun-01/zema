import { useTrackPlayer } from '@/hooks/useTrackPlayer';
import { DeezerPaginatedTracks, DeezerPlaylist, Track } from '@/types/deezer';
import { deezerApi } from '@/utils/deezer';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PlaylistScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { handleTrackPress } = useTrackPlayer();

  const [playlist, setPlaylist] = useState<DeezerPlaylist | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoadingPlaylist, setIsLoadingPlaylist] = useState(true);
  const [isLoadingTracks, setIsLoadingTracks] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextUrl, setNextUrl] = useState<string | null>(null);

  // Fetch playlist metadata
  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        setIsLoadingPlaylist(true);
        setError(null);
        const response = await deezerApi.get<DeezerPlaylist>(`/playlist/${id}`);
        setPlaylist(response.data);
      } catch (err) {
        setError('Failed to load playlist');
        console.error('Error fetching playlist:', err);
      } finally {
        setIsLoadingPlaylist(false);
      }
    };

    if (id) {
      fetchPlaylist();
    }
  }, [id]);

  // Fetch initial tracks
  useEffect(() => {
    const fetchTracks = async () => {
      try {
        setIsLoadingTracks(true);
        const response = await deezerApi.get<DeezerPaginatedTracks>(`/playlist/${id}/tracks`, {
          params: { index: 0, limit: 20 },
        });
        setTracks(response.data.data);
        setNextUrl(response.data.next || null);
      } catch (err) {
        console.error('Error fetching tracks:', err);
      } finally {
        setIsLoadingTracks(false);
      }
    };

    if (id && !isLoadingPlaylist) {
      fetchTracks();
    }
  }, [id, isLoadingPlaylist]);

  // Load more tracks
  const loadMoreTracks = useCallback(async () => {
    if (!nextUrl || isLoadingTracks) return;

    try {
      setIsLoadingTracks(true);
      const response = await deezerApi.get<DeezerPaginatedTracks>(nextUrl);
      setTracks((prev) => [...prev, ...response.data.data]);
      setNextUrl(response.data.next || null);
    } catch (err) {
      console.error('Error loading more tracks:', err);
    } finally {
      setIsLoadingTracks(false);
    }
  }, [nextUrl, isLoadingTracks]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderTrackItem = ({ item }: { item: Track }) => (
    <Pressable style={styles.trackItem} onPress={() => handleTrackPress(item)}>
      <Image source={{ uri: item.album.cover_medium }} style={styles.trackCover} />
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.trackArtist} numberOfLines={1}>
          {item.artist.name}
        </Text>
      </View>
      <Text style={styles.trackDuration}>{formatDuration(item.duration)}</Text>
    </Pressable>
  );

  const renderHeader = () => {
    if (!playlist) return null;

    return (
      <View style={styles.header}>
        <Image source={{ uri: playlist.picture_big }} style={styles.coverImage} />
        <Text style={styles.playlistTitle}>{playlist.title}</Text>
        {playlist.description && (
          <Text style={styles.playlistDescription}>{playlist.description}</Text>
        )}
        <View style={styles.playlistMeta}>
          <Text style={styles.metaText}>
            {playlist.creator?.name || playlist.user?.name || 'Unknown'}
          </Text>
          <Text style={styles.metaText}>•</Text>
          <Text style={styles.metaText}>{playlist.nb_tracks} tracks</Text>
        </View>
      </View>
    );
  };

  const renderFooter = () => {
    if (!isLoadingTracks) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#FFFFFF" />
      </View>
    );
  };

  if (isLoadingPlaylist) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  if (error || !playlist) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'Playlist not found'}</Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.headerBar}>
          <Pressable onPress={() => router.back()} style={styles.backIcon}>
            <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.headerTitle}>Playlist</Text>
          <View style={styles.placeholder} />
        </View>
      </SafeAreaView>

      <FlatList
        data={tracks}
        renderItem={renderTrackItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        onEndReached={loadMoreTracks}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0E14',
  },
  safeArea: {
    backgroundColor: '#0B0E14',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0B0E14',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#0B0E14',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 20,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#1C1C1E',
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 80,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  coverImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  playlistTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  playlistDescription: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 12,
  },
  playlistMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  trackCover: {
    width: 56,
    height: 56,
    borderRadius: 8,
  },
  trackInfo: {
    flex: 1,
    marginLeft: 12,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  trackArtist: {
    fontSize: 14,
    color: '#8E8E93',
  },
  trackDuration: {
    fontSize: 14,
    color: '#8E8E93',
    marginLeft: 12,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});
