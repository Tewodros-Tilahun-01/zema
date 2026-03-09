import RecentPlayed from '@/components/home/RecentPlayed';
import TopTracks from '@/components/home/TopTracks';
import TrendingPlaylists from '@/components/home/TrendingPlaylists';
import { useTrendingPlaylists } from '@/hooks/useTrendingPlaylists';
import { ProfileCardItem, RecommendedArtistItem } from '@/types/components';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const RECENT: ProfileCardItem[] = [
  {
    id: 'r1',
    name: 'Mr Ryval',
    songTitle: 'Mariya Maria',
    image:
      'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'r2',
    name: 'Nedriest',
    songTitle: 'Afterglow',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'r3',
    name: 'Rolette',
    songTitle: 'Moonline',
    image:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'r4',
    name: 'Moza',
    songTitle: 'Velvet Tide',
    image:
      'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'r5',
    name: 'Luna Sky',
    songTitle: 'Static Hearts',
    image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'r6',
    name: 'Echo Wave',
    songTitle: 'Neon Dust',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'r7',
    name: 'Stellar',
    songTitle: 'Blue Arcade',
    image:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'r8',
    name: 'Nova',
    songTitle: 'Crystal Rain',
    image:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
  },
];

export const RECOMMENDED: RecommendedArtistItem[] = [
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
    id: 'a4',
    name: 'River Stone',
    tag: 'Chillwave',
    image:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'a5',
    name: 'Iris Moon',
    tag: 'Synthpop',
    image:
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'a6',
    name: 'Atlas Grey',
    tag: 'Lo-fi Hip Hop',
    image:
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
  },
];

export default function HomeScreen() {
  const { data: trendingPlaylists, isLoading, isError } = useTrendingPlaylists();

  return (
    <View className="flex-1 bg-[#0B0E14]">
      <SafeAreaView />

      <ScrollView
        className="flex-1 gap-1"
        contentContainerClassName="px-5 pb-12"
        showsVerticalScrollIndicator={false}
      >
        <View className="mt-2">
          {isLoading ? (
            <View className="h-48 items-center justify-center">
              <ActivityIndicator size="large" color="#E8E9F1" />
            </View>
          ) : (
            <TrendingPlaylists data={trendingPlaylists || []} />
          )}
        </View>

        <View className="mt-8">
          <TopTracks data={RECENT} />
        </View>

        <View className="mt-8">
          <RecentPlayed data={RECOMMENDED} />
        </View>
      </ScrollView>
    </View>
  );
}
