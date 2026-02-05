import { router } from 'expo-router';
import { useEffect } from 'react';
import { Text, View } from 'react-native';

export default function SplashScreen() {
  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace('/(tabs)/home');
    }, 1200);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-black">
      <Text className="text-2xl font-semibold text-white">Splash</Text>
    </View>
  );
}
