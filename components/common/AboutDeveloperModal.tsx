import { Ionicons } from '@expo/vector-icons';
import { Linking, Modal, Pressable, Text, View } from 'react-native';

interface AboutDeveloperModalProps {
  visible: boolean;
  onClose: () => void;
}

export function AboutDeveloperModal({ visible, onClose }: AboutDeveloperModalProps) {
  const handleOpenPortfolio = () => {
    Linking.openURL('https://tewodrostilahun.vercel.app');
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable className="flex-1 items-center justify-center bg-black/70" onPress={onClose}>
        <Pressable
          className="mx-6 w-80 rounded-2xl bg-[#1e1e1e] p-6"
          onPress={(e) => e.stopPropagation()}
        >
          <View className="items-center">
            <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-[#7A58FF]">
              <Ionicons name="person" size={32} color="#fff" />
            </View>
            <Text className="text-xl font-bold text-white">About Developer</Text>
            <Text className="mt-4 text-center text-sm leading-6 text-white/70">
              Built with passion for music lovers.{'\n'}
              Creating seamless experiences for offline listening.
            </Text>
            <Text className="mt-4 text-xs text-white/50">Made with ❤️</Text>
          </View>
          <Pressable
            onPress={handleOpenPortfolio}
            className="mt-6 flex-row items-center justify-center rounded-lg bg-[#7A58FF] py-3"
          >
            <Ionicons name="globe-outline" size={18} color="#fff" />
            <Text className="ml-2 font-semibold text-white">Visit Portfolio</Text>
          </Pressable>
          <Pressable onPress={onClose} className="mt-3 items-center rounded-lg bg-white/10 py-3">
            <Text className="font-semibold text-white/80">Close</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
