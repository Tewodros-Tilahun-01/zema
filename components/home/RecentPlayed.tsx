import RecentlyPlayedItem from '@/components/recent/RecentlyPlayedItem';
import { clearRecentlyPlayed } from '@/db/queries';
import { useRecentlyPlayed } from '@/hooks/useRecentlyPlayed';
import { useTrackPlayer } from '@/hooks/useTrackPlayer';
import { recentlyPlayedToTrack } from '@/utils/trackConverter';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from 'react-native';

export default function RecentPlayed() {
  const { tracks, isLoading, refetch } = useRecentlyPlayed();
  const { handleTrackPress } = useTrackPlayer();
  const [isClearing, setIsClearing] = useState(false);

  const handlePress = (track: any) => {
    const fullTrack = recentlyPlayedToTrack(track);
    handleTrackPress(fullTrack);
  };

  const handleClear = () => {
    Alert.alert(
      'Clear Recent Tracks',
      'Are you sure you want to clear all recently played tracks?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            setIsClearing(true);
            try {
              await clearRecentlyPlayed();
              await refetch();
            } catch (error) {
              console.error('Failed to clear recently played:', error);
            } finally {
              setIsClearing(false);
            }
          },
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <View className="px-1">
        <Text className="text-2xl font-semibold text-white">recent played</Text>
        <View className="mt-8 items-center py-8">
          <ActivityIndicator size="small" color="#FFFFFF" />
        </View>
      </View>
    );
  }

  if (tracks.length === 0) {
    return (
      <View className="px-1">
        <Text className="text-2xl font-semibold text-white">recent played</Text>
        <Text className="mt-8 text-center text-sm text-white/60">
          No recently played tracks yet
        </Text>
      </View>
    );
  }

  return (
    <View className="px-1">
      <View className="flex-row items-center justify-between">
        <Text className="text-2xl font-semibold text-white">recent played</Text>
        <TouchableOpacity
          onPress={handleClear}
          disabled={isClearing}
          className="h-7 w-10 items-center justify-center rounded-full bg-white/10"
          activeOpacity={0.7}
        >
          {isClearing ? (
            <ActivityIndicator size="small" color="#E8E9F1" />
          ) : (
            <Ionicons name="trash-outline" size={14} color="#E8E9F1" />
          )}
        </TouchableOpacity>
      </View>
      <Text className="mt-1 text-xs text-white/60">Based on your recent listens</Text>
      <View className="mt-4 gap-2">
        {tracks.map((track) => (
          <RecentlyPlayedItem key={track.id} track={track} onPress={handlePress} />
        ))}
      </View>
    </View>
  );
}
