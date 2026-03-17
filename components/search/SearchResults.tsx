import { Image } from 'expo-image';
import { Pressable, ScrollView, Text } from 'react-native';

type SearchItem = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
};

type SearchResultsProps = {
  results: SearchItem[];
  onItemPress?: (item: SearchItem) => void;
};

export function SearchResults({ results, onItemPress }: SearchResultsProps) {
  if (results.length === 0) {
    return <Text className="text-sm text-white/60">No results found.</Text>;
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="pr-3">
      {results.map((item) => (
        <Pressable
          key={item.id}
          className="mr-3 w-36 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-3"
          onPress={() => onItemPress?.(item)}
        >
          <Image
            source={{ uri: item.image }}
            className="h-24 w-full rounded-xl"
            contentFit="cover"
          />
          <Text className="mt-3 text-sm font-semibold text-white">{item.title}</Text>
          <Text className="text-xs text-white/65">{item.subtitle}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
