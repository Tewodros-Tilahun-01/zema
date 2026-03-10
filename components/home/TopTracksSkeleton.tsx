import ProfileCardSkeleton from '@/components/common/ProfileCardSkeleton';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function TopTracksSkeleton() {
  return (
    <View className="py-4 pl-1">
      <View className="mb-6 flex-row items-center justify-between">
        <Text className="text-2xl font-semibold text-white">Top track</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        className="mt-4"
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <ProfileCardSkeleton key={index} />
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
