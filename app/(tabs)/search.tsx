import { DeezerSearchResults, SearchBar, SearchModeButtons } from '@/components/search';
import { useDebounce } from '@/hooks/useDebounce';
import { useDeezerSearch } from '@/hooks/useDeezerSearch';
import { useTrackPlayer } from '@/hooks/useTrackPlayer';
import { SearchMode } from '@/types/deezer';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRef, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const RECENT_SEARCHES = [
  {
    id: 'rs1',
    title: 'Midnight Coding',
    subtitle: 'Playlist',
    image:
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'rs2',
    title: 'Ava Voz',
    subtitle: 'Artist',
    image:
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'rs3',
    title: 'Focus Talks',
    subtitle: 'Podcast',
    image:
      'https://images.unsplash.com/photo-1485579149621-3123dd979885?auto=format&fit=crop&w=200&q=80',
  },
];

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
  const { handleTrackPress } = useTrackPlayer();

  // Debounce search query - automatically search after 500ms of no typing
  const debouncedQuery = useDebounce(query, 500);

  // Deezer search with debounced query
  const { data: deezerResults = [], isLoading } = useDeezerSearch(debouncedQuery, searchMode);

  const isSearchActive = debouncedQuery.trim().length > 0;
  const isTyping = query !== debouncedQuery && query.trim().length > 0;

  const handleModeChange = (mode: SearchMode) => {
    setSearchMode(mode);
  };

  return (
    <View className="flex-1 bg-[#0B0E14]">
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
              />
            ) : (
              <Text className="text-sm text-white/60">No results found.</Text>
            )}
          </View>
        )}

        {!isSearchActive && (
          <>
            <View className="mt-4">
              <View className="mb-3 flex-row items-center justify-between">
                <Text className="text-xl font-semibold text-white">Recent searches</Text>
                <Text className="text-xs font-medium text-white/60">Clear all</Text>
              </View>
              {RECENT_SEARCHES.map((item) => (
                <Pressable
                  key={item.id}
                  className="mb-3 flex-row items-center justify-between rounded-xl bg-white/5 px-3 py-2"
                >
                  <View className="flex-row items-center">
                    <Image
                      source={{ uri: item.image }}
                      className="h-12 w-12 rounded-md"
                      contentFit="cover"
                    />
                    <View className="ml-3">
                      <Text className="text-sm font-semibold text-white">{item.title}</Text>
                      <Text className="text-xs text-white/65">{item.subtitle}</Text>
                    </View>
                  </View>
                  <Ionicons name="close" size={16} color="#FFFFFF99" />
                </Pressable>
              ))}
            </View>

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
