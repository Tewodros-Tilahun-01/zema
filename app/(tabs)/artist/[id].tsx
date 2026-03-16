import Button from '@/components/common/Button';
import { useArtist } from '@/hooks/useArtist';
import { useArtistTopTracks } from '@/hooks/useArtistTopTracks';
import { useTrackPlayer } from '@/hooks/useTrackPlayer';
import { Track } from '@/types/deezer';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ArtistScreen() {
  const { id, from } = useLocalSearchParams<{ id: string; from?: string }>();
  const router = useRouter();
  const navigation = useNavigation();
  const { handleTrackPress } = useTrackPlayer();

  const backRoute = from === 'search' ? '/(tabs)/search' : '/(tabs)/home';

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      e.preventDefault();
      router.push(backRoute);
    });
    return unsubscribe;
  }, [navigation, router, backRoute]);

  const handleBackPress = () => {
    router.push(backRoute);
  };

  const { data: artist, isLoading: isLoadingArtist, error } = useArtist(id as string);
  const { data: tracks = [], isLoading: isLoadingTracks } = useArtistTopTracks(id as string);

  if (isLoadingArtist) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  if (error || !artist) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error ? 'Failed to load artist' : 'Artist not found'}</Text>
        <Button style={styles.errorBackButton} onPress={handleBackPress}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </Button>
      </View>
    );
  }

  const renderTrackItem = useCallback(
    (track: Track, index: number) => (
      <Pressable
        key={track.id}
        style={styles.trackCard}
        onPress={() => handleTrackPress(track)}
        android_ripple={{ color: 'rgba(255, 255, 255, 0.1)' }}
      >
        <View style={styles.trackRank}>
          <Text style={styles.rankNumber}>{index + 1}</Text>
        </View>
        <Image
          source={{ uri: track.album.cover_medium }}
          style={styles.trackImage}
          contentFit="cover"
        />
        <View style={styles.trackDetails}>
          <Text style={styles.trackName} numberOfLines={1}>
            {track.title}
          </Text>
          <Text style={styles.albumName} numberOfLines={1}>
            {track.album.title}
          </Text>
          <View style={styles.trackMeta}>
            <Ionicons name="play" size={10} color="rgba(255, 255, 255, 0.5)" />
            <Text style={styles.metaText}>{(track.rank / 1000).toFixed(0)}K plays</Text>
          </View>
        </View>
        <Ionicons name="play-circle" size={32} color="rgba(255, 255, 255, 0.8)" />
      </Pressable>
    ),
    [handleTrackPress],
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Image
            source={{ uri: artist.picture_xl }}
            style={styles.heroBackground}
            contentFit="cover"
            blurRadius={80}
          />
          <LinearGradient
            colors={['rgba(11, 14, 20, 0.2)', 'rgba(11, 14, 20, 0.7)', '#0B0E14']}
            style={styles.heroGradient}
          />

          {/* Back Button */}
          <View style={styles.headerBar}>
            <Pressable onPress={handleBackPress} style={styles.backButton}>
              <View style={styles.backButtonInner}>
                <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
              </View>
            </Pressable>
          </View>

          {/* Artist Info */}
          <View style={styles.artistInfo}>
            <View style={styles.artistImageContainer}>
              <Image
                source={{ uri: artist.picture_big }}
                style={styles.artistImage}
                contentFit="cover"
              />
              <LinearGradient
                colors={['transparent', 'rgba(0, 0, 0, 0.3)']}
                style={styles.imageGradient}
              />
            </View>
            <Text style={styles.artistName}>{artist.name}</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Ionicons name="people" size={16} color="rgba(255, 255, 255, 0.7)" />
                <Text style={styles.statText}>{(artist.nb_fan / 1000000).toFixed(1)}M fans</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Ionicons name="disc" size={16} color="rgba(255, 255, 255, 0.7)" />
                <Text style={styles.statText}>{artist.nb_album} albums</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Popular Tracks Section */}
        <View style={styles.tracksSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Tracks</Text>
            <Text style={styles.sectionSubtitle}>Most played songs</Text>
          </View>

          {isLoadingTracks ? (
            <ActivityIndicator size="small" color="#FFFFFF" style={styles.loader} />
          ) : (
            <View style={styles.tracksList}>
              {tracks.map((track, index) => renderTrackItem(track, index))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0E14',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0B0E14',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#0B0E14',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 20,
  },
  errorBackButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#1C1C1E',
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  heroSection: {
    height: 420,
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
    top: 50,
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
  tracksSection: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 100,
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  loader: {
    marginTop: 40,
  },
  tracksList: {
    gap: 12,
  },
  trackCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 12,
    gap: 12,
  },
  trackRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  trackImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
  },
  trackDetails: {
    flex: 1,
    gap: 4,
  },
  trackName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  albumName: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  trackMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  metaText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
  },
});
