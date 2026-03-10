import { ProfileCardItem } from '@/types/components';
import { Image, Text, View } from 'react-native';

type ProfileCardProps = {
  item: ProfileCardItem;
};

export default function ProfileCard({ item }: ProfileCardProps) {
  return (
    <View className="items-left w-42 overflow-hidden">
      <View className="flex h-42 w-42 overflow-hidden rounded-lg border border-white/10">
        <Image source={{ uri: item.image }} className="h-full w-full" resizeMode="cover" />
      </View>

      <Text className="mt-2 text-lg font-medium text-white" numberOfLines={1}>
        {item.songTitle}
      </Text>
      <Text className="text-xs text-white/60" numberOfLines={1}>
        {item.name}
      </Text>
    </View>
  );
}
