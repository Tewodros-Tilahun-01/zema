import { usePlayerStore } from '@/store/playerStore';
import { useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';

export function AlbumArt() {
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const [isLoading, setIsLoading] = useState(true);

  if (!currentTrack) return null;

  return (
    <View style={styles.coverFrame}>
      <View style={styles.coverGlow}>
        <View style={styles.coverContainer}>
          <Image
            source={{ uri: currentTrack.album.cover_xl }}
            style={styles.cover}
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
          />
          {isLoading ? (
            <View style={styles.coverLoadingOverlay}>
              <ActivityIndicator size="large" color="#EDEDF4" />
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  coverFrame: {
    alignItems: 'center',
  },
  coverGlow: {
    borderRadius: 24,
    padding: 2,
    shadowOpacity: 0.3,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  coverContainer: {
    height: 320,
    width: 320,
    overflow: 'hidden',
    borderRadius: 20,
  },
  cover: {
    height: 320,
    width: 320,
    borderRadius: 20,
  },
  coverLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(9,11,20,0.5)',
  },
});
