import { usePlayerStore } from '@/store/playerStore';
import { useEffect, useState } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import { FullPlayer } from '../Modal/FullPlayer';
import { MiniPlayer } from '../Modal/MiniPlayer';

export function PlayerManager() {
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const [isFullPlayerVisible, setIsFullPlayerVisible] = useState(false);

  const handleExpand = () => {
    setIsFullPlayerVisible(true);
  };

  const handleCollapse = () => {
    setIsFullPlayerVisible(false);
  };

  // Handle Android back button
  useEffect(() => {
    const backAction = () => {
      if (isFullPlayerVisible) {
        // If full player is open, close it and prevent default back action
        handleCollapse();
        return true; // Prevent default back behavior
      }
      // If full player is not open, allow default back behavior
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [isFullPlayerVisible]);

  if (!currentTrack) return null;

  return (
    <>
      {/* Mini Player - Fixed at bottom above tabs */}
      <View style={styles.miniPlayerContainer}>
        <MiniPlayer onExpand={handleExpand} />
      </View>

      {/* Full Player - Portal overlay with its own DynamicBackground */}
      <FullPlayer isVisible={isFullPlayerVisible} onCollapse={handleCollapse} />
    </>
  );
}

const styles = StyleSheet.create({
  miniPlayerContainer: {
    position: 'absolute',
    bottom: 85,
    paddingVertical: 4, // Above tab bar
    left: 0,
    right: 0,
    backgroundColor: '#1C1C1E',
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
