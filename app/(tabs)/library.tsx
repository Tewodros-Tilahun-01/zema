import { useDownloads } from '@/hooks/useDownloads';
import { useTrackPlayer } from '@/hooks/useTrackPlayer';
import { downloadToTrack } from '@/utils/trackConverter';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LibraryScreen() {
  const { downloads, isLoading, deleteTrack, refresh } = useDownloads();
  const { handleTrackPress } = useTrackPlayer();
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const handleDelete = async (trackId: string, event: any) => {
    event.stopPropagation();
    setDeletingId(trackId);
    try {
      await deleteTrack(trackId);
    } catch (error) {
      console.error('Failed to delete:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const handlePlay = (download: any) => {
    const track = downloadToTrack(download);
    handleTrackPress(track);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#0B0E14]">
        <ActivityIndicator size="large" color="#7A58FF" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#0B0E14]">
      <SafeAreaView />

      <View className="px-5 py-4">
        <Text className="text-2xl font-semibold text-white">Downloads</Text>
        <Text className="mt-1 text-sm text-white/60">
          {downloads.length} {downloads.length === 1 ? 'track' : 'tracks'}
        </Text>
      </View>

      {downloads.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Ionicons name="cloud-download-outline" size={64} color="rgba(255,255,255,0.3)" />
          <Text className="mt-4 text-center text-lg text-white/60">No downloads yet</Text>
          <Text className="mt-2 text-center text-sm text-white/40">
            Download tracks to listen offline
          </Text>
        </View>
      ) : (
        <FlatList
          data={downloads}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#7A58FF" />
          }
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handlePlay(item)}
              className="mb-3 flex-row items-center rounded-lg bg-white/5 p-3"
            >
              <Image
                source={{ uri: item.coverMedium }}
                className="h-14 w-14 rounded-lg"
                resizeMode="cover"
              />
              <View className="ml-3 flex-1">
                <Text className="text-base font-semibold text-white" numberOfLines={1}>
                  {item.title}
                </Text>
                <Text className="mt-1 text-xs text-white/60" numberOfLines={1}>
                  {item.artist}
                </Text>
                <Text className="mt-1 text-xs text-white/40">
                  {formatFileSize(item.fileSize)} • {formatDate(item.downloadedAt)}
                </Text>
              </View>
              <Pressable
                onPress={(e) => handleDelete(item.id, e)}
                disabled={deletingId === item.id}
                className="ml-2 h-10 w-10 items-center justify-center rounded-full bg-white/10"
              >
                {deletingId === item.id ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Ionicons name="trash-outline" size={18} color="#ff4444" />
                )}
              </Pressable>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}
