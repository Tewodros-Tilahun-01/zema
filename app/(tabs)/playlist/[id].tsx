import Button from '@/components/common/Button';
import PlaylistHeader, { HEADER_HEIGHT } from '@/components/playlist/PlaylistHeader';
import PlaylistInfo from '@/components/playlist/PlaylistInfo';
import PlaylistStickyHeader from '@/components/playlist/PlaylistStickyHeader';
import PlaylistTrackItem from '@/components/playlist/PlaylistTrackItem';
import { usePlaylist } from '@/hooks/usePlaylist';
import { usePlaylistTracks } from '@/hooks/usePlaylistTracks';
import { useTrackPlayer } from '@/hooks/useTrackPlayer';
import { Track } from '@/types/deezer';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

export default function PlaylistScreen() {
  const { id, from } = useLocalSearchParams<{ id: string; from?: string }>();
  const router = useRouter();
  const navigation = useNavigation();
  const { handleTrackPress } = useTrackPlayer();

  // Determine where to navigate back to
  const backRoute = from === 'search' ? '/(tabs)/search' : '/(tabs)/home';
  console.log('hy', from);

  // Intercept back gesture and hardware back button
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      // Prevent default behavior
      e.preventDefault();

      // Navigate to the appropriate tab
      router.push(backRoute);
    });

    return unsubscribe;
  }, [navigation, router, backRoute]);

  const handleBackPress = () => {
    // Navigate to the appropriate tab
    router.push(backRoute);
  };

  // Reset scrollY when id changes
  const scrollY = useSharedValue(0);

  // Reset scrollY when navigating back or id changes
  useEffect(() => {
    scrollY.value = 0;
  }, [id]);

  const { data: playlist, isLoading: isLoadingPlaylist, error } = usePlaylist(id as string);

  const {
    data: tracksData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePlaylistTracks(id as string);

  const tracks = useMemo(() => {
    return tracksData?.pages.flatMap((page) => page.data) ?? [];
  }, [tracksData]);

  const renderTrackItem = useCallback(
    ({ item }: { item: Track }) => <PlaylistTrackItem track={item} onPress={handleTrackPress} />,
    [handleTrackPress],
  );

  const renderHeader = useCallback(() => {
    if (!playlist) return null;
    return <PlaylistInfo playlist={playlist} />;
  }, [playlist]);

  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#FFFFFF" />
      </View>
    );
  }, [isFetchingNextPage]);

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  // Optimize FlatList performance with getItemLayout
  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: 72, // trackItem height (56px image + 16px padding)
      offset: 72 * index,
      index,
    }),
    [],
  );

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerOpacity = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [HEADER_HEIGHT - 100, HEADER_HEIGHT],
      [0, 1],
      Extrapolation.CLAMP,
    );
    return { opacity };
  });

  const flatListAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [HEADER_HEIGHT - 50, HEADER_HEIGHT],
      [0, 1],
      Extrapolation.CLAMP,
    );
    return {
      backgroundColor: `rgba(11, 14, 20, ${opacity})`,
    };
  });

  if (isLoadingPlaylist) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  if (error || !playlist) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {error ? 'Failed to load playlist' : 'Playlist not found'}
        </Text>
        <Button style={styles.errorBackButton} onPress={handleBackPress}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.parallaxHeader}>
        <PlaylistHeader playlist={playlist} />
      </View>

      <View style={styles.topSafeArea}>
        <Button onPress={handleBackPress} style={styles.backButtonFixed}>
          <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
        </Button>
      </View>

      <PlaylistStickyHeader title={playlist.title} animatedStyle={headerOpacity} />

      <View>
        <Animated.FlatList
          key={id}
          data={tracks}
          renderItem={renderTrackItem}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          getItemLayout={getItemLayout}
          maxToRenderPerBatch={20}
          removeClippedSubviews={true}
          contentContainerStyle={[styles.listContent, { paddingTop: HEADER_HEIGHT }]}
          showsVerticalScrollIndicator={false}
          style={[styles.flatList, flatListAnimatedStyle]}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0E14',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0B0E14',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#0B0E14',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 20,
  },
  errorBackButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#1C1C1E',
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 80,
  },
  flatList: {
    zIndex: 1,
  },
  topSafeArea: {
    position: 'absolute',
    top: 25,
    left: 0,
    zIndex: 11,
  },
  backButtonFixed: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
    marginTop: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    opacity: 0.4,
  },
  parallaxHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    zIndex: 0,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});
