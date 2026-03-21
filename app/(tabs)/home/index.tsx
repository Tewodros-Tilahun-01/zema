import RecentPlayed from '@/components/home/RecentPlayed';
import RecentPlayedSkeleton from '@/components/home/RecentPlayedSkeleton';
import TopTracks from '@/components/home/TopTracks';
import TopTracksSkeleton from '@/components/home/TopTracksSkeleton';
import TrendingPlaylists from '@/components/home/TrendingPlaylists';
import TrendingPlaylistsSkeleton from '@/components/home/TrendingPlaylistsSkeleton';
import { useRecentlyPlayed } from '@/hooks/useRecentlyPlayed';
import { useTopTracks } from '@/hooks/useTopTracks';
import { useTrendingPlaylists } from '@/hooks/useTrendingPlaylists';
import { useState } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const {
    data: trendingPlaylists,
    isLoading: isLoadingPlaylists,
    refetch: refetchPlaylists,
  } = useTrendingPlaylists();
  const { data: topTracks, isLoading: isLoadingTracks, refetch: refetchTracks } = useTopTracks();
  const { tracks, isLoading: isLoadingRecent, refetch: refetchRecent } = useRecentlyPlayed();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.allSettled([refetchPlaylists(), refetchTracks(), refetchRecent()]);
    setRefreshing(false);
  };

  return (
    <View className="flex-1 bg-[#121212]">
      <SafeAreaView />

      <ScrollView
        className="flex-1 gap-1"
        contentContainerClassName="px-5 pb-12"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#000000"
            titleColor="#FFFFFF"
            progressBackgroundColor="#000000"
            colors={['#FFFFFF']}
          />
        }
      >
        <View className="mt-2">
          {isLoadingPlaylists || !trendingPlaylists ? (
            <TrendingPlaylistsSkeleton />
          ) : (
            <TrendingPlaylists data={trendingPlaylists || []} />
          )}
        </View>

        <View className="mt-8">
          {isLoadingTracks || !topTracks ? (
            <TopTracksSkeleton />
          ) : (
            <TopTracks data={topTracks || []} />
          )}
        </View>

        <View className="mt-8">
          {isLoadingRecent ? (
            <RecentPlayedSkeleton />
          ) : (
            <RecentPlayed tracks={tracks || []} onRefresh={refetchRecent} />
          )}
        </View>
      </ScrollView>
    </View>
  );
}
