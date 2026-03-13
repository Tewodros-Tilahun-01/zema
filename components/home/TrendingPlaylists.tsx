import HorizontalSlider from '@/components/common/HorizontalSlider';
import PlaylistCard from '@/components/common/PlaylistCard';
import { DeezerPlaylist } from '@/types/deezer';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type TrendingPlaylistsProps = {
  data: DeezerPlaylist[];
};

export default function TrendingPlaylists({ data }: TrendingPlaylistsProps) {
  const router = useRouter();
  const [isPressed, setIsPressed] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handlePlaylistPress = (playlistId: number) => {
    if (isPressed) return;

    setIsPressed(true);
    // Use replace to replace any existing playlist in the stack
    router.replace(`/(tabs)/playlist/${playlistId}` as any);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsPressed(false);
    }, 1000);
  };

  return (
    <View>
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-2xl font-semibold text-white">Trending playlists</Text>
        <View className="flex-row items-center gap-3"></View>
      </View>

      <HorizontalSlider
        data={data}
        className="mt-2"
        keyExtractor={(item) => item.id.toString()}
        renderItem={(item, index) => (
          <TouchableOpacity onPress={() => handlePlaylistPress(item.id)}>
            <PlaylistCard
              item={{
                id: item.id.toString(),
                title: item.title,
                subtitle: `${item.nb_tracks} tracks`,
                image: item.picture_medium,
              }}
              index={index}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
