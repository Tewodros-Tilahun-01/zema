import { ProfileCardItem } from '@/types/components';
import { Image, StyleSheet, Text, View } from 'react-native';

type ProfileCardProps = {
  item: ProfileCardItem;
};

export default function TrackCard({ item }: ProfileCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
      </View>

      <Text style={styles.songTitle} numberOfLines={1}>
        {item.songTitle}
      </Text>
      <Text style={styles.artistName} numberOfLines={1}>
        {item.name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 144,
    overflow: 'hidden',
  },
  imageContainer: {
    width: 144,
    height: 144,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  songTitle: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  artistName: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
});
