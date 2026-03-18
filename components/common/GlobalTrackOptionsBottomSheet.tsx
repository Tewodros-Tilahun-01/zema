import PlaylistSelector from '@/components/common/PlaylistSelector';
import TrackInfoHeader from '@/components/common/TrackInfoHeader';
import TrackOptionsMenu from '@/components/common/TrackOptionsMenu';
import { useTrackOptions } from '@/hooks/useTrackOptions';
import { useTrackPlayer } from '@/hooks/useTrackPlayer';
import { useTrackOptionsStore } from '@/store/trackOptionsStore';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';

export default function GlobalTrackOptionsBottomSheet() {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const { isVisible, fullTrack, hideTrackOptions } = useTrackOptionsStore();
  const { handleTrackPress } = useTrackPlayer();
  const { collections, loadCollections, addToFavorites, toggleTrackInCollection } =
    useTrackOptions();
  const [showPlaylistSelector, setShowPlaylistSelector] = useState(false);

  const snapPoints = useMemo(
    () => (showPlaylistSelector ? ['70%'] : ['50%']),
    [showPlaylistSelector],
  );

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

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        hideTrackOptions();
      }
    },
    [hideTrackOptions],
  );

  useEffect(() => {
    if (isVisible && fullTrack) {
      setShowPlaylistSelector(false);
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [isVisible, fullTrack]);

  const handlePlayNow = useCallback(() => {
    if (fullTrack) {
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

  const handleAddToPlaylist = useCallback(async () => {
    if (fullTrack) {
      await loadCollections(fullTrack.id);
      setShowPlaylistSelector(true);
    }
  }, [fullTrack, loadCollections]);

  const handleAddToFavorite = useCallback(async () => {
    if (fullTrack) {
      const success = await addToFavorites(fullTrack);
      if (success) {
        console.log('Track added to favorites');
      } else {
        console.log('Track already in favorites');
      }
      hideTrackOptions();
    }
  }, [fullTrack, addToFavorites, hideTrackOptions]);

  const handleSelectCollection = useCallback(
    async (collection: any) => {
      if (fullTrack) {
        const success = await toggleTrackInCollection(
          collection.id,
          fullTrack,
          collection.isTrackInCollection,
        );
        if (success) {
          await loadCollections(fullTrack.id);
        }
      }
    },
    [fullTrack, toggleTrackInCollection, loadCollections],
  );

  const handleBackToOptions = useCallback(() => {
    setShowPlaylistSelector(false);
  }, []);

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
              <PlaylistSelector
                collections={collections}
                onBack={handleBackToOptions}
                onSelectCollection={handleSelectCollection}
              />
            ) : (
              <>
                <TrackInfoHeader track={fullTrack} />
                <TrackOptionsMenu options={options} />
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
});
