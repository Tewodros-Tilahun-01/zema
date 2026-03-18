import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Dimensions, StyleSheet, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HEADER_HEIGHT = 350;

type CollectionHeaderProps = {
  coverUrl: string | null;
  isFavorites?: boolean;
};

export default function CollectionHeader({ coverUrl, isFavorites }: CollectionHeaderProps) {
  if (!coverUrl) {
    return (
      <View style={styles.headerPlaceholder}>
        <Ionicons
          name={isFavorites ? 'heart' : 'musical-notes'}
          size={80}
          color={isFavorites ? '#FF3B30' : 'rgba(255, 255, 255, 0.3)'}
        />
      </View>
    );
  }

  return <Image source={{ uri: coverUrl }} style={styles.headerImage} cachePolicy="memory-disk" />;
}

const styles = StyleSheet.create({
  headerImage: {
    width: SCREEN_WIDTH,
    height: HEADER_HEIGHT,
    resizeMode: 'cover',
  },
  headerPlaceholder: {
    width: SCREEN_WIDTH,
    height: HEADER_HEIGHT,
    backgroundColor: '#1C1C1E',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export { HEADER_HEIGHT };
