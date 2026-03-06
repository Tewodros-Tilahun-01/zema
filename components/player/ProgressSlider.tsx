import { usePlayerStore } from '@/store/playerStore';
import { formatTime } from '@/utils/player';
import Slider from '@react-native-community/slider';
import { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function ProgressSlider() {
  const player = usePlayerStore((state) => state.player);
  const currentTime = usePlayerStore((state) => state.currentTime);
  const duration = usePlayerStore((state) => state.duration);
  const isPlaying = usePlayerStore((state) => state.isPlaying);

  const [sliderValue, setSliderValue] = useState(0);
  const isDragging = useRef(false);
  const wasPlayingRef = useRef(false);

  const progress = duration > 0 ? currentTime / duration : 0;

  // Only update slider from store when NOT dragging
  useEffect(() => {
    if (!isDragging.current) {
      setSliderValue(progress);
    }
  }, [progress]);

  const handleSlidingStart = () => {
    isDragging.current = true;
    // Remember if music was playing and pause it
    wasPlayingRef.current = isPlaying;
    if (player && isPlaying) {
      player.pause();
    }
  };

  const handleValueChange = (value: number) => {
    setSliderValue(value);
  };

  const handleSlidingComplete = (value: number) => {
    if (player && duration > 0) {
      player.seekTo(value * duration);
      // Resume playing if it was playing before
      if (wasPlayingRef.current) {
        player.play();
      }
    }
    // Release after a short delay to let player update
    setTimeout(() => {
      isDragging.current = false;
    }, 150);
  };

  const elapsed = isDragging.current ? sliderValue * duration : currentTime;
  const elapsedLabel = useMemo(() => formatTime(elapsed), [elapsed]);
  const durationLabel = useMemo(() => formatTime(duration), [duration]);

  return (
    <>
      <View style={styles.bottomRow}>
        <Text style={styles.timerText}>{elapsedLabel}</Text>
        <Text style={styles.timerText}>{durationLabel}</Text>
      </View>

      <Slider
        style={styles.progressSlider}
        minimumValue={0}
        maximumValue={1}
        value={sliderValue}
        onSlidingStart={handleSlidingStart}
        onValueChange={handleValueChange}
        onSlidingComplete={handleSlidingComplete}
        minimumTrackTintColor="#7A58FF"
        maximumTrackTintColor="rgba(255,255,255,0.10)"
        thumbTintColor="transparent"
      />
    </>
  );
}

const styles = StyleSheet.create({
  bottomRow: {
    marginTop: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timerText: {
    minWidth: 42,
    textAlign: 'right',
    fontSize: 12,
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: 0.6,
  },
  progressSlider: {
    marginTop: 12,
    width: '65%',
    height: 24,
    marginHorizontal: 'auto',
    transform: [{ scale: 1.7 }],
  },
});
