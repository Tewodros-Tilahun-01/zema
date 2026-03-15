import { Pressable, ScrollView, Text } from 'react-native';

type QuickFilter = {
  id: string;
  label: string;
};

type QuickFiltersProps = {
  filters: QuickFilter[];
  onFilterPress?: (filterId: string) => void;
};

export function QuickFilters({ filters, onFilterPress }: QuickFiltersProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="pr-3">
      {filters.map((filter) => (
        <Pressable
          key={filter.id}
          className="mr-3 rounded-full border border-white/20 bg-white/5 px-4 py-2"
          onPress={() => onFilterPress?.(filter.id)}
        >
          <Text className="text-xs font-semibold text-white/90">{filter.label}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
