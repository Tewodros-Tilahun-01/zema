import MusicCardSkeleton from '@/components/common/MusicCardSkeleton';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function TrendingPlaylistsSkeleton() {
  return (
    <View>
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-2xl font-semibold text-white">Trending playlists</Text>
        <View className="flex-row items-center gap-3"></View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        className="mt-5"
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <MusicCardSkeleton key={index} />
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
