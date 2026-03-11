import RecommendedArtistCard from '@/components/common/RecommendedArtistCard';
import { RecommendedArtistItem } from '@/types/components';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

type RecentPlayedProps = {
  data: RecommendedArtistItem[];
};

export default function RecentPlayed({ data }: RecentPlayedProps) {
  const router = useRouter();

  return (
    <View className="px-1">
      <View className="flex-row items-center justify-between">
        <Text className="text-2xl font-semibold text-white">recent played</Text>
        <View className="h-7 w-10 items-center justify-center rounded-full bg-white/10">
          <Ionicons name="options" size={14} color="#E8E9F1" />
        </View>
      </View>
      <Text className="mt-1 text-xs text-white/60">Based on your recent listens</Text>
      <View className="mt-4 gap-2">
        {data.map((artist) => (
          <RecommendedArtistCard key={artist.id} item={artist} />
        ))}
      </View>
    </View>
  );
}
