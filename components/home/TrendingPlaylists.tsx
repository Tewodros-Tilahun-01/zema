import HorizontalSlider from '@/components/common/HorizontalSlider';
import MusicCard from '@/components/common/MusicCard';
import { DeezerPlaylist } from '@/types/deezer';
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

type TrendingPlaylistsProps = {
  data: DeezerPlaylist[];
};

export default function TrendingPlaylists({ data }: TrendingPlaylistsProps) {
  return (
    <View>
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-2xl font-semibold text-white">Trending playlists</Text>
        <View className="flex-row items-center gap-3">
          <View className="h-9 w-9 items-center justify-center rounded-full bg-white/10">
            <Ionicons name="search" size={18} color="#E8E9F1" />
          </View>
        </View>
      </View>

      <HorizontalSlider
        data={data}
        className="mt-5"
        keyExtractor={(item) => item.id.toString()}
        renderItem={(item, index) => (
          <MusicCard
            item={{
              id: item.id.toString(),
              title: item.title,
              subtitle: `${item.nb_tracks} tracks`,
              image: item.picture_medium,
            }}
            index={index}
          />
        )}
      />
    </View>
  );
}
