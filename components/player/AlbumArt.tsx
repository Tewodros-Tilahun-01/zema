import { usePlayerStore } from '@/store/playerStore';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';

export function AlbumArt() {
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const [isLoading, setIsLoading] = useState(true);

  if (!currentTrack) return null;

  return (
    <View style={styles.coverFrame}>
      <LinearGradient
        colors={['rgba(105,165,255,0.75)', 'rgba(184,112,255,0.9)']}
        style={styles.coverGlow}
      >
        <View style={styles.coverContainer}>
          <Image
            source={{ uri: currentTrack.artwork }}
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
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  coverFrame: {
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
