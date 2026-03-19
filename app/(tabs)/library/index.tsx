import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LibraryScreen() {
  return (
    <View className="flex-1 bg-[#0B0E14]">
      <SafeAreaView edges={['top']} />

      {/* Header */}
      <View className="px-5 pt-6 pb-4">
        <Text className="text-3xl font-bold text-white">Library</Text>
      </View>

      {/* Content */}
      <View className="flex-1 items-center justify-center">
        <Text className="text-xl font-semibold text-white">Library Content</Text>
      </View>
    </View>
  );
}
