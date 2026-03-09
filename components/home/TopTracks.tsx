import HorizontalSlider from '@/components/common/HorizontalSlider';
import ProfileCard from '@/components/common/ProfileCard';
import { Track } from '@/types/deezer';
import { Text, View } from 'react-native';

type TopTracksProps = {
  data: Track[];
};

export default function TopTracks({ data }: TopTracksProps) {
  return (
    <View className="py-4 pl-1">
      <View className="mb-6 flex-row items-center justify-between">
        <Text className="text-2xl font-semibold text-white">Top track</Text>
      </View>
      <HorizontalSlider
        data={data}
        className="mt-4"
        keyExtractor={(item) => item.id.toString()}
        renderItem={(item) => (
          <ProfileCard
            item={{
              id: item.id.toString(),
              name: item.artist.name,
              songTitle: item.title,
              image: item.album.cover_medium,
            }}
          />
        )}
        itemSeparatorWidth={16}
      />
    </View>
  );
}
