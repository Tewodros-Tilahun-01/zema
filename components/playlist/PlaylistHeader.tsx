import { DeezerPlaylist } from '@/types/deezer';
import { Dimensions, Image, StyleSheet } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HEADER_HEIGHT = 350;

type PlaylistHeaderProps = {
  playlist: DeezerPlaylist;
};

export default function PlaylistHeader({ playlist }: PlaylistHeaderProps) {
  return <Image source={{ uri: playlist.picture_big }} style={styles.headerImage} />;
}

const styles = StyleSheet.create({
  headerImage: {
    width: SCREEN_WIDTH,
    height: HEADER_HEIGHT,
    resizeMode: 'cover',
  },
});

export { HEADER_HEIGHT };
