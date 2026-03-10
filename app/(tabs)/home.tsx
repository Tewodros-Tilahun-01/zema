import RecentPlayed from '@/components/home/RecentPlayed';
import TopTracks from '@/components/home/TopTracks';
import TopTracksSkeleton from '@/components/home/TopTracksSkeleton';
import TrendingPlaylists from '@/components/home/TrendingPlaylists';
import TrendingPlaylistsSkeleton from '@/components/home/TrendingPlaylistsSkeleton';
import { useTopTracks } from '@/hooks/useTopTracks';
import { useTrendingPlaylists } from '@/hooks/useTrendingPlaylists';
import { RecommendedArtistItem } from '@/types/components';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  const { data: trendingPlaylists, isLoading: isLoadingPlaylists } = useTrendingPlaylists();
  const { data: topTracks, isLoading: isLoadingTracks } = useTopTracks();

  return (
    <View className="flex-1 bg-[#0B0E14]">
      <SafeAreaView />

      <ScrollView
        className="flex-1 gap-1"
        contentContainerClassName="px-5 pb-12"
        showsVerticalScrollIndicator={false}
      >
        <View className="mt-2">
          {isLoadingPlaylists ? (
            <TrendingPlaylistsSkeleton />
          ) : (
            <TrendingPlaylists data={trendingPlaylists || []} />
          )}
        </View>

        <View className="mt-8">
          {isLoadingTracks ? <TopTracksSkeleton /> : <TopTracks data={topTracks || []} />}
        </View>

        <View className="mt-8">
          <RecentPlayed data={RECOMMENDED} />
        </View>
      </ScrollView>
    </View>
  );
}
