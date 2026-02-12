import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useRef, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type QuickFilter = {
  id: string;
  label: string;
};

type SearchItem = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
};

type GenreTile = {
  id: string;
  name: string;
  image: string;
  colors: [string, string];
};

const QUICK_FILTERS: QuickFilter[] = [
  { id: 'f1', label: 'Podcasts' },
  { id: 'f2', label: 'Live Events' },
  { id: 'f3', label: 'Mood' },
  { id: 'f4', label: 'New Releases' },
  { id: 'f5', label: 'Charts' },
];

const SEARCH_RESULTS: SearchItem[] = [
  {
    id: 'tr1',
    title: 'Neon Afternoons',
    subtitle: 'Playlist',
    image:
      'https://images.unsplash.com/photo-1518972559570-0a5558a3d6f3?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'tr2',
    title: 'Mako North',
    subtitle: 'Artist',
    image:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'tr3',
    title: 'Sunline Radio',
    subtitle: 'Podcast',
    image:
      'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=200&q=80',
  },
];

const RECENT_SEARCHES: SearchItem[] = [
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

const BROWSE_TILES: GenreTile[] = [
  {
    id: 'g1',
    name: 'Pop',
    image:
      'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=200&q=80',
    colors: ['#FA4454', '#C71738'],
  },
  {
    id: 'g2',
    name: 'Hip-Hop',
    image:
      'https://images.unsplash.com/photo-1516280030429-27679b3dc9cf?auto=format&fit=crop&w=200&q=80',
    colors: ['#5E5CE6', '#3532A7'],
  },
  {
    id: 'g3',
    name: 'Electronic',
    image:
      'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?auto=format&fit=crop&w=200&q=80',
    colors: ['#F59E0B', '#B45309'],
  },
  {
    id: 'g4',
    name: 'Afrobeats',
    image:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=200&q=80',
    colors: ['#14B8A6', '#0F766E'],
  },
  {
    id: 'g5',
    name: 'R&B',
    image:
      'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&w=200&q=80',
    colors: ['#EC4899', '#A21CAF'],
  },
  {
    id: 'g6',
    name: 'Workout',
    image:
      'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=200&q=80',
    colors: ['#22C55E', '#15803D'],
  },
];

export default function SearchScreen() {
  const inputRef = useRef<TextInput>(null);
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const filteredResults = useMemo(() => {
    const normalizedQuery = submittedQuery.trim().toLowerCase();
    if (!normalizedQuery) {
      return [];
    }

    return SEARCH_RESULTS.filter((item) =>
      `${item.title} ${item.subtitle}`.toLowerCase().includes(normalizedQuery)
    );
  }, [submittedQuery]);

  const isSearchMode = submittedQuery.trim().length > 0;
  const isTypingOnly = isTyping && !isSearchMode;

  return (
    <View className="flex-1 bg-[#0B0E14]">
      <SafeAreaView />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pb-28"
        showsVerticalScrollIndicator={false}
      >
        <View className="mt-2 mb-5 flex-row items-center justify-between">
          <Text className="text-3xl font-bold text-white">Search</Text>
        </View>

        <Pressable
          className="mb-5 flex-row items-center rounded-full bg-white px-4 py-2"
          onPress={() => inputRef.current?.focus()}
        >
          <Ionicons name="search" size={18} color="#111827" />
          <TextInput
            ref={inputRef}
            value={query}
            onChangeText={(text) => {
              setQuery(text);
              setSubmittedQuery('');
              setIsTyping(text.trim().length > 0);
            }}
            onFocus={() => setIsTyping(query.trim().length > 0)}
            onBlur={() => setIsTyping(false)}
            onSubmitEditing={() => {
              const trimmedQuery = query.trim();
              setSubmittedQuery(trimmedQuery);
              setIsTyping(false);
            }}
            returnKeyType="search"
            placeholder="What do you want to play?"
            placeholderTextColor="#11182799"
            className="ml-2 flex-1 py-1 text-base font-semibold text-black"
          />
          {!!query && (
            <Pressable
              className="ml-2 h-6 w-6 items-center justify-center rounded-full bg-black/10"
              onPress={() => {
                setQuery('');
                setSubmittedQuery('');
                setIsTyping(false);
              }}
            >
              <Ionicons name="close" size={14} color="#111827" />
            </Pressable>
          )}
        </Pressable>

        {!isTypingOnly && isSearchMode && (
          <View className="mt-2">
            <Text className="mb-3 text-xl font-semibold text-white">
              Search results
            </Text>
            {filteredResults.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerClassName="pr-3"
              >
                {filteredResults.map((item) => (
                  <Pressable
                    key={item.id}
                    className="mr-3 w-36 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-3"
                  >
                    <Image
                      source={{ uri: item.image }}
                      className="h-24 w-full rounded-xl"
                      resizeMode="cover"
                    />
                    <Text className="mt-3 text-sm font-semibold text-white">
                      {item.title}
                    </Text>
                    <Text className="text-xs text-white/65">
                      {item.subtitle}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            ) : (
              <Text className="text-sm text-white/60">No results found.</Text>
            )}
          </View>
        )}

        {!isTypingOnly && !isSearchMode && (
          <>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="pr-3"
            >
              {QUICK_FILTERS.map((filter) => (
                <Pressable
                  key={filter.id}
                  className="mr-3 rounded-full border border-white/20 bg-white/5 px-4 py-2"
                >
                  <Text className="text-xs font-semibold text-white/90">
                    {filter.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            <View className="mt-9">
              <View className="mb-3 flex-row items-center justify-between">
                <Text className="text-xl font-semibold text-white">
                  Recent searches
                </Text>
                <Text className="text-xs font-medium text-white/60">
                  Clear all
                </Text>
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
                      resizeMode="cover"
                    />
                    <View className="ml-3">
                      <Text className="text-sm font-semibold text-white">
                        {item.title}
                      </Text>
                      <Text className="text-xs text-white/65">
                        {item.subtitle}
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="close" size={16} color="#FFFFFF99" />
                </Pressable>
              ))}
            </View>

            <View className="mt-7">
              <Text className="mb-3 text-xl font-semibold text-white">
                Browse all
              </Text>
              <View className="flex-row flex-wrap justify-between">
                {BROWSE_TILES.map((tile) => (
                  <Pressable
                    key={tile.id}
                    className="mb-3 h-22 w-[48.5%] overflow-hidden rounded-xl"
                  >
                    <LinearGradient
                      colors={tile.colors}
                      className="h-full w-full flex-1 p-3"
                    >
                      <Text className="h-full p-3 text-base font-bold text-white">
                        {tile.name}
                      </Text>
                      <Image
                        source={{ uri: tile.image }}
                        className="absolute -right-3 -bottom-2 h-18 w-18 rotate-20 rounded-md"
                        resizeMode="cover"
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
