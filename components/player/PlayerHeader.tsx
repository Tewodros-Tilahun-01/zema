import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export function PlayerHeader() {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <Pressable style={styles.iconCircle} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={18} color="#EDEDF4" />
      </Pressable>
      <Text style={styles.headerTitle}>Now Playing</Text>
      <Pressable style={styles.iconCircle}>
        <Ionicons name="musical-notes-outline" size={18} color="#EDEDF4" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconCircle: {
    height: 36,
    width: 36,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#F8F8FC',
    letterSpacing: 0.2,
  },
});
