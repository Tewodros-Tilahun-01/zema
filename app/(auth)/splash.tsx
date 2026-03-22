import { initializeFavoritesCollection } from '@/db/queries';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';

export default function SplashScreen() {
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
    <View className="z-120 flex-1 items-center justify-center bg-[#121212]">
      <Image
        source={require('@/assets/images/MusicLoader.gif')}
        style={{ width: 200, height: 200 }}
        contentFit="contain"
      />
    </View>
  );
}
