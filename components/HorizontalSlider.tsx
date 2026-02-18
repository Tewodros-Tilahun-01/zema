import { ReactElement } from 'react';
import { FlatList, View } from 'react-native';

type HorizontalSliderProps<T> = {
  data: T[];
  keyExtractor: (item: T, index: number) => string;
  renderItem: (item: T, index: number) => ReactElement | null;
  itemSeparatorWidth?: number;
  className?: string;
};

export default function HorizontalSlider<T>({
  data,
  keyExtractor,
  renderItem,
  itemSeparatorWidth = 12,
  className = '',
}: HorizontalSliderProps<T>) {
  return (
    <FlatList
      data={data}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={keyExtractor}
      className={className}
      renderItem={({ item, index }) => renderItem(item, index)}
      ItemSeparatorComponent={() => (
        <View style={{ width: itemSeparatorWidth }} />
      )}
      ListFooterComponent={<View className="w-1" />}
    />
  );
}
