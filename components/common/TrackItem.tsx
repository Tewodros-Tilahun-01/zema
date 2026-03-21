import { useTrackPlayer } from '@/hooks/useTrackPlayer';
import { useTrackOptionsStore } from '@/store/trackOptionsStore';
import { Track } from '@/types/deezer';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type TrackItemProps = {
  track: Track;
  showOptions?: boolean;
  showRipple?: boolean;
  style?: any;
  showRemove?: boolean;
  onRemove?: (trackId: number) => void;
};

function TrackItem({
  track,
  showOptions = true,
  showRipple = true,
  style,
  showRemove = false,
  onRemove,
}: TrackItemProps) {
  const { handleTrackPress } = useTrackPlayer();
  const showTrackOptions = useTrackOptionsStore((state) => state.showTrackOptions);

  const handlePress = () => {
    handleTrackPress(track);
  };

  const handleOptionsPress = () => {
    showTrackOptions(track);
  };

  const handleRemovePress = () => {
    if (onRemove) {
      onRemove(track.id);
    }
  };

  return (
    <Pressable
      style={[styles.trackItem, style]}
      onPress={handlePress}
      android_ripple={showRipple ? { color: 'rgba(255, 255, 255, 0.1)' } : undefined}
    >
      <Image
        source={{ uri: track.album.cover_medium }}
        style={styles.trackCover}
        contentFit="cover"
      />
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle} numberOfLines={1}>
          {track.title}
        </Text>
        <Text style={styles.trackArtist} numberOfLines={1}>
          {track.artist.name}
        </Text>
      </View>
      <View style={styles.actions}>
        {showOptions && (
          <Pressable
            style={styles.optionsButton}
            onPress={(e) => {
              e.stopPropagation();
              handleOptionsPress();
            }}
            hitSlop={8}
          >
            <Ionicons name="ellipsis-vertical" size={20} color="#8E8E93" />
          </Pressable>
        )}
        {showRemove && (
          <Pressable
            style={styles.removeButton}
            onPress={(e) => {
              e.stopPropagation();
              handleRemovePress();
            }}
            hitSlop={8}
          >
            <Ionicons name="trash-outline" size={20} color="#8E8E93" />
          </Pressable>
        )}
      </View>
    </Pressable>
  );
}

export default memo(TrackItem);

const styles = StyleSheet.create({
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: '#121212',
  },
  trackCover: {
    width: 56,
    height: 56,
    borderRadius: 8,
  },
  trackInfo: {
    flex: 1,
    marginLeft: 12,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  trackArtist: {
    fontSize: 14,
    color: '#8E8E93',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  removeButton: {
    padding: 8,
  },
  optionsButton: {
    padding: 8,
  },
});
