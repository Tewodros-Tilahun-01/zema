import { Slot } from 'expo-router';

export default function PlaylistLayout() {
  return <Slot />; // renders child screen
}

// Remove header entirely for this nested layout
export const screenOptions = {
  headerShown: false,
  tabBarButton: () => null,
  // hides tab icon if needed
  unmountOnBlur: true,
};
