import { Image, Text, View } from 'react-native';

export type ProfileCardItem = {
  id: string;
  name: string;
  time: string;
  image: string;
};

type ProfileCardProps = {
  item: ProfileCardItem;
};

export default function ProfileCard({ item }: ProfileCardProps) {
  return (
    <View className="items-center">
      <View className="flex h-24 w-24 items-center justify-center rounded-full bg-white/60 p-0.5">
        <Image
          source={{ uri: item.image }}
          className="h-full w-full rounded-full border border-white/10"
        />
      </View>

      <Text className="mt-2 text-xs text-white">{item.name}</Text>
      <Text className="text-[10px] text-white/50">{item.time}</Text>
    </View>
  );
}
