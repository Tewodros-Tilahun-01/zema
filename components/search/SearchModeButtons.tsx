import { SearchMode } from '@/types/deezer';
import { Pressable, Text, View } from 'react-native';

type SearchModeButtonsProps = {
  selectedMode: SearchMode;
  onModeChange: (mode: SearchMode) => void;
};

const MODES: { value: SearchMode; label: string }[] = [
  { value: 'track', label: 'Tracks' },
  { value: 'artist', label: 'Artists' },
  { value: 'playlist', label: 'Playlists' },
];

export function SearchModeButtons({ selectedMode, onModeChange }: SearchModeButtonsProps) {
  return (
    <View className="mb-4 flex-row gap-2">
      {MODES.map((mode) => {
        const isSelected = selectedMode === mode.value;
        return (
          <Pressable
            key={mode.value}
            onPress={() => onModeChange(mode.value)}
            className={`rounded-full px-4 py-2 ${
              isSelected ? 'bg-white' : 'border border-white/20 bg-white/5'
            }`}
          >
            <Text
              className={`text-xs font-semibold ${isSelected ? 'text-black' : 'text-white/90'}`}
            >
              {mode.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
