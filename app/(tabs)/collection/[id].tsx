import CollectionHeader, { HEADER_HEIGHT } from '@/components/collection/CollectionHeader';
import CollectionInfo from '@/components/collection/CollectionInfo';
import CollectionStickyHeader from '@/components/collection/CollectionStickyHeader';
import Button from '@/components/common/Button';
import TrackItem from '@/components/common/TrackItem';
import { getCollectionById, getCollectionTracks, removeTrackFromCollection } from '@/db/queries';
import { CollectionTrack } from '@/db/schema';
import { collectionTrackToTrack } from '@/utils/trackConverter';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

export default function CollectionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [collection, setCollection] = useState<any>(null);
  const [tracks, setTracks] = useState<CollectionTrack[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const scrollY = useSharedValue(0);

  useEffect(() => {
    scrollY.value = 0;
  }, [id]);

  const fetchData = useCallback(async () => {
    if (!id) return;

    const collectionData = await getCollectionById(Number(id));
    const tracksData = await getCollectionTracks(Number(id));

    setCollection(collectionData);
    setTracks(tracksData);
    setIsLoading(false);
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRemoveTrack = useCallback(
    async (trackId: number) => {
      if (!id) return;
      const success = await removeTrackFromCollection(Number(id), trackId);
      if (success) {
        await fetchData();
      }
    },
    [id, fetchData],
  );

  const handleBackPress = () => {
    router.back();
  };

  const coverUrl = useMemo(() => tracks[0]?.coverBig || null, [tracks]);

  const renderTrackItem = useCallback(
    ({ item }: { item: CollectionTrack }) => (
      <TrackItem
        track={collectionTrackToTrack(item)}
        showOptions={true}
        showRemove={true}
        onRemove={handleRemoveTrack}
        style={{ paddingHorizontal: 20 }}
      />
    ),
    [handleRemoveTrack],
  );

  const renderHeader = useCallback(() => {
    if (!collection) return null;
    return <CollectionInfo collection={collection} trackCount={tracks.length} />;
  }, [collection, tracks.length]);

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: 72,
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
      backgroundColor: `rgba(18, 18, 18, ${opacity})`,
    };
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  if (!collection) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Collection not found</Text>
        <Button style={styles.errorBackButton} onPress={handleBackPress}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </Button>
      </View>
    );
  }

  const isFavorites = collection.systemType === 'favorites';

  return (
    <View style={styles.container}>
      <View style={styles.parallaxHeader}>
        <CollectionHeader coverUrl={coverUrl} isFavorites={isFavorites} />
      </View>

      <View style={styles.topSafeArea}>
        <Button onPress={handleBackPress} style={styles.backButtonFixed}>
          <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
        </Button>
      </View>

      <CollectionStickyHeader title={collection.name} animatedStyle={headerOpacity} />

      <View>
        <Animated.FlatList
          key={id}
          data={tracks}
          renderItem={renderTrackItem}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={renderHeader}
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
    backgroundColor: '#121212',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#121212',
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
});
