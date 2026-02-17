import HorizontalSlider from '@/components/HorizontalSlider';
import MusicCard, { MusicCardItem } from '@/components/MusicCard';
import ProfileCard, { ProfileCardItem } from '@/components/ProfileCard';
import RecommendedArtistCard, {
  RecommendedArtistItem,
} from '@/components/RecommendedArtistCard';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TRENDING: MusicCardItem[] = [
  {
    id: 't1',
    title: 'Gloaming Drive',
    subtitle: '19k plays',
    image:
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 't2',
    title: 'Private Memory',
    subtitle: '12k plays',
    image:
      'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 't3',
    title: 'Late Night',
    subtitle: '8k plays',
    image:
      'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'tj1',
    title: 'Gloaming Drive',
    subtitle: '19k plays',
    image:
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'tj2',
    title: 'Private Memory',
    subtitle: '12k plays',
    image:
      'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'th3',
    title: 'Late Night',
    subtitle: '8k plays',
    image:
      'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=300&q=80',
  },
];

const RECENT: ProfileCardItem[] = [
  {
    id: 'r1',
    name: 'Mr Ryval',
    songTitle: 'mariya maria',
    image:
      'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'r3',
    name: 'Rolette',
    songTitle: 'Moonline',
    image:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'r2',
    name: 'Nedriest',
    songTitle: 'Afterglow',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  },

  {
    id: 'r4',
    name: 'Moza',
    songTitle: 'Velvet Tide',
    image:
      'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'r1h',
    name: 'Mr Ryval',
    songTitle: 'Moonline',
    image:
      'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'rh2',
    name: 'Nedriest',
    songTitle: 'Static Hearts',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'rh3',
    name: 'Rolette',
    songTitle: 'Neon Dust',
    image:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'rh4',
    name: 'Moza',
    songTitle: 'Blue Arcade',
    image:
      'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80',
  },
];

const RECOMMENDED: RecommendedArtistItem[] = [
  {
    id: 'a1',
    name: 'Ava Voz',
    tag: 'Dream pop',
    image:
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'a2',
    name: 'Juno Hall',
    tag: 'Indie soul',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'a3',
    name: 'Mako North',
    tag: 'Alt R&B',
    image:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'h',
    name: 'Ava Voz',
    tag: 'Dream pop',
    image:
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'j',
    name: 'Juno Hall',
    tag: 'Indie soul',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'd',
    name: 'Mako North',
    tag: 'Alt R&B',
    image:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#0B0E14]">
      <SafeAreaView />

      <ScrollView
        className="flex-1 gap-1"
        contentContainerClassName="px-5 pb-12"
        showsVerticalScrollIndicator={false}
      >
        <View className="mt-2 mb-4 flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-semibold text-white">
              Trending playlists
            </Text>
          </View>
          <View className="flex-row items-center gap-3">
            <View className="h-9 w-9 items-center justify-center rounded-full bg-white/10">
              <Ionicons name="search" size={18} color="#E8E9F1" />
            </View>
          </View>
        </View>

        <HorizontalSlider
          data={TRENDING}
          className="mt-5"
          keyExtractor={(item) => item.id}
          renderItem={(item, index) => <MusicCard item={item} index={index} />}
        />

        <View className="mt-8 py-4 pl-1">
          <View className="mb-6 flex-row items-center justify-between">
            <Text className="text-2xl font-semibold text-white">
              Recently played
            </Text>
          </View>
          <HorizontalSlider
            data={RECENT}
            className="mt-4"
            keyExtractor={(item) => item.id}
            renderItem={(item) => <ProfileCard item={item} />}
            itemSeparatorWidth={16}
          />
        </View>

        <View className="mt-8 px-1">
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-semibold text-white">
              Start Listening
            </Text>
            <View className="h-7 w-10 items-center justify-center rounded-full bg-white/10">
              <Ionicons name="options" size={14} color="#E8E9F1" />
            </View>
          </View>
          <Text className="mt-1 text-xs text-white/60">
            Based on your recent listens
          </Text>
          <View className="mt-4 gap-2">
            {RECOMMENDED.map((artist) => (
              <RecommendedArtistCard
                key={artist.id}
                item={artist}
                onPress={() => router.push('/(player)/now-playing')}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
