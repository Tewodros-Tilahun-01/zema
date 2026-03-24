import { usePlayerStore } from '@/store/playerStore';
import { useEffect, useState } from 'react';
import { BackHandler, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
      <SafeAreaView edges={['bottom']} style={styles.miniPlayerContainer}>
        {/* Mini Player - Fixed at bottom above tabs */}
        <MiniPlayer onExpand={handleExpand} />
      </SafeAreaView>

      {/* Full Player - Portal overlay with its own DynamicBackground */}
      <FullPlayer isVisible={isFullPlayerVisible} onCollapse={handleCollapse} />
    </>
  );
}

const styles = StyleSheet.create({
  miniPlayerContainer: {
    position: 'absolute',
    bottom: 85,
    left: 0,
    right: 0,
    zIndex: 100,
  },
});
