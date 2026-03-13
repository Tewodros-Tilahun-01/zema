import TrackCardSkeleton from '@/components/common/TrackCardSkeleton';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function TopTracksSkeleton() {
  return (
    <View className="py-3 pl-1">
      <View className="mb-6 flex-row items-center justify-between">
        <Text className="text-2xl font-semibold text-white">Top track</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <TrackCardSkeleton key={index} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingRight: 20,
  },
});
