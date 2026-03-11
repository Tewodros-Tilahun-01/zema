import { usePlayerStore } from '@/store/playerStore';
import { Portal } from '@gorhom/portal';
import { useCallback } from 'react';
import { Dimensions, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlbumArt } from '../player/AlbumArt';
import { DynamicBackground } from '../player/DynamicBackground';
import { PlayerControls } from '../player/PlayerControls';
import { PlayerHeader } from '../player/PlayerHeader';
import { ProgressSlider } from '../player/ProgressSlider';
import { TrackInfo } from '../player/TrackInfo';

type FullPlayerProps = {
  isVisible: boolean;
  onCollapse: () => void;
};

const { height: screenHeight } = Dimensions.get('window');

export function FullPlayer({ isVisible, onCollapse }: FullPlayerProps) {
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const translateY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .minDistance(20)
    .shouldCancelWhenOutside(false)
    .onUpdate((event) => {
      // Only allow downward dragging
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      const threshold = screenHeight * 0.2;

      if (event.translationY > threshold || event.velocityY > 500) {
        translateY.value = withTiming(screenHeight, { duration: 250 }, (finished) => {
          if (finished) {
            runOnJS(onCollapse)();
          }
        });
      } else {
        translateY.value = withSpring(0, {
          damping: 50,
          stiffness: 120,
          mass: 1.2,
        });
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const handleBackdropPress = useCallback(() => {
    onCollapse();
  }, [onCollapse]);

  const handleHeaderCollapse = useCallback(() => {
    onCollapse();
  }, [onCollapse]);

  if (!isVisible) return null;

  if (!currentTrack) {
    return (
      <Portal>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={handleBackdropPress}>
            <View style={styles.backdrop} />
          </TouchableWithoutFeedback>
          <Animated.View style={[styles.container, animatedStyle]}>
            <SafeAreaView style={styles.playerContainer}>
              <PlayerHeader onCollapse={handleHeaderCollapse} />
            </SafeAreaView>
          </Animated.View>
        </View>
      </Portal>
    );
  }

  return (
    <Portal>
      <View style={styles.overlay}>
        {/* Backdrop */}
        <TouchableWithoutFeedback onPress={handleBackdropPress}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        {/* Draggable Content with DynamicBackground */}
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.container, animatedStyle]}>
            <DynamicBackground imageUri={currentTrack.album.cover_xl}>
              <SafeAreaView style={styles.playerContainer}>
                <PlayerHeader onCollapse={handleHeaderCollapse} />
                <View style={styles.content}>
                  <AlbumArt />
                </View>
                <View style={styles.bottomSection}>
                  <TrackInfo />
                  <PlayerControls />
                  <ProgressSlider />
                </View>
              </SafeAreaView>
            </DynamicBackground>
          </Animated.View>
        </GestureDetector>
      </View>
    </Portal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  playerContainer: {
    flex: 1,
    paddingHorizontal: 22,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSection: {
    paddingBottom: 20,
    marginBottom: 20,
  },
});
