import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';

type SearchItem = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
};

type RecentSearchesProps = {
  searches: SearchItem[];
  onItemPress?: (item: SearchItem) => void;
  onRemoveItem?: (itemId: string) => void;
  onClearAll?: () => void;
};

export function RecentSearches({
  searches,
  onItemPress,
  onRemoveItem,
  onClearAll,
}: RecentSearchesProps) {
  return (
    <View className="mt-9">
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="text-xl font-semibold text-white">Recent searches</Text>
        <Pressable onPress={onClearAll}>
          <Text className="text-xs font-medium text-white/60">Clear all</Text>
        </Pressable>
      </View>
      {searches.map((item) => (
        <Pressable
          key={item.id}
          className="mb-3 flex-row items-center justify-between rounded-xl bg-white/5 px-3 py-2"
          onPress={() => onItemPress?.(item)}
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
          <Pressable onPress={() => onRemoveItem?.(item.id)}>
            <Ionicons name="close" size={16} color="#FFFFFF99" />
          </Pressable>
        </Pressable>
      ))}
    </View>
  );
}
