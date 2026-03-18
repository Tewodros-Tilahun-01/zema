import { Ionicons } from '@expo/vector-icons';
import { useCallback, useState } from 'react';
import { Modal, Pressable, Text, TextInput, View } from 'react-native';

type CreateCollectionModalProps = {
  visible: boolean;
  onClose: () => void;
  onCreate: (name: string, description?: string) => Promise<void>;
};

export default function CreateCollectionModal({
  visible,
  onClose,
  onCreate,
}: CreateCollectionModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = useCallback(async () => {
    if (!name.trim()) return;

    setIsCreating(true);
    await onCreate(name.trim(), description.trim() || undefined);
    setIsCreating(false);
    setName('');
    setDescription('');
    onClose();
  }, [name, description, onCreate, onClose]);

  const handleClose = useCallback(() => {
    setName('');
    setDescription('');
    onClose();
  }, [onClose]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View className="flex-1 items-center justify-center bg-black/80 px-6">
        <View className="w-full rounded-3xl bg-[#1A1D23] p-6">
          {/* Header */}
          <View className="mb-6 flex-row items-center justify-between">
            <Text className="text-xl font-bold text-white">Create Playlist</Text>
            <Pressable onPress={handleClose} className="h-8 w-8 items-center justify-center">
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </Pressable>
          </View>

          {/* Name Input */}
          <View className="mb-4">
            <Text className="mb-2 text-sm font-medium text-white/70">Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="My Awesome Playlist"
              placeholderTextColor="rgba(255,255,255,0.3)"
              className="rounded-xl bg-white/10 px-4 py-3 text-base text-white"
              autoFocus
            />
          </View>

          {/* Description Input */}
          <View className="mb-6">
            <Text className="mb-2 text-sm font-medium text-white/70">Description (Optional)</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Add a description..."
              placeholderTextColor="rgba(255,255,255,0.3)"
              className="rounded-xl bg-white/10 px-4 py-3 text-base text-white"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Buttons */}
          <View className="flex-row gap-3">
            <Pressable
              onPress={handleClose}
              className="flex-1 items-center justify-center rounded-xl bg-white/10 py-3 active:bg-white/20"
            >
              <Text className="text-base font-semibold text-white">Cancel</Text>
            </Pressable>
            <Pressable
              onPress={handleCreate}
              disabled={!name.trim() || isCreating}
              className={`flex-1 items-center justify-center rounded-xl py-3 ${
                !name.trim() || isCreating ? 'bg-white/20' : 'bg-[#E8E9F1] active:bg-[#D0D1D9]'
              }`}
            >
              <Text
                className={`text-base font-semibold ${!name.trim() || isCreating ? 'text-white/40' : 'text-black'}`}
              >
                {isCreating ? 'Creating...' : 'Create'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
