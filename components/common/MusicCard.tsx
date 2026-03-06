import { LinearGradient } from 'expo-linear-gradient';
import { ColorValue, Image, StyleSheet, Text, View } from 'react-native';

export type MusicCardItem = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
};

type MusicCardProps = {
  item: MusicCardItem;
  index: number;
};

const GRADIENTS: ReadonlyArray<readonly [ColorValue, ColorValue, ColorValue]> =
  [
    [
      'rgba(43, 33, 130, 0.55)',
      'rgba(97, 90, 255, 0.7)',
      'rgba(144, 125, 255, 0.85)',
    ],
    [
      'rgba(0, 120, 104, 0.55)',
      'rgba(0, 182, 161, 0.7)',
      'rgba(64, 219, 198, 0.85)',
    ],
    [
      'rgba(150, 92, 20, 0.55)',
      'rgba(218, 150, 60, 0.7)',
      'rgba(255, 196, 110, 0.85)',
    ],
    [
      'rgba(34, 90, 120, 0.55)',
      'rgba(72, 150, 198, 0.7)',
      'rgba(140, 210, 235, 0.85)',
    ],
    [
      'rgba(90, 44, 120, 0.55)',
      'rgba(150, 92, 200, 0.7)',
      'rgba(210, 160, 240, 0.85)',
    ],
    [
      'rgba(120, 80, 30, 0.55)',
      'rgba(190, 130, 60, 0.7)',
      'rgba(235, 190, 120, 0.85)',
    ],
  ];

export default function MusicCard({ item, index }: MusicCardProps) {
  const gradient = GRADIENTS[index % GRADIENTS.length];

  return (
    <View style={styles.card}>
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.inner}
      >
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: item.image }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 200,
    width: 140,
    overflow: 'hidden',
    borderRadius: 16,
  },
  inner: {
    height: '100%',
    width: '100%',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 16,
  },
  imageWrapper: {
    alignSelf: 'center',
    height: 96,
    width: 110,
    overflow: 'hidden',
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  image: {
    height: '100%',
    width: '100%',
  },
  title: {
    marginTop: 14,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  playButton: {
    marginTop: 16,
    height: 28,
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9999,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
});
