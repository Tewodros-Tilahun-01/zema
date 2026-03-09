import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type PlayerHeaderProps = {
  onCollapse?: () => void;
};

export function PlayerHeader({ onCollapse }: PlayerHeaderProps) {
  return (
    <View style={styles.header}>
      <Pressable style={styles.iconCircle} onPress={onCollapse}>
        <Ionicons name="chevron-down" size={24} color="#EDEDF4" />
      </Pressable>
      <Text style={styles.headerTitle}>Now Playing</Text>
      <Pressable style={styles.iconCircle}>
        <Ionicons name="ellipsis-horizontal" size={24} color="#EDEDF4" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 12,
    paddingBottom: 18,
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
    backdropFilter: 'blur(30px)',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#F8F8FC',
    letterSpacing: 0.2,
  },
});
