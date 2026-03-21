import {
  BrowseTiles,
  DeezerSearchResults,
  RecentSearchList,
  SearchHeader,
} from '@/components/search';
import { saveRecentSearch } from '@/db/queries';
import { useDebounce } from '@/hooks/useDebounce';
import { useDeezerSearch } from '@/hooks/useDeezerSearch';
import { useGenreSearch } from '@/hooks/useGenreSearch';
import { useRecentSearches } from '@/hooks/useRecentSearches';
import { useTrackPlayer } from '@/hooks/useTrackPlayer';
import { ArtistSearchResult, DeezerPlaylist, SearchMode, Track } from '@/types/deezer';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { BackHandler, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SearchScreen() {
  const inputRef = useRef<TextInput>(null);
  const [query, setQuery] = useState('');
  const [searchMode, setSearchMode] = useState<SearchMode>('track');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const { handleTrackPress } = useTrackPlayer();

  const debouncedQuery = useDebounce(query, 500);
  const { data: deezerResults = [], isLoading } = useDeezerSearch(debouncedQuery, searchMode);
  const { data: genreTracks = [], isLoading: isLoadingGenre } = useGenreSearch(selectedGenre);
  const { data: recentSearches = [], clearAll, removeSearch, refresh } = useRecentSearches();

  const isSearchActive = debouncedQuery.trim().length > 0;
  const isTyping = query !== debouncedQuery && query.trim().length > 0;
  const isGenreActive = !!selectedGenre;

  const handleResultPress = async (result: Track | ArtistSearchResult | DeezerPlaylist) => {
    // Save to recent searches
    if (debouncedQuery.trim()) {
      await saveRecentSearch(debouncedQuery, searchMode);
      refresh();
    }

    // Navigate or play based on type
    if (result.type === 'track') {
    } else if (result.type === 'artist') {
      router.push(`/(tabs)/search/artist/${result.id}`);
    } else if (result.type === 'playlist') {
      router.push(`/(tabs)/search/playlist/${result.id}`);
    }
  };

  const handleRecentSearchPress = (search: (typeof recentSearches)[0]) => {
    setQuery(search.query);
    setSearchMode(search.searchMode as SearchMode);
  };

  // Handle hardware back button
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (isGenreActive) {
          setSelectedGenre(null);
          return true; // Prevent default back behavior
        }
        return false; // Allow default back behavior
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => subscription.remove();
    }, [isGenreActive]),
  );

  return (
    <View className="-mb-8 flex-1 bg-[#121212]">
      <SafeAreaView />

      <SearchHeader
        isSearchActive={isSearchActive}
        isGenreActive={isGenreActive}
        selectedGenre={selectedGenre}
        query={query}
        searchMode={searchMode}
        inputRef={inputRef}
        onQueryChange={setQuery}
        onClearQuery={() => setQuery('')}
        onModeChange={setSearchMode}
        onBackFromGenre={() => setSelectedGenre(null)}
      />

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pb-28"
        showsVerticalScrollIndicator={false}
      >
        {isGenreActive && (
          <View className="mt-2">
            {isLoadingGenre ? (
              <Text className="mt-4 text-sm text-white/60">Loading tracks...</Text>
            ) : genreTracks.length > 0 ? (
              <DeezerSearchResults
                results={genreTracks}
                mode="track"
                onTrackPress={handleTrackPress}
              />
            ) : (
              <Text className="text-sm text-white/60">No tracks found.</Text>
            )}
          </View>
        )}

        {isSearchActive && !isGenreActive && (
          <View className="mt-2">
            {isTyping || isLoading ? (
              <Text className="mt-4 text-sm text-white/60">Searching...</Text>
            ) : deezerResults.length > 0 ? (
              <DeezerSearchResults
                results={deezerResults}
                mode={searchMode}
                onTrackPress={handleTrackPress}
                onResultPress={handleResultPress}
              />
            ) : (
              <Text className="text-sm text-white/60">No results found.</Text>
            )}
          </View>
        )}

        {!isSearchActive && !isGenreActive && (
          <>
            <RecentSearchList
              searches={recentSearches}
              onSearchPress={handleRecentSearchPress}
              onRemove={removeSearch}
              onClearAll={clearAll}
            />
            <BrowseTiles onTilePress={setSelectedGenre} />
          </>
        )}
      </ScrollView>
    </View>
  );
}
