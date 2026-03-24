import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type ArtistHeaderProps = {
  artistName: string;
  artistImage: string;
  artistBackground: string;
  nbFans: number;
  nbAlbums: number;
  onBackPress: () => void;
};

export default function ArtistHeader({
  artistName,
  artistImage,
  artistBackground,
  nbFans,
  nbAlbums,
  onBackPress,
}: ArtistHeaderProps) {
  return (
    <View style={styles.heroSection}>
      <Image
        source={{ uri: artistBackground }}
        style={styles.heroBackground}
        contentFit="cover"
        blurRadius={80}
        cachePolicy="memory-disk"
      />
      <LinearGradient
        colors={['rgba(18, 18, 18, 0.2)', 'rgba(18, 18, 18, 0.7)', '#121212']}
        style={styles.heroGradient}
      />

      <View style={styles.headerBar}>
        <Pressable onPress={onBackPress} style={styles.backButton}>
          <View style={styles.backButtonInner}>
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </View>
        </Pressable>
      </View>

      <View style={styles.artistInfo}>
        <View style={styles.artistImageContainer}>
          <Image
            source={{ uri: artistImage }}
            style={styles.artistImage}
            contentFit="cover"
            cachePolicy="memory-disk"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0, 0, 0, 0.3)']}
            style={styles.imageGradient}
          />
        </View>
        <Text style={styles.artistName}>{artistName}</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="people" size={16} color="rgba(255, 255, 255, 0.7)" />
            <Text style={styles.statText}>{(nbFans / 1000000).toFixed(1)}M fans</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="disc" size={16} color="rgba(255, 255, 255, 0.7)" />
            <Text style={styles.statText}>{nbAlbums} albums</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heroSection: {
    height: 400,
    position: 'relative',
  },
  heroBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  headerBar: {
    position: 'absolute',
    top: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  backButtonInner: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  artistInfo: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  artistImageContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  artistImage: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  artistName: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
});
