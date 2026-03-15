import { LinearGradient } from 'expo-linear-gradient';
import { Image, Pressable, Text, View } from 'react-native';

type GenreTile = {
  id: string;
  name: string;
  image: string;
  colors: [string, string];
};

type BrowseTilesProps = {
  tiles: GenreTile[];
  onTilePress?: (tile: GenreTile) => void;
};

export function BrowseTiles({ tiles, onTilePress }: BrowseTilesProps) {
  return (
    <View className="mt-7">
      <Text className="mb-3 text-xl font-semibold text-white">Browse all</Text>
      <View className="flex-row flex-wrap justify-between">
        {tiles.map((tile) => (
          <Pressable
            key={tile.id}
            className="mb-3 h-22 w-[48.5%] overflow-hidden rounded-xl"
            onPress={() => onTilePress?.(tile)}
          >
            <LinearGradient colors={tile.colors} className="h-full w-full flex-1 p-3">
              <Text className="h-full p-3 text-base font-bold text-white">{tile.name}</Text>
              <Image
                source={{ uri: tile.image }}
                className="absolute -right-3 -bottom-2 h-18 w-18 rotate-20 rounded-md"
                resizeMode="cover"
              />
            </LinearGradient>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
