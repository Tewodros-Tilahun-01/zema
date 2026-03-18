import { DeezerPlaylist } from '@/types/deezer';
import { Image } from 'expo-image';
import { Dimensions, StyleSheet } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HEADER_HEIGHT = 350;

type PlaylistHeaderProps = {
  playlist: DeezerPlaylist;
};

export default function PlaylistHeader({ playlist }: PlaylistHeaderProps) {
  return (
    <Image
      source={{ uri: playlist.picture_big }}
      style={styles.headerImage}
      cachePolicy="memory-disk"
      contentFit="cover"
    />
  );
}

const styles = StyleSheet.create({
  headerImage: {
    width: SCREEN_WIDTH,
    height: HEADER_HEIGHT,
  },
});

export { HEADER_HEIGHT };
