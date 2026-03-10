import { usePlayerStore } from '@/store/playerStore';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { BottomSheetPlayer } from './BottomSheetPlayer';
import { MiniPlayer } from './MiniPlayer';

export function PlayerManager() {
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const [isFullPlayerVisible, setIsFullPlayerVisible] = useState(false);

  const handleExpand = () => {
    setIsFullPlayerVisible(true);
  };

  const handleCollapse = () => {
    setIsFullPlayerVisible(false);
  };

  if (!currentTrack) return null;

  return (
    <>
      {/* Mini Player - Fixed at bottom above tabs */}
      <View style={styles.miniPlayerContainer}>
        <MiniPlayer onExpand={handleExpand} />
      </View>

      {/* Full Player - Portal overlay */}
      <BottomSheetPlayer isVisible={isFullPlayerVisible} onCollapse={handleCollapse} />
    </>
  );
}

const styles = StyleSheet.create({
  miniPlayerContainer: {
    position: 'absolute',
    bottom: 90, // Above tab bar
    left: 0,
    right: 0,
    backgroundColor: '#1C1C1E',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
});
