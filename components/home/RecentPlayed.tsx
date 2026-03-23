import TrackItem from '@/components/common/TrackItem';
import { clearRecentlyPlayed } from '@/db/queries';
import { RecentlyPlayed } from '@/db/schema';
import { recentlyPlayedToTrack } from '@/utils/trackConverter';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from 'react-native';

type RecentPlayedProps = {
  tracks: RecentlyPlayed[];
  onRefresh?: () => Promise<any>;
};

export default function RecentPlayed({ tracks, onRefresh }: RecentPlayedProps) {
  const [isClearing, setIsClearing] = useState(false);

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
              if (onRefresh) {
                await onRefresh();
              }
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

  if (tracks.length === 0) {
    return (
      <View className="px-1">
        <Text className="text-2xl font-semibold text-white">Recent played</Text>
        <Text className="mt-8 text-center text-sm text-white/60">
          No recently played tracks yet
        </Text>
      </View>
    );
  }

  return (
    <View className="px-1">
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-2xl font-semibold text-white">Recent played</Text>
          <Text className="mt-1 text-xs text-white/60">Based on your recent listens</Text>
        </View>

        <TouchableOpacity
          onPress={handleClear}
          disabled={isClearing}
          className="mt-1 h-7 w-10 items-center justify-center rounded-full bg-white/10"
          activeOpacity={0.7}
        >
          {isClearing ? (
            <ActivityIndicator size="small" color="#E8E9F1" />
          ) : (
            <Ionicons name="trash-outline" size={14} color="#E8E9F1" />
          )}
        </TouchableOpacity>
      </View>
      <View className="mt-4 gap-2">
        {tracks.map((track) => (
          <TrackItem key={track.id} track={recentlyPlayedToTrack(track)} />
        ))}
      </View>
    </View>
  );
}
