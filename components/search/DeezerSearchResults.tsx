import { ArtistSearchResult, DeezerPlaylist, SearchMode, Track } from '@/types/deezer';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

type SearchResult = Track | ArtistSearchResult | DeezerPlaylist;

type DeezerSearchResultsProps = {
  results: SearchResult[];
  mode: SearchMode;
  onTrackPress?: (track: Track) => void;
};

export function DeezerSearchResults({ results, mode, onTrackPress }: DeezerSearchResultsProps) {
  const router = useRouter();

  if (results.length === 0) {
    return <Text style={styles.noResults}>No results found.</Text>;
  }

  const handlePress = (item: SearchResult) => {
    if (mode === 'track' && onTrackPress) {
      onTrackPress(item as Track);
    } else if (mode === 'artist') {
      const artist = item as ArtistSearchResult;
      // @ts-ignore - Dynamic route
      router.push(`/artist/${artist.id}`);
    } else if (mode === 'playlist') {
      const playlist = item as DeezerPlaylist;
      // @ts-ignore - Dynamic route
      router.push(`/(tabs)/playlist/${playlist.id}`);
    }
  };

  const renderTrackItem = (item: Track) => (
    <Pressable
      style={styles.trackItem}
      onPress={() => handlePress(item)}
      android_ripple={{ color: 'rgba(255, 255, 255, 0.1)' }}
    >
      <Image
        source={{ uri: item.album.cover_small }}
        style={styles.trackCover}
        contentFit="cover"
      />
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.trackArtist} numberOfLines={1}>
          {item.artist.name}
        </Text>
      </View>
    </Pressable>
  );

  const renderArtistItem = (item: ArtistSearchResult) => (
    <Pressable
      style={styles.trackItem}
      onPress={() => handlePress(item)}
      android_ripple={{ color: 'rgba(255, 255, 255, 0.1)' }}
    >
      <Image source={{ uri: item.picture_small }} style={styles.artistImage} contentFit="cover" />
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.trackArtist} numberOfLines={1}>
          {item.nb_fan.toLocaleString()} fans
        </Text>
      </View>
    </Pressable>
  );

  const renderPlaylistItem = (item: DeezerPlaylist) => (
    <Pressable
      style={styles.trackItem}
      onPress={() => handlePress(item)}
      android_ripple={{ color: 'rgba(255, 255, 255, 0.1)' }}
    >
      <Image source={{ uri: item.picture_small }} style={styles.trackCover} contentFit="cover" />
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.trackArtist} numberOfLines={1}>
          {item.nb_tracks} {item.nb_tracks === 1 ? 'track' : 'tracks'}
        </Text>
      </View>
    </Pressable>
  );

  const renderItem = ({ item }: { item: SearchResult }) => {
    if (mode === 'track') {
      return renderTrackItem(item as Track);
    } else if (mode === 'artist') {
      return renderArtistItem(item as ArtistSearchResult);
    } else {
      return renderPlaylistItem(item as DeezerPlaylist);
    }
  };

  return (
    <FlatList
      data={results}
      renderItem={renderItem}
      keyExtractor={(item) => `${mode}-${item.id}`}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
      scrollEnabled={false}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 16,
  },
  noResults: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  // Track Item (same as RecentlyPlayedItem)
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: '#0B0E14',
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
  // Artist Image (circular)
  artistImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
});
