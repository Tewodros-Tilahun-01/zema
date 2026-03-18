import { Stack } from 'expo-router';

export default function SearchLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="playlist/[id]" />
      <Stack.Screen name="artist/[id]" />
    </Stack>
  );
}
