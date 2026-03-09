import { usePlayerStore } from '@/store/playerStore';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlbumArt } from './AlbumArt';
import { DynamicBackground } from './DynamicBackground';
import { PlayerControls } from './PlayerControls';
import { PlayerHeader } from './PlayerHeader';
import { ProgressSlider } from './ProgressSlider';
import { TrackInfo } from './TrackInfo';

export function FullPlayer({ onCollapse }: { onCollapse?: () => void }) {
  const currentTrack = usePlayerStore((state) => state.currentTrack);

  if (!currentTrack) {
    return (
      <SafeAreaView style={styles.container}>
        <PlayerHeader onCollapse={onCollapse} />
      </SafeAreaView>
    );
  }

  return (
    <DynamicBackground imageUri={currentTrack.album.cover_xl}>
      <SafeAreaView style={styles.container}>
        <PlayerHeader onCollapse={onCollapse} />
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
  container: {
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
