import Entypo from '@expo/vector-icons/Entypo';
import { Image, Text, TouchableOpacity, View } from 'react-native';

export type RecommendedArtistItem = {
  id: string;
  name: string;
  tag: string;
  image: string;
};

type RecommendedArtistCardProps = {
  item: RecommendedArtistItem;
  onPress?: () => void;
};

export default function RecommendedArtistCard({ item, onPress }: RecommendedArtistCardProps) {
  return (
    <TouchableOpacity className="flex-row items-center justify-between py-2 pr-3" onPress={onPress}>
      <View className="flex-1 flex-row items-center">
        <Image source={{ uri: item.image }} className="h-16 w-16 rounded-lg" />
        <View className="ml-3 flex-1">
          <Text className="text-sm font-semibold text-white" numberOfLines={1}>
            {item.name}
          </Text>
          <Text className="text-[11px] text-white/60" numberOfLines={1}>
            {item.tag}
          </Text>
        </View>
      </View>
      <View className="ml-2 items-center justify-center">
        <Entypo name="dots-three-vertical" size={20} color="#ffffff99" />
      </View>
    </TouchableOpacity>
  );
}
