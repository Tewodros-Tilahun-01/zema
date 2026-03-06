import { AlbumArt } from '@/components/player/AlbumArt';
import { PlayerControls } from '@/components/player/PlayerControls';
import { PlayerHeader } from '@/components/player/PlayerHeader';
import { ProgressSlider } from '@/components/player/ProgressSlider';
import { TrackInfo } from '@/components/player/TrackInfo';
import { Waveform } from '@/components/player/Waveform';
import { usePlayerInitializer } from '@/hooks/usePlayerInitializer';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TRACK = {
  id: 'track-1',
  title: 'Neon Weekend',
  artist: 'Juno Hall',
  artwork:
    'https://images.unsplash.com/photo-1571266028253-d220c9d3f344?auto=format&fit=crop&w=700&q=80',
  source: require('../../assets/audio/Kanye_West_-_Runaway__Video_Version__ft._Pusha_T(256k).mp3'),
};

const VISUALIZER_CONFIG = {
  barCount: 40,
  minBarHeight: 6,
  maxBarHeight: 70,
  enabled: true,
};

export default function NowPlayingScreen() {
  usePlayerInitializer(TRACK);

  return (
    <LinearGradient
      colors={['#07080F', '#111325', '#171821']}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <PlayerHeader />
        <AlbumArt />
        <Waveform
          barCount={VISUALIZER_CONFIG.barCount}
          minBarHeight={VISUALIZER_CONFIG.minBarHeight}
          maxBarHeight={VISUALIZER_CONFIG.maxBarHeight}
          enabled={VISUALIZER_CONFIG.enabled}
        />
        <TrackInfo />
        <PlayerControls />
        <ProgressSlider />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 22,
  },
});
