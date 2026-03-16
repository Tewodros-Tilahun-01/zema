import { RecentSearch } from '@/db/schema';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeOut, LinearTransition } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type RecentSearchItemProps = {
  item: RecentSearch;
  index: number;
  onPress: (item: RecentSearch) => void;
  onRemove: (id: number) => void;
};

export function RecentSearchItem({ item, index, onPress, onRemove }: RecentSearchItemProps) {
  return (
    <AnimatedPressable
      entering={FadeInDown.delay(index * 50).springify()}
      exiting={FadeOut.duration(200)}
      layout={LinearTransition.springify().duration(300)}
      onPress={() => onPress(item)}
    >
      <View className="mb-3 flex-row items-center justify-between rounded-xl bg-white/5 px-4 py-3">
        <View className="flex-1 flex-row items-center">
          <Ionicons name="time-outline" size={20} color="#8E8E93" />
          <View className="ml-3 flex-1">
            <Text className="text-sm font-medium text-white">{item.query}</Text>
            <Text className="text-xs text-white/65 capitalize">{item.searchMode}</Text>
          </View>
        </View>
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            onRemove(item.id);
          }}
          hitSlop={8}
        >
          <Ionicons name="close" size={18} color="#8E8E93" />
        </Pressable>
      </View>
    </AnimatedPressable>
  );
}
