import { Collection } from '@/db/schema';
import { Ionicons } from '@expo/vector-icons';

import { Image, Pressable, Text, View } from 'react-native';

type CollectionCardProps = {
  collection: Collection & { trackCount: number; coverUrl: string | null };
  onPress: () => void;
};

export default function CollectionCard({ collection, onPress }: CollectionCardProps) {
  const isFavorites = collection.systemType === 'favorites';

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center rounded-2xl bg-white/5 p-4 active:bg-white/10"
    >
      {/* Cover Image */}
      <View className="relative">
        {collection.coverUrl && !isFavorites ? (
          <Image source={{ uri: collection.coverUrl }} className="h-16 w-16 rounded-xl" />
        ) : (
          <View className="h-16 w-16 items-center justify-center rounded-xl bg-white/10">
            <Ionicons
              name={isFavorites ? 'heart' : 'musical-notes'}
              size={28}
              color={isFavorites ? '#FF3B30' : '#FFFFFF'}
            />
          </View>
        )}
      </View>

      {/* Collection Info */}
      <View className="ml-4 flex-1">
        <Text className="text-base font-semibold text-white" numberOfLines={1}>
          {collection.name}
        </Text>
        <Text className="mt-1 text-sm text-white/60">
          {collection.trackCount} {collection.trackCount === 1 ? 'track' : 'tracks'}
        </Text>
      </View>

      {/* Arrow */}
      <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.4)" />
    </Pressable>
  );
}
