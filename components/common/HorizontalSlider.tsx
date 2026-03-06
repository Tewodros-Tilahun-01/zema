import { memo, ReactElement, useCallback, useMemo } from 'react';
import { FlatList, View } from 'react-native';

type HorizontalSliderProps<T> = {
  data: T[];
  keyExtractor: (item: T, index: number) => string;
  renderItem: (item: T, index: number) => ReactElement | null;
  itemSeparatorWidth?: number;
  className?: string;
};

function HorizontalSliderComponent<T>({
  data,
  keyExtractor,
  renderItem,
  itemSeparatorWidth = 12,
  className = '',
}: HorizontalSliderProps<T>) {
  const ItemSeparator = useCallback(
    () => <View style={{ width: itemSeparatorWidth }} />,
    [itemSeparatorWidth],
  );

  const ListFooter = useMemo(() => <View className="w-1" />, []);

  const renderItemWrapper = useCallback(
    ({ item, index }: { item: T; index: number }) => renderItem(item, index),
    [renderItem],
  );

  return (
    <FlatList
      data={data}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={keyExtractor}
      className={className}
      renderItem={renderItemWrapper}
      ItemSeparatorComponent={ItemSeparator}
      ListFooterComponent={ListFooter}
    />
  );
}

export default memo(HorizontalSliderComponent) as typeof HorizontalSliderComponent;
