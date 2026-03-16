import { DeezerSearchResults, SearchBar, SearchModeButtons } from '@/components/search';
import { saveRecentSearch } from '@/db/queries';
import { useDebounce } from '@/hooks/useDebounce';
import { useDeezerSearch } from '@/hooks/useDeezerSearch';
import { useRecentSearches } from '@/hooks/useRecentSearches';
import { useTrackPlayer } from '@/hooks/useTrackPlayer';
import { ArtistSearchResult, DeezerPlaylist, SearchMode, Track } from '@/types/deezer';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import Animated, { FadeInDown, FadeOut, LinearTransition } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const BROWSE_TILES = [
  {
    id: 'g1',
    name: 'Pop',
    image:
      'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=200&q=80',
    colors: ['#FA4454', '#C71738'] as [string, string],
  },
  {
    id: 'g2',
    name: 'Hip-Hop',
    image:
      'https://images.unsplash.com/photo-1516280030429-27679b3dc9cf?auto=format&fit=crop&w=200&q=80',
    colors: ['#5E5CE6', '#3532A7'] as [string, string],
  },
  {
    id: 'g3',
    name: 'Electronic',
    image:
      'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?auto=format&fit=crop&w=200&q=80',
    colors: ['#F59E0B', '#B45309'] as [string, string],
  },
  {
    id: 'g4',
    name: 'Afrobeats',
    image:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=200&q=80',
    colors: ['#14B8A6', '#0F766E'] as [string, string],
  },
  {
    id: 'g5',
    name: 'R&B',
    image:
      'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&w=200&q=80',
    colors: ['#EC4899', '#A21CAF'] as [string, string],
  },
  {
    id: 'g6',
    name: 'Workout',
    image:
      'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=200&q=80',
    colors: ['#22C55E', '#15803D'] as [string, string],
  },
];

export default function SearchScreen() {
  const inputRef = useRef<TextInput>(null);
  const [query, setQuery] = useState('');
  const [searchMode, setSearchMode] = useState<SearchMode>('track');
  const [showAllSearches, setShowAllSearches] = useState(false);
  const { handleTrackPress } = useTrackPlayer();

  // Debounce search query - automatically search after 500ms of no typing
  const debouncedQuery = useDebounce(query, 500);

  // Deezer search with debounced query
  const { data: deezerResults = [], isLoading } = useDeezerSearch(debouncedQuery, searchMode);

  // Recent searches
  const { data: recentSearches = [], clearAll, removeSearch, refresh } = useRecentSearches();

  const isSearchActive = debouncedQuery.trim().length > 0;
  const isTyping = query !== debouncedQuery && query.trim().length > 0;

  // Show only 4 searches initially
  const displayedSearches = showAllSearches ? recentSearches : recentSearches.slice(0, 3);
  const hasMoreSearches = recentSearches.length > 3;

  const handleModeChange = (mode: SearchMode) => {
    setSearchMode(mode);
  };

  const handleResultPress = async (result: Track | ArtistSearchResult | DeezerPlaylist) => {
    // Save to recent searches
    if (debouncedQuery.trim()) {
      await saveRecentSearch(debouncedQuery, searchMode);
      refresh();
    }

    // Navigate or play based on type
    if (result.type === 'track') {
      handleTrackPress(result as Track);
    } else if (result.type === 'artist') {
      router.push(`/(tabs)/artist/${result.id}`);
    } else if (result.type === 'playlist') {
      router.push(`/(tabs)/playlist/${result.id}`);
    }
  };

  const handleRecentSearchPress = (search: (typeof recentSearches)[0]) => {
    // Set the query and mode to trigger a new search
    setQuery(search.query);
    setSearchMode(search.searchMode as SearchMode);
  };

  return (
    <View className="-mb-8 flex-1 bg-[#0B0E14]">
      <SafeAreaView />

      {/* Fixed Header */}
      <View className="px-5">
        {!isSearchActive && (
          <View className="mt-2 mb-5 flex-row items-center justify-between">
            <Text className="text-3xl font-bold text-white">Search</Text>
          </View>
        )}

        <SearchBar
          ref={inputRef}
          value={query}
          onChangeText={setQuery}
          onFocus={() => {}}
          onBlur={() => {}}
          onSubmitEditing={() => inputRef.current?.blur()}
          onClear={() => setQuery('')}
        />

        {isSearchActive && (
          <View className="">
            <SearchModeButtons selectedMode={searchMode} onModeChange={handleModeChange} />
          </View>
        )}
      </View>

      {/* Scrollable Content */}
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pb-28"
        showsVerticalScrollIndicator={false}
      >
        {isSearchActive && (
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

        {!isSearchActive && (
          <>
            {recentSearches.length > 0 && (
              <View className="mt-4">
                <View className="mb-3 flex-row items-center justify-between">
                  <Text className="text-xl font-semibold text-white">Recent searches</Text>
                  <Pressable onPress={clearAll}>
                    <Text className="text-xs font-medium text-white/60">Clear all</Text>
                  </Pressable>
                </View>
                {displayedSearches.map((item, index) => (
                  <AnimatedPressable
                    key={item.id}
                    entering={FadeInDown.delay(index * 50).springify()}
                    exiting={FadeOut.duration(200)}
                    layout={LinearTransition.springify().duration(300)}
                    onPress={() => handleRecentSearchPress(item)}
                  >
                    <View className="mb-3 flex-row items-center justify-between rounded-xl bg-white/5 px-4 py-3">
                      <View className="flex-1 flex-row items-center">
                        <Ionicons name="time-outline" size={20} color="#8E8E93" />
                        <View className="ml-3 flex-1">
                          <Text className="text-sm font-medium text-white">{item.query}</Text>
                          <Text className="text-xs text-white/65 capitalize">
                            {item.searchMode}
                          </Text>
                        </View>
                      </View>
                      <Pressable
                        onPress={(e) => {
                          e.stopPropagation();
                          removeSearch(item.id);
                        }}
                        hitSlop={8}
                      >
                        <Ionicons name="close" size={18} color="#8E8E93" />
                      </Pressable>
                    </View>
                  </AnimatedPressable>
                ))}
                {hasMoreSearches && (
                  <Pressable
                    className="mx-auto mt-1 w-40 flex-row items-center justify-center rounded-xl bg-white/5 py-3"
                    onPress={() => setShowAllSearches(!showAllSearches)}
                  >
                    <Text className="text-sm font-medium text-white/80">
                      {showAllSearches ? 'Show less' : `Show more (${recentSearches.length - 3})`}
                    </Text>
                    <Ionicons
                      name={showAllSearches ? 'chevron-up' : 'chevron-down'}
                      size={16}
                      color="#FFFFFFCC"
                      style={{ marginLeft: 4 }}
                    />
                  </Pressable>
                )}
              </View>
            )}

            <View className="mt-7">
              <Text className="mb-3 text-xl font-semibold text-white">Browse all</Text>
              <View className="flex-row flex-wrap justify-between">
                {BROWSE_TILES.map((tile) => (
                  <Pressable
                    key={tile.id}
                    className="mb-3 h-22 w-[48.5%] overflow-hidden rounded-xl"
                  >
                    <LinearGradient colors={tile.colors} className="h-full w-full flex-1 p-3">
                      <Text className="h-full p-3 text-base font-bold text-white">{tile.name}</Text>
                      <Image
                        source={{ uri: tile.image }}
                        className="absolute -right-3 -bottom-2 h-18 w-18 rotate-20 rounded-md"
                        contentFit="cover"
                      />
                    </LinearGradient>
                  </Pressable>
                ))}
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
