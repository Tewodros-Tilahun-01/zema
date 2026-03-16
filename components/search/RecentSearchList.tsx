import { RecentSearch } from '@/db/schema';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { RecentSearchItem } from './RecentSearchItem';

type RecentSearchListProps = {
  searches: RecentSearch[];
  onSearchPress: (search: RecentSearch) => void;
  onRemove: (id: number) => void;
  onClearAll: () => void;
};

export function RecentSearchList({
  searches,
  onSearchPress,
  onRemove,
  onClearAll,
}: RecentSearchListProps) {
  const [showAll, setShowAll] = useState(false);

  if (searches.length === 0) return null;

  const displayedSearches = showAll ? searches : searches.slice(0, 3);
  const hasMore = searches.length > 3;

  return (
    <View className="mt-4">
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="text-xl font-semibold text-white">Recent searches</Text>
        <Pressable onPress={onClearAll}>
          <Text className="text-xs font-medium text-white/60">Clear all</Text>
        </Pressable>
      </View>

      {displayedSearches.map((item, index) => (
        <RecentSearchItem
          key={item.id}
          item={item}
          index={index}
          onPress={onSearchPress}
          onRemove={onRemove}
        />
      ))}

      {hasMore && (
        <Pressable
          className="mx-auto mt-1 w-40 flex-row items-center justify-center rounded-xl bg-white/5 py-3"
          onPress={() => setShowAll(!showAll)}
        >
          <Text className="text-sm font-medium text-white/80">
            {showAll ? 'Show less' : `Show more (${searches.length - 3})`}
          </Text>
          <Ionicons
            name={showAll ? 'chevron-up' : 'chevron-down'}
            size={16}
            color="#FFFFFFCC"
            style={{ marginLeft: 4 }}
          />
        </Pressable>
      )}
    </View>
  );
}
