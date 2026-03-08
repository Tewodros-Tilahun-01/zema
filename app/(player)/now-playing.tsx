import { AlbumArt } from '@/components/player/AlbumArt';
import { DynamicBackground } from '@/components/player/DynamicBackground';
import { PlayerControls } from '@/components/player/PlayerControls';
import { PlayerHeader } from '@/components/player/PlayerHeader';
import { ProgressSlider } from '@/components/player/ProgressSlider';
import { TrackInfo } from '@/components/player/TrackInfo';
import { usePlayerInitializer } from '@/hooks/usePlayerInitializer';
import { usePlayerStore } from '@/store/playerStore';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TRENDING } from '../(tabs)/home';

const TRACK = {
  id: 'track-1',
  title: 'Neon Weekend',
  artist: 'Juno Hall',
  artwork: TRENDING[0].image,
  source: require('../../assets/audio/Kanye_West_-_Runaway__Video_Version__ft._Pusha_T(256k).mp3'),
};

export default function NowPlayingScreen() {
  usePlayerInitializer(TRACK);
  const currentTrack = usePlayerStore((state) => state.currentTrack);

  return (
    <DynamicBackground imageUri={currentTrack?.artwork || null}>
      <SafeAreaView style={styles.safeArea}>
        <PlayerHeader />
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
  );
}

const styles = StyleSheet.create({
  safeArea: {
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
    marginBottom: 60,
  },
});
