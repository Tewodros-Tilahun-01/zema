import ArtistHeader from '@/components/artist/ArtistHeader';
import ArtistTracksList from '@/components/artist/ArtistTracksList';
import Button from '@/components/common/Button';
import { useArtist } from '@/hooks/useArtist';
import { useArtistTopTracks } from '@/hooks/useArtistTopTracks';
import { useTrackPlayer } from '@/hooks/useTrackPlayer';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function SearchArtistScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { handleTrackPress } = useTrackPlayer();

  const handleBackPress = () => {
    router.back();
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

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <ArtistHeader
          artistName={artist.name}
          artistImage={artist.picture_big}
          artistBackground={artist.picture_xl}
          nbFans={artist.nb_fan}
          nbAlbums={artist.nb_album}
          onBackPress={handleBackPress}
        />
        <ArtistTracksList
          tracks={tracks}
          isLoading={isLoadingTracks}
          onTrackPress={handleTrackPress}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#121212',
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
});
