import HorizontalSlider from '@/components/common/HorizontalSlider';
import ProfileCard from '@/components/common/ProfileCard';
import { ProfileCardItem } from '@/types/components';
import { Text, View } from 'react-native';

type TopTracksProps = {
  data: ProfileCardItem[];
};

export default function TopTracks({ data }: TopTracksProps) {
  return (
    <View className="py-4 pl-1">
      <View className="mb-6 flex-row items-center justify-between">
        <Text className="text-2xl font-semibold text-white">top track</Text>
      </View>
      <HorizontalSlider
        data={data}
        className="mt-4"
        keyExtractor={(item) => item.id}
        renderItem={(item) => <ProfileCard item={item} />}
        itemSeparatorWidth={16}
      />
    </View>
  );
}
