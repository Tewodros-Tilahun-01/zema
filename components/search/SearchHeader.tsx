import { SearchMode } from '@/types/deezer';
import { Ionicons } from '@expo/vector-icons';
import { RefObject } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { SearchBar } from './SearchBar';
import { SearchModeButtons } from './SearchModeButtons';

type SearchHeaderProps = {
  isSearchActive: boolean;
  isGenreActive: boolean;
  selectedGenre: string | null;
  query: string;
  searchMode: SearchMode;
  inputRef: RefObject<TextInput | null>;
  onQueryChange: (text: string) => void;
  onClearQuery: () => void;
  onModeChange: (mode: SearchMode) => void;
  onBackFromGenre: () => void;
};

export function SearchHeader({
  isSearchActive,
  isGenreActive,
  selectedGenre,
  query,
  searchMode,
  inputRef,
  onQueryChange,
  onClearQuery,
  onModeChange,
  onBackFromGenre,
}: SearchHeaderProps) {
  return (
    <View className="px-5">
      {!isSearchActive && !isGenreActive && (
        <View className="mt-2 mb-5 flex-row items-center justify-between">
          <Text className="text-3xl font-bold text-white">Search</Text>
        </View>
      )}

      {isGenreActive && (
        <View className="mt-2 mb-5 flex-row items-center">
          <Pressable onPress={onBackFromGenre} className="mr-3">
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </Pressable>
          <Text className="flex-1 text-2xl font-bold text-white capitalize">{selectedGenre}</Text>
        </View>
      )}

      {!isGenreActive && (
        <>
          <SearchBar
            ref={inputRef}
            value={query}
            onChangeText={onQueryChange}
            onFocus={() => {}}
            onBlur={() => {}}
            onSubmitEditing={() => inputRef.current?.blur()}
            onClear={onClearQuery}
          />

          {isSearchActive && (
            <View>
              <SearchModeButtons selectedMode={searchMode} onModeChange={onModeChange} />
            </View>
          )}
        </>
      )}
    </View>
  );
}
