import Button from '@/components/common/Button';
import HorizontalSlider from '@/components/common/HorizontalSlider';
import TrackCard from '@/components/common/TrackCard';
import { useTrackPlayer } from '@/hooks/useTrackPlayer';
import { Track } from '@/types/deezer';
import { Text, View } from 'react-native';

type TopTracksProps = {
  data: Track[];
};

export default function TopTracks({ data }: TopTracksProps) {
  const { handleTrackPress } = useTrackPlayer();

  return (
    <View className="py-3 pl-1">
      <View className="mb-6 flex-row items-center justify-between">
        <Text className="text-2xl font-semibold text-white">Top track</Text>
      </View>
      <HorizontalSlider
        data={data}
        className="mt-4"
        keyExtractor={(item) => item.id.toString()}
        renderItem={(item) => (
          <Button onPress={() => handleTrackPress(item)}>
            <TrackCard
              item={{
                id: item.id.toString(),
                name: item.artist.name,
                songTitle: item.title,
                image: item.album.cover_medium,
              }}
            />
          </Button>
        )}
        itemSeparatorWidth={16}
      />
    </View>
  );
}
