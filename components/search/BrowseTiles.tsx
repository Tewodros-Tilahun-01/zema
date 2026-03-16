import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text, View } from 'react-native';

type BrowseTile = {
  id: string;
  name: string;
  image: string;
  colors: [string, string];
};

const TILES: BrowseTile[] = [
  {
    id: 'g1',
    name: 'Pop',
    image:
      'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=200&q=80',
    colors: ['#FA4454', '#C71738'],
  },
  {
    id: 'g2',
    name: 'Hip-Hop',
    image:
      'https://images.unsplash.com/photo-1516280030429-27679b3dc9cf?auto=format&fit=crop&w=200&q=80',
    colors: ['#5E5CE6', '#3532A7'],
  },
  {
    id: 'g3',
    name: 'Electronic',
    image:
      'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?auto=format&fit=crop&w=200&q=80',
    colors: ['#F59E0B', '#B45309'],
  },
  {
    id: 'g4',
    name: 'Afrobeats',
    image:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=200&q=80',
    colors: ['#14B8A6', '#0F766E'],
  },
  {
    id: 'g5',
    name: 'R&B',
    image:
      'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&w=200&q=80',
    colors: ['#EC4899', '#A21CAF'],
  },
  {
    id: 'g6',
    name: 'Workout',
    image:
      'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=200&q=80',
    colors: ['#22C55E', '#15803D'],
  },
];

type BrowseTilesProps = {
  onTilePress: (name: string) => void;
};

export function BrowseTiles({ onTilePress }: BrowseTilesProps) {
  return (
    <View className="mt-7">
      <Text className="mb-3 text-xl font-semibold text-white">Browse all</Text>
      <View className="flex-row flex-wrap justify-between">
        {TILES.map((tile) => (
          <Pressable
            key={tile.id}
            className="mb-3 h-22 w-[48.5%] overflow-hidden rounded-xl"
            onPress={() => onTilePress(tile.name)}
          >
            <LinearGradient colors={tile.colors} className="h-full w-full flex-1 p-3">
              <Text className="h-full p-3 text-base font-bold text-white">{tile.name}</Text>
              <Image
                source={{ uri: tile.image }}
                className="absolute -right-3 -bottom-2 h-18 w-18 rotate-20 rounded-md"
                contentFit="cover"
              />
            </LinearGradient>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
