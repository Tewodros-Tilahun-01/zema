import { useAudioPlayerController } from '@/audio/useAudioPlayerController';
import { useAudioVisualizer } from '@/audio/useAudioVisualizer';
import { AlbumArt } from '@/components/player/AlbumArt';
import { Waveform } from '@/components/player/Waveform';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TRACK = {
  title: 'Neon Weekend',
  artist: 'Juno Hall',
  artwork:
    'https://images.unsplash.com/photo-1571266028253-d220c9d3f344?auto=format&fit=crop&w=700&q=80',
  source: require('../../assets/audio/Kanye_West_-_Runaway__Video_Version__ft._Pusha_T(256k).mp3'),
};

const BAR_COUNT = 40;
const MIN_BAR_HEIGHT = 6;
const MAX_BAR_HEIGHT = 70;
const ENABLE_VISUALIZER = true;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function formatTime(seconds: number) {
  const safeValue = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safeValue / 60)
    .toString()
    .padStart(2, '0');
  const secs = Math.floor(safeValue % 60)
    .toString()
    .padStart(2, '0');
  return `${minutes}:${secs}`;
}

export default function NowPlayingScreen() {
  const { player, status, jumpBy, seekToProgress } = useAudioPlayerController(
    TRACK.source,
  );
  const { bars, barCount, canSample } = useAudioVisualizer(player, {
    barCount: BAR_COUNT,
    enabled: ENABLE_VISUALIZER,
  });

  const [isSeeking, setIsSeeking] = useState(false);
  const [dragProgress, setDragProgress] = useState<number | null>(null);
  const [isArtworkLoading, setIsArtworkLoading] = useState(true);

  const elapsed = status.currentTime ?? 0;
  const duration = status.duration ?? 0;
  const progress = duration > 0 ? clamp(elapsed / duration, 0, 1) : 0;
  const sliderProgress =
    isSeeking && dragProgress != null ? dragProgress : progress;

  const onSlidingStart = () => {
    if (duration <= 0) return;
    setIsSeeking(true);
    setDragProgress(progress);
  };

  const onValueChange = (value: number) => {
    if (!isSeeking) return;
    setDragProgress(value);
  };

  const onSlidingComplete = async (value: number) => {
    try {
      if (duration > 0) {
        await seekToProgress(value);
      }
      console.log('Seeked to', value);
    } finally {
      console.log('Seek complete', dragProgress);
      setIsSeeking(false);
      // setDragProgress(null);
    }
  };

  const elapsedLabel = formatTime(
    isSeeking && dragProgress != null ? dragProgress * duration : elapsed,
  );
  const durationLabel = useMemo(() => formatTime(duration), [duration]);

  return (
    <LinearGradient
      colors={['#07080F', '#111325', '#171821']}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable style={styles.iconCircle}>
            <Ionicons name="arrow-back" size={18} color="#EDEDF4" />
          </Pressable>
          <Text style={styles.headerTitle}>Now Playing</Text>
          <Pressable style={styles.iconCircle}>
            <Ionicons name="musical-notes-outline" size={18} color="#EDEDF4" />
          </Pressable>
        </View>

        <AlbumArt
          artwork={TRACK.artwork}
          isLoading={isArtworkLoading}
          onLoadStart={() => setIsArtworkLoading(true)}
          onLoadEnd={() => setIsArtworkLoading(false)}
          onError={() => setIsArtworkLoading(false)}
        />

        <Waveform
          bars={bars}
          barCount={barCount}
          minBarHeight={MIN_BAR_HEIGHT}
          maxBarHeight={MAX_BAR_HEIGHT}
          enabled={ENABLE_VISUALIZER}
          canSample={canSample}
        />

        <View style={styles.info}>
          <Text style={styles.trackTitle}>{TRACK.title}</Text>
          <Text style={styles.artist}>{TRACK.artist}</Text>
        </View>

        <View style={styles.controls}>
          <Pressable style={styles.ghostIcon}>
            <Ionicons name="heart-outline" size={20} color="#C9CBD8" />
          </Pressable>
          <Pressable onPress={() => jumpBy(-10)} style={styles.mediaAction}>
            <Ionicons name="play-back" size={22} color="#FFFFFF" />
          </Pressable>
          <Pressable
            style={styles.playButton}
            onPress={() => (status.playing ? player.pause() : player.play())}
          >
            <Ionicons
              name={status.playing ? 'pause' : 'play'}
              size={30}
              color="#1A1E2F"
            />
          </Pressable>
          <Pressable onPress={() => jumpBy(10)} style={styles.mediaAction}>
            <Ionicons name="play-forward" size={22} color="#FFFFFF" />
          </Pressable>
          <Pressable style={styles.ghostIcon}>
            <Ionicons name="heart-outline" size={20} color="#C9CBD8" />
          </Pressable>
        </View>

        <View style={styles.bottomRow}>
          <Text style={styles.timerText}>{elapsedLabel}</Text>
          <Text style={styles.timerText}>{durationLabel}</Text>
        </View>

        <Slider
          style={styles.progressSlider}
          minimumValue={0}
          maximumValue={1}
          value={sliderProgress}
          onSlidingStart={onSlidingStart}
          onValueChange={onValueChange}
          onSlidingComplete={onSlidingComplete}
          minimumTrackTintColor="#7A58FF"
          maximumTrackTintColor="rgba(255,255,255,0.10)"
          thumbTintColor="#FFFFFF"
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingHorizontal: 22,
  },
  header: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconCircle: {
    height: 36,
    width: 36,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#F8F8FC',
    letterSpacing: 0.2,
  },
  info: {
    marginTop: 28,
    alignItems: 'center',
  },
  trackTitle: {
    fontSize: 21,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  artist: {
    marginTop: 5,
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  controls: {
    marginTop: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ghostIcon: {
    height: 38,
    width: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9999,
  },
  mediaAction: {
    height: 44,
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9999,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  playButton: {
    height: 82,
    width: 82,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9999,
    backgroundColor: '#FFFFFF',
    shadowColor: '#A38BFF',
    shadowOpacity: 0.55,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    elevation: 12,
  },
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
