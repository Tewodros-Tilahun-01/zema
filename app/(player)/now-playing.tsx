import { Ionicons } from '@expo/vector-icons';
import {
  AudioSample,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
  useAudioSampleListener,
} from 'expo-audio';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  LayoutChangeEvent,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TRACK = {
  title: 'Neon Weekend',
  artist: 'Juno Hall',
  artwork:
    'https://images.unsplash.com/photo-1571266028253-d220c9d3f344?auto=format&fit=crop&w=700&q=80',
  source: require('../../assets/audio/Tewodros_Tadesse_ቴዎድሮስ_ታደሠ_እርሃብ_ጥሜ_አንቺው_ነሽ_1981_E_C_0.mp3'),
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

function mapFramesToBars(frames: number[], barCount: number) {
  if (!frames.length) {
    return new Array(barCount).fill(0.06);
  }

  const chunkSize = Math.max(1, Math.floor(frames.length / barCount));
  const nextBars: number[] = [];

  for (let i = 0; i < barCount; i += 1) {
    const start = i * chunkSize;
    const end = i === barCount - 1 ? frames.length : start + chunkSize;
    let sum = 0;

    for (let j = start; j < end; j += 1) {
      sum += Math.abs(frames[j] ?? 0);
    }

    const avg = sum / Math.max(1, end - start);
    // Boost quiet values to make the waveform readable.
    nextBars.push(clamp(avg * 3.2, 0.04, 1));
  }

  return nextBars;
}

export default function NowPlayingScreen() {
  const player = useAudioPlayer(TRACK.source, { updateInterval: 120 });
  const status = useAudioPlayerStatus(player);

  const [bars, setBars] = useState<number[]>(() =>
    new Array(BAR_COUNT).fill(0.14),
  );
  const [canSample, setCanSample] = useState(true);
  const [progressWidth, setProgressWidth] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekProgress, setSeekProgress] = useState<number | null>(null);
  const [isArtworkLoading, setIsArtworkLoading] = useState(true);

  useEffect(() => {
    player.volume = 0.8;
    player.play();

    void setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
    });
  }, [player]);

  useEffect(() => {
    const setupSampling = async () => {
      if (!player.isAudioSamplingSupported) {
        setCanSample(false);
        return;
      }

      if (Platform.OS === 'android') {
        const permission = await requestRecordingPermissionsAsync();
        if (!permission.granted) {
          setCanSample(false);
          return;
        }
      }

      setCanSample(true);
    };

    void setupSampling();
  }, [player]);

  useAudioSampleListener(player, (sample: AudioSample) => {
    if (!ENABLE_VISUALIZER || !canSample) return;
    const frames = sample.channels[0]?.frames ?? [];
    const next = mapFramesToBars(frames, BAR_COUNT);

    setBars((previous) =>
      previous.map(
        (value, index) => value * 0.64 + (next[index] ?? 0.1) * 0.36,
      ),
    );
  });

  const elapsed = useMemo(() => status.currentTime ?? 0, [status.currentTime]);
  const duration = useMemo(() => status.duration ?? 0, [status.duration]);
  const progress = duration > 0 ? clamp(elapsed / duration, 0, 1) : 0;
  const currentProgress = seekProgress ?? progress;

  const jumpBy = (deltaSeconds: number) => {
    const target = clamp((status.currentTime ?? 0) + deltaSeconds, 0, duration);
    void player.seekTo(target);
  };

  const onProgressLayout = (event: LayoutChangeEvent) => {
    setProgressWidth(event.nativeEvent.layout.width);
  };

  const getProgressFromX = (locationX: number) => {
    if (!progressWidth) return 0;
    return clamp(locationX / progressWidth, 0, 1);
  };

  const startSeek = (locationX: number) => {
    if (duration <= 0) return;
    setIsSeeking(true);
    setSeekProgress(getProgressFromX(locationX));
  };

  const updateSeek = (locationX: number) => {
    if (!isSeeking || duration <= 0) return;
    setSeekProgress(getProgressFromX(locationX));
  };

  const endSeek = () => {
    if (!isSeeking || seekProgress == null || duration <= 0) {
      setIsSeeking(false);
      setSeekProgress(null);
      return;
    }
    void player.seekTo(seekProgress * duration);
    setIsSeeking(false);
    setSeekProgress(null);
  };

  const seekFromX = (locationX: number) => {
    if (!progressWidth || duration <= 0) return;
    const nextProgress = getProgressFromX(locationX);
    void player.seekTo(nextProgress * duration);
  };

  const elapsedLabel = formatTime(
    isSeeking && seekProgress != null ? seekProgress * duration : elapsed,
  );
  const durationLabel = formatTime(duration);

  return (
    <LinearGradient
      colors={['#07080F', '#111325', '#171821']}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={styles.screen}
    >
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Pressable style={styles.iconCircle}>
            <Ionicons name="arrow-back" size={18} color="#EDEDF4" />
          </Pressable>
          <Text style={styles.headerTitle}>Now Playing</Text>
          <Pressable style={styles.iconCircle}>
            <Ionicons name="musical-notes-outline" size={18} color="#EDEDF4" />
          </Pressable>
        </View>

        <View style={styles.coverFrame}>
          <LinearGradient
            colors={['rgba(105,165,255,0.75)', 'rgba(184,112,255,0.9)']}
            style={styles.coverGlow}
          >
            <View style={styles.coverContainer}>
              <Image
                source={{ uri: TRACK.artwork }}
                style={styles.cover}
                onLoadStart={() => setIsArtworkLoading(true)}
                onLoadEnd={() => setIsArtworkLoading(false)}
                onError={() => setIsArtworkLoading(false)}
              />
              {isArtworkLoading ? (
                <View style={styles.coverLoadingOverlay}>
                  <ActivityIndicator size="large" color="#EDEDF4" />
                </View>
              ) : null}
            </View>
          </LinearGradient>
        </View>

        {/* Visualizer disabled for debugging. Set ENABLE_VISUALIZER to true to re-enable. */}
        {ENABLE_VISUALIZER ? (
          <View style={styles.waveRow}>
            {bars.map((bar, index) => (
              <View
                // Index is stable because BAR_COUNT is fixed.
                key={String(index)}
                style={[
                  styles.waveBar,
                  {
                    height:
                      MIN_BAR_HEIGHT + bar * (MAX_BAR_HEIGHT - MIN_BAR_HEIGHT),
                  },
                ]}
              />
            ))}
          </View>
        ) : null}

        <View style={styles.info}>
          <Text style={styles.trackTitle}>{TRACK.title}</Text>
          <Text style={styles.artist}>{TRACK.artist}</Text>
        </View>

        <View style={styles.controls}>
          <Pressable style={styles.ghostIcon}>
            <Ionicons name="heart-outline" size={20} color="#C9CBD8" />
          </Pressable>
          <Pressable onPress={() => jumpBy(-10)} style={styles.mediaAction}>
            <Ionicons name="play-skip-back" size={22} color="#FFFFFF" />
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
            <Ionicons name="play-skip-forward" size={22} color="#FFFFFF" />
          </Pressable>
          <Pressable style={styles.ghostIcon}>
            <Ionicons name="heart-outline" size={20} color="#C9CBD8" />
          </Pressable>
        </View>

        <View style={styles.bottomRow}>
          <Text style={styles.timerText}>{elapsedLabel}</Text>
          <Text style={styles.timerText}>{durationLabel}</Text>
        </View>

        <Pressable
          style={styles.progressTrack}
          onLayout={onProgressLayout}
          onPress={(event) => seekFromX(event.nativeEvent.locationX)}
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={() => true}
          onResponderGrant={(event) => startSeek(event.nativeEvent.locationX)}
          onResponderMove={(event) => updateSeek(event.nativeEvent.locationX)}
          onResponderRelease={endSeek}
          onResponderTerminate={endSeek}
        >
          <View
            style={[
              styles.progressFill,
              { width: `${currentProgress * 100}%` },
            ]}
          />
          <View
            style={[
              styles.progressThumb,
              { left: `${currentProgress * 100}%` },
            ]}
          />
        </Pressable>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  safe: {
    flex: 1,
    paddingHorizontal: 22,
  },
  header: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: '#F8F8FC',
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  iconCircle: {
    height: 36,
    width: 36,
    borderRadius: 9999,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverFrame: {
    marginTop: 34,
    alignItems: 'center',
  },
  coverGlow: {
    borderRadius: 24,
    padding: 3,
    shadowColor: '#8A71FF',
    shadowOpacity: 0.45,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  cover: {
    height: 245,
    width: 245,
    borderRadius: 20,
  },
  coverContainer: {
    height: 245,
    width: 245,
    borderRadius: 20,
    overflow: 'hidden',
  },
  coverLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(9,11,20,0.5)',
  },
  waveRow: {
    marginTop: 34,
    height: 52,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  waveBar: {
    width: 4,
    borderRadius: 999,
    backgroundColor: '#7A58FF',
    opacity: 0.94,
  },
  info: {
    marginTop: 28,
    alignItems: 'center',
  },
  trackTitle: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  artist: {
    marginTop: 5,
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
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
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaAction: {
    height: 44,
    width: 44,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  playButton: {
    height: 82,
    width: 82,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
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
    color: 'rgba(255,255,255,0.45)',
    fontSize: 12,
    letterSpacing: 0.6,
    minWidth: 42,
    textAlign: 'right',
  },
  progressTrack: {
    marginTop: 18,
    height: 6,
    width: '100%',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.1)',
    overflow: 'visible',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#7A58FF',
  },
  progressThumb: {
    position: 'absolute',
    top: -6,
    marginLeft: -9,
    height: 18,
    width: 18,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    shadowColor: '#A38BFF',
    shadowOpacity: 0.6,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 0 },
    elevation: 5,
  },
});
