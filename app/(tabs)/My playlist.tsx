import CollectionCard from '@/components/collections/CollectionCard';
import CreateCollectionModal from '@/components/collections/CreateCollectionModal';
import { useCollections } from '@/hooks/useCollections';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PlaylistScreen() {
  const router = useRouter();
  const { collections, isLoading, createCollection, refetch } = useCollections();
  const [modalVisible, setModalVisible] = useState(false);

  const handleCreateCollection = useCallback(
    async (name: string, description?: string) => {
      await createCollection(name, description);
    },
    [createCollection],
  );

  const handleCollectionPress = useCallback(
    (collectionId: number) => {
      router.push(`/(tabs)/collection/${collectionId}`);
    },
    [router],
  );

  return (
    <View className="flex-1 bg-[#0B0E14]">
      <SafeAreaView edges={['top']} />

      {/* Header */}
      <View className="px-5 pt-6 pb-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-3xl font-bold text-white">My Playlists</Text>
          <Pressable
            onPress={() => setModalVisible(true)}
            className="h-10 w-10 items-center justify-center rounded-full bg-white/10 active:bg-white/20"
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>

      {/* Collections List */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      ) : collections.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-white/10">
            <Ionicons name="musical-notes" size={40} color="rgba(255,255,255,0.5)" />
          </View>
          <Text className="mb-2 text-center text-xl font-semibold text-white">
            No playlists yet
          </Text>
          <Text className="mb-6 text-center text-base text-white/60">
            Create your first playlist to organize your favorite tracks
          </Text>
          <Pressable
            onPress={() => setModalVisible(true)}
            className="rounded-full bg-[#E8E9F1] px-6 py-3 active:bg-[#D0D1D9]"
          >
            <Text className="text-base font-semibold text-black">Create Playlist</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={collections}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <CollectionCard collection={item} onPress={() => handleCollectionPress(item.id)} />
          )}
          contentContainerClassName="px-5 pb-32 gap-3"
          showsVerticalScrollIndicator={false}
          onRefresh={refetch}
          refreshing={isLoading}
        />
      )}

      {/* Create Collection Modal */}
      <CreateCollectionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onCreate={handleCreateCollection}
      />
    </View>
  );
}
