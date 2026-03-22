import { initializeFavoritesCollection } from '@/db/queries';
import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect } from 'react';
import { Text, View } from 'react-native';

export default function SplashScreen() {
  const db = useSQLiteContext();

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const init = async () => {
      // Database is guaranteed to be migrated at this point
      // because SQLiteProvider's onInit completes before children mount
      await initializeFavoritesCollection();
      console.log('✅ initialized favorites collection');

      // Show splash screen briefly
      timeoutId = setTimeout(() => {
        router.replace('/(tabs)/home');
      }, 1000);
    };
    init();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  return (
    <View className="z-120 flex-1 items-center justify-center bg-black">
      <Text className="text-2xl font-semibold text-white">Splash</Text>
    </View>
  );
}
