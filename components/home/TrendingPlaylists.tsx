import HorizontalSlider from '@/components/common/HorizontalSlider';
import MusicCard from '@/components/common/MusicCard';
import { DeezerPlaylist } from '@/types/deezer';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

type TrendingPlaylistsProps = {
  data: DeezerPlaylist[];
};

export default function TrendingPlaylists({ data }: TrendingPlaylistsProps) {
  const router = useRouter();

  const handlePlaylistPress = (playlistId: number) => {
    router.push(`/(screen)/playlist/${playlistId}` as any);
  };

  return (
    <View>
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-2xl font-semibold text-white">Trending playlists</Text>
        <View className="flex-row items-center gap-3"></View>
      </View>

      <HorizontalSlider
        data={data}
        className="mt-5"
        keyExtractor={(item) => item.id.toString()}
        renderItem={(item, index) => (
          <Pressable onPress={() => handlePlaylistPress(item.id)}>
            <MusicCard
              item={{
                id: item.id.toString(),
                title: item.title,
                subtitle: `${item.nb_tracks} tracks`,
                image: item.picture_medium,
              }}
              index={index}
            />
          </Pressable>
        )}
      />
    </View>
  );
}
