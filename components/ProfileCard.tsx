import { Image, Text, View } from 'react-native';

export type ProfileCardItem = {
  id: string;
  name: string;
  songTitle: string;
  image: string;
};

type ProfileCardProps = {
  item: ProfileCardItem;
};

export default function ProfileCard({ item }: ProfileCardProps) {
  return (
    <View className="items-left">
      <View className="flex h-42 w-42 overflow-hidden rounded-lg border border-white/10">
        <Image
          source={{ uri: item.image }}
          className="h-full w-full"
          resizeMode="cover"
        />
      </View>

      <Text className="mt-2 text-lg text-white capitalize">
        {item.songTitle}
      </Text>
      <Text className="text-xs text-white/60">{item.name}</Text>
    </View>
  );
}
