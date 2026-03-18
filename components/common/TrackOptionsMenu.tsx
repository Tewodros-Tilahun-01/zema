import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Option = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
};

type TrackOptionsMenuProps = {
  options: Option[];
};

export default function TrackOptionsMenu({ options }: TrackOptionsMenuProps) {
  return (
    <View style={styles.container}>
      {options.map((option, index) => (
        <Pressable key={index} style={styles.option} onPress={option.onPress}>
          <Ionicons name={option.icon} size={24} color="#FFFFFF" />
          <Text style={styles.optionText}>{option.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  optionText: {
    marginLeft: 16,
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});
