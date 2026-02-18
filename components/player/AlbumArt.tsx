import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';

type AlbumArtProps = {
  artwork: string;
  isLoading: boolean;
  onLoadStart: () => void;
  onLoadEnd: () => void;
  onError: () => void;
};

export function AlbumArt({
  artwork,
  isLoading,
  onLoadStart,
  onLoadEnd,
  onError,
}: AlbumArtProps) {
  return (
    <View style={styles.coverFrame}>
      <LinearGradient
        colors={['rgba(105,165,255,0.75)', 'rgba(184,112,255,0.9)']}
        style={styles.coverGlow}
      >
        <View style={styles.coverContainer}>
          <Image
            source={{ uri: artwork }}
            style={styles.cover}
            onLoadStart={onLoadStart}
            onLoadEnd={onLoadEnd}
            onError={onError}
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
  coverContainer: {
    height: 245,
    width: 245,
    overflow: 'hidden',
    borderRadius: 20,
  },
  cover: {
    height: 245,
    width: 245,
    borderRadius: 20,
  },
  coverLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(9,11,20,0.5)',
  },
});
