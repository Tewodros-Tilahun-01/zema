import { Ionicons } from '@expo/vector-icons';
import { forwardRef } from 'react';
import { Pressable, TextInput } from 'react-native';

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  onSubmitEditing: () => void;
  onClear: () => void;
};

export const SearchBar = forwardRef<TextInput, SearchBarProps>(function SearchBar(
  { value, onChangeText, onFocus, onBlur, onSubmitEditing, onClear },
  ref,
) {
  return (
    <Pressable
      className="mt-4 mb-5 flex-row items-center rounded-full bg-white px-4 py-2"
      onPress={() => (ref as any)?.current?.focus()}
    >
      <Ionicons name="search" size={18} color="#111827" />
      <TextInput
        ref={ref}
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        onBlur={onBlur}
        onSubmitEditing={onSubmitEditing}
        returnKeyType="search"
        placeholder="What do you want to play?"
        placeholderTextColor="#11182799"
        className="ml-2 flex-1 py-1 text-base font-semibold text-black"
      />
      {!!value && (
        <Pressable
          className="ml-2 h-6 w-12 items-center justify-center rounded-full bg-black/10"
          onPress={onClear}
        >
          <Ionicons name="close" size={14} color="#111827" />
        </Pressable>
      )}
    </Pressable>
  );
});
