import HorizontalSlider from '@/components/HorizontalSlider';
import MusicCard, { MusicCardItem } from '@/components/MusicCard';
import { Ionicons } from '@expo/vector-icons';
import { Image, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TRENDING: MusicCardItem[] = [
  {
    id: 't1',
    title: 'Gloaming Drive',
    subtitle: '19k plays',
    image:
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 't2',
    title: 'Private Memory',
    subtitle: '12k plays',
    image:
      'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 't3',
    title: 'Late Night',
    subtitle: '8k plays',
    image:
      'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'tj1',
    title: 'Gloaming Drive',
    subtitle: '19k plays',
    image:
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'tj2',
    title: 'Private Memory',
    subtitle: '12k plays',
    image:
      'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'th3',
    title: 'Late Night',
    subtitle: '8k plays',
    image:
      'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=300&q=80',
  },
];

const RECENT = [
  {
    id: 'r1',
    name: 'Mr Ryval',
    time: '27m',
    image:
      'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'r2',
    name: 'Nedriest',
    time: '42m',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'r3',
    name: 'Rolette',
    time: '13m',
    image:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'r4',
    name: 'Moza',
    time: '1h',
    image:
      'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'r1h',
    name: 'Mr Ryval',
    time: '27m',
    image:
      'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'rh2',
    name: 'Nedriest',
    time: '42m',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'rh3',
    name: 'Rolette',
    time: '13m',
    image:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'rh4',
    name: 'Moza',
    time: '1h',
    image:
      'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80',
  },
];

const RECOMMENDED = [
  {
    id: 'a1',
    name: 'Ava Voz',
    tag: 'Dream pop',
    image:
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'a2',
    name: 'Juno Hall',
    tag: 'Indie soul',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'a3',
    name: 'Mako North',
    tag: 'Alt R&B',
    image:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  },
];

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-[#0B0E14]">
      <SafeAreaView />

      <ScrollView
        className="flex-1 gap-1"
        contentContainerClassName="px-5 pb-28"
        showsVerticalScrollIndicator={false}
      >
        <View className="mt-2 mb-4 flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-semibold text-white">
              Trending playlists
            </Text>
          </View>
          <View className="flex-row items-center gap-3">
            <View className="h-9 w-9 items-center justify-center rounded-full bg-white/10">
              <Ionicons name="search" size={18} color="#E8E9F1" />
            </View>
          </View>
        </View>

        <HorizontalSlider
          data={TRENDING}
          className="mt-5"
          keyExtractor={(item) => item.id}
          renderItem={(item, index) => <MusicCard item={item} index={index} />}
        />

        <View className="mt-8 rounded-3xl border border-white/10 bg-white/5 px-4 py-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-white">
              Recently played
            </Text>
            <View className="h-7 w-10 items-center justify-center rounded-full bg-white/10">
              <Ionicons name="chevron-forward" size={14} color="#E8E9F1" />
            </View>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-4"
          >
            {RECENT.map((item) => (
              <View key={item.id} className="mr-4 items-center">
                <Image
                  source={{ uri: item.image }}
                  className="h-14 w-14 rounded-full border border-white/10"
                />
                <Text className="mt-2 text-xs text-white">{item.name}</Text>
                <Text className="text-[10px] text-white/50">{item.time}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View className="mt-8 rounded-3xl border border-white/10 bg-white/5 px-4 py-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-white">
              Recommended Artists
            </Text>
            <View className="h-7 w-10 items-center justify-center rounded-full bg-white/10">
              <Ionicons name="options" size={14} color="#E8E9F1" />
            </View>
          </View>
          <Text className="mt-1 text-xs text-white/60">
            Based on your recent listens
          </Text>
          <View className="mt-4 gap-3">
            {RECOMMENDED.map((artist) => (
              <View
                key={artist.id}
                className="flex-row items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 py-3"
              >
                <View className="flex-row items-center">
                  <Image
                    source={{ uri: artist.image }}
                    className="h-10 w-10 rounded-full"
                  />
                  <View className="ml-3">
                    <Text className="text-sm font-semibold text-white">
                      {artist.name}
                    </Text>
                    <Text className="text-[11px] text-white/60">
                      {artist.tag}
                    </Text>
                  </View>
                </View>
                <View className="h-8 w-8 items-center justify-center rounded-full bg-white/10">
                  <Ionicons name="add" size={16} color="#E8E9F1" />
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
