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
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function GlobalTrackOptionsBottomSheet() {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const { isVisible, fullTrack, hideTrackOptions } = useTrackOptionsStore();
  const { handleTrackPress } = useTrackPlayer();

  // Snap points
  const snapPoints = useMemo(() => ['50%'], []);

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
      console.log('Bottom sheet index changed:', index);
      if (index === -1) {
        hideTrackOptions();
      }
    },
    [hideTrackOptions],
  );

  // Show/hide bottom sheet based on store state
  useEffect(() => {
    if (isVisible && fullTrack) {
      console.log('Presenting bottom sheet for:', fullTrack.title);
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [isVisible, fullTrack]);

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

  const handleAddToPlaylist = useCallback(() => {
    if (fullTrack) {
      console.log('Add to playlist:', fullTrack.title);
      hideTrackOptions();
    }
  }, [fullTrack, hideTrackOptions]);

  const handleAddToFavorite = useCallback(() => {
    if (fullTrack) {
      console.log('Add to favorite:', fullTrack.title);
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
});
