import Entypo from '@expo/vector-icons/Entypo';
import { Image, Text, View } from 'react-native';

export type RecommendedArtistItem = {
  id: string;
  name: string;
  tag: string;
  image: string;
};

type RecommendedArtistCardProps = {
  item: RecommendedArtistItem;
};

export default function RecommendedArtistCard({
  item,
}: RecommendedArtistCardProps) {
  return (
    <View className="flex-row items-center justify-between py-2 pr-3">
      <View className="flex-row items-center">
        <Image source={{ uri: item.image }} className="h-16 w-16" />
        <View className="ml-3">
          <Text className="text-sm font-semibold text-white">{item.name}</Text>
          <Text className="text-[11px] text-white/60">{item.tag}</Text>
        </View>
      </View>
      <View className="items-center justify-center">
        <Entypo name="dots-three-vertical" size={20} color="#ffffff99" />
      </View>
    </View>
  );
}
