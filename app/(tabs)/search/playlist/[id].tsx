import PlaylistScreen from '@/components/screens/PlaylistScreen';
import { useLocalSearchParams } from 'expo-router';

export default function SearchPlaylistScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <PlaylistScreen playlistId={id as string} />;
}
