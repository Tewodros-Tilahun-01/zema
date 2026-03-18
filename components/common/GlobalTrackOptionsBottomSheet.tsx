import {
  addTrackToCollection,
  getCollectionsWithTrackStatus,
  getFavoritesCollectionId,
  removeTrackFromCollection,
} from '@/db/queries';
import { useTrackPlayer } from '@/hooks/useTrackPlayer';
import { useTrackOptionsStore } from '@/store/trackOptionsStore';
import { Ionicons } from '@expo/vector-icons';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { Image } from 'expo-image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function GlobalTrackOptionsBottomSheet() {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const { isVisible, fullTrack, hideTrackOptions } = useTrackOptionsStore();
  const { handleTrackPress } = useTrackPlayer();
  const [showPlaylistSelector, setShowPlaylistSelector] = useState(false);
  const [collections, setCollections] = useState<any[]>([]);

  // Snap points
  const snapPoints = useMemo(
    () => (showPlaylistSelector ? ['70%'] : ['50%']),
    [showPlaylistSelector],
  );

  // Backdrop component
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        pressBehavior="close"
      />
    ),
    [],
  );

  // Handle sheet changes
  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        hideTrackOptions();
      }
    },
    [hideTrackOptions],
  );

  // Show/hide bottom sheet based on store state
  useEffect(() => {
    if (isVisible && fullTrack) {
      setShowPlaylistSelector(false);
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [isVisible, fullTrack]);

  const handleAddToFavorite = useCallback(async () => {
    if (fullTrack) {
      const favoritesId = await getFavoritesCollectionId();
      if (favoritesId) {
        const success = await addTrackToCollection(favoritesId, fullTrack);
        if (success) {
          console.log('Track added to favorites');
        } else {
          console.log('Track already in favorites');
        }
      }
      hideTrackOptions();
    }
  }, [fullTrack, hideTrackOptions]);

  const handleAddToPlaylist = useCallback(async () => {
    if (fullTrack) {
      const collectionsWithStatus = await getCollectionsWithTrackStatus(fullTrack.id);
      setCollections(collectionsWithStatus);
      setShowPlaylistSelector(true);
    }
  }, [fullTrack]);

  const handleSelectPlaylist = useCallback(
    async (collection: any) => {
      if (fullTrack) {
        if (collection.isTrackInCollection) {
          // Remove from collection
          const success = await removeTrackFromCollection(collection.id, fullTrack.id);
          if (success) {
            console.log('Track removed from collection');
            // Refresh the list
            const updated = await getCollectionsWithTrackStatus(fullTrack.id);
            setCollections(updated);
          }
        } else {
          // Add to collection
          const success = await addTrackToCollection(collection.id, fullTrack);
          if (success) {
            console.log('Track added to collection');
            // Refresh the list
            const updated = await getCollectionsWithTrackStatus(fullTrack.id);
            setCollections(updated);
          }
        }
      }
    },
    [fullTrack],
  );

  const handleBackToOptions = useCallback(() => {
    setShowPlaylistSelector(false);
  }, []);

  const handlePlayNow = useCallback(() => {
    if (fullTrack) {
      console.log('Play now:', fullTrack.title);
      handleTrackPress(fullTrack);
      hideTrackOptions();
    }
  }, [fullTrack, handleTrackPress, hideTrackOptions]);

  const handleDownload = useCallback(() => {
    if (fullTrack) {
      console.log('Download track:', fullTrack.title);
      hideTrackOptions();
    }
  }, [fullTrack, hideTrackOptions]);

  const options = useMemo(
    () => [
      {
        icon: 'play' as const,
        label: 'Play now',
        onPress: handlePlayNow,
      },
      {
        icon: 'download-outline' as const,
        label: 'Download',
        onPress: handleDownload,
      },
      {
        icon: 'list' as const,
        label: 'Add to playlist',
        onPress: handleAddToPlaylist,
      },
      {
        icon: 'heart-outline' as const,
        label: 'Add to favorite',
        onPress: handleAddToFavorite,
      },
    ],
    [handlePlayNow, handleDownload, handleAddToPlaylist, handleAddToFavorite],
  );

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.bottomSheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
      enablePanDownToClose={true}
      containerStyle={{ zIndex: 200 }}
    >
      <BottomSheetView style={styles.contentContainer}>
        {fullTrack && (
          <>
            {showPlaylistSelector ? (
              <>
                {/* Playlist Selector Header */}
                <View style={styles.selectorHeader}>
                  <Pressable onPress={handleBackToOptions} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                  </Pressable>
                  <Text style={styles.selectorTitle}>Add to Playlist</Text>
                </View>

                {/* Playlists List */}
                <ScrollView style={styles.playlistsList} showsVerticalScrollIndicator={false}>
                  {collections.length === 0 ? (
                    <View style={styles.emptyState}>
                      <Text style={styles.emptyText}>No playlists yet</Text>
                      <Text style={styles.emptySubtext}>Create a playlist first</Text>
                    </View>
                  ) : (
                    collections.map((collection) => (
                      <Pressable
                        key={collection.id}
                        style={[
                          styles.playlistItem,
                          collection.isTrackInCollection && styles.playlistItemActive,
                        ]}
                        onPress={() => handleSelectPlaylist(collection)}
                      >
                        <View style={styles.playlistIcon}>
                          {collection.coverUrl ? (
                            <Image
                              source={{ uri: collection.coverUrl }}
                              style={styles.playlistCover}
                            />
                          ) : (
                            <Ionicons
                              name={
                                collection.systemType === 'favorites' ? 'heart' : 'musical-notes'
                              }
                              size={20}
                              color={collection.systemType === 'favorites' ? '#FF3B30' : '#FFFFFF'}
                            />
                          )}
                        </View>
                        <View style={styles.playlistInfo}>
                          <Text style={styles.playlistName} numberOfLines={1}>
                            {collection.name}
                          </Text>
                          <Text style={styles.playlistCount}>{collection.trackCount} tracks</Text>
                        </View>
                        {collection.isTrackInCollection ? (
                          <Ionicons name="checkmark-circle" size={24} color="#4CD964" />
                        ) : (
                          <Ionicons name="add-circle-outline" size={24} color="#FFFFFF" />
                        )}
                      </Pressable>
                    ))
                  )}
                </ScrollView>
              </>
            ) : (
              <>
                {/* Track Info */}
                <View style={styles.trackInfo}>
                  <Image source={{ uri: fullTrack.album.cover_medium }} style={styles.trackImage} />
                  <View style={styles.trackDetails}>
                    <Text style={styles.trackTitle} numberOfLines={1}>
                      {fullTrack.title}
                    </Text>
                    <Text style={styles.trackArtist} numberOfLines={1}>
                      {fullTrack.artist.name}
                    </Text>
                  </View>
                </View>

                {/* Options */}
                <View style={styles.optionsContainer}>
                  {options.map((option, index) => (
                    <Pressable
                      key={index}
                      style={styles.option}
                      onPress={() => {
                        console.log('Option pressed:', option.label);
                        option.onPress();
                      }}
                    >
                      <Ionicons name={option.icon} size={24} color="#FFFFFF" />
                      <Text style={styles.optionText}>{option.label}</Text>
                    </Pressable>
                  ))}
                </View>
              </>
            )}
          </>
        )}
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: '#1A1D23',
  },
  handleIndicator: {
    backgroundColor: '#8E8E93',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  trackInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  trackImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },
  trackDetails: {
    marginLeft: 16,
    flex: 1,
  },
  trackTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  trackArtist: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  optionsContainer: {
    gap: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  optionText: {
    marginLeft: 16,
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  // Playlist Selector Styles
  selectorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  selectorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  playlistsList: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  playlistItemActive: {
    backgroundColor: 'rgba(76, 217, 100, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(76, 217, 100, 0.3)',
  },
  playlistIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  playlistCover: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  playlistInfo: {
    flex: 1,
    marginLeft: 12,
  },
  playlistName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  playlistCount: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
  },
});
