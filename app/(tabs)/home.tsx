import RecentPlayed from '@/components/home/RecentPlayed';
import TopTracks from '@/components/home/TopTracks';
import TopTracksSkeleton from '@/components/home/TopTracksSkeleton';
import TrendingPlaylists from '@/components/home/TrendingPlaylists';
import TrendingPlaylistsSkeleton from '@/components/home/TrendingPlaylistsSkeleton';
import { useTopTracks } from '@/hooks/useTopTracks';
import { useTrendingPlaylists } from '@/hooks/useTrendingPlaylists';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
          <RecentPlayed />
        </View>
      </ScrollView>
    </View>
  );
}
