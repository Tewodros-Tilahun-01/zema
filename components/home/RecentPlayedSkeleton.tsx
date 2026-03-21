import { Text, View } from 'react-native';

export default function RecentPlayedSkeleton() {
  return (
    <View className="px-1">
      <Text className="text-2xl font-semibold text-white">recent played</Text>
      <Text className="mt-1 text-xs text-white/60">Based on your recent listens</Text>
      <View className="mt-4 gap-2">
        {[1, 2, 3].map((i) => (
          <View key={i} className="flex-row items-center bg-[#121212] py-2">
            <View className="h-14 w-14 animate-pulse rounded-lg bg-white/10" />
            <View className="ml-3 flex-1">
              <View className="mb-2 h-4 w-3/4 animate-pulse rounded bg-white/10" />
              <View className="h-3 w-1/2 animate-pulse rounded bg-white/10" />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
