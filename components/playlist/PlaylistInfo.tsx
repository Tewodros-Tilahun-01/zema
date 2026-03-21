import { DeezerPlaylist } from '@/types/deezer';
import { StyleSheet, Text, View } from 'react-native';

type PlaylistInfoProps = {
  playlist: DeezerPlaylist;
};

export default function PlaylistInfo({ playlist }: PlaylistInfoProps) {
  return (
    <View style={styles.headerContent}>
      <Text style={styles.playlistTitleHeader}>{playlist.title}</Text>
      <View style={styles.playlistMeta}>
        <Text style={styles.metaText}>
          {playlist.creator?.name || playlist.user?.name || 'Unknown'}
        </Text>
        <Text style={styles.metaText}>•</Text>
        <Text style={styles.metaText}>{playlist.nb_tracks} tracks</Text>
      </View>
      {playlist.description && (
        <Text style={styles.playlistDescription}>{playlist.description}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 18,
    backgroundColor: '#121212',
  },
  playlistTitleHeader: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  playlistDescription: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 12,
  },
  playlistMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  metaText: {
    fontSize: 14,
    color: '#8E8E93',
  },
});
