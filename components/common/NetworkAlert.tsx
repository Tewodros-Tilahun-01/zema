import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useNetworkStatus } from '../../hooks/useNetworkStatus';

export const NetworkAlert = () => {
  const { isConnected, showAlert } = useNetworkStatus();
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (showAlert) {
      // Slide down smoothly without bounce
      translateY.value = withTiming(0, { duration: 300 });
      opacity.value = withTiming(1, { duration: 300 });
    } else {
      // Slide up
      translateY.value = withTiming(-100, { duration: 300 });
      opacity.value = withTiming(0, { duration: 300 });
    }
  }, [showAlert, translateY, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          position: 'absolute',
          top: insets.top,
          left: 0,
          right: 0,
          zIndex: 9999,
        },
      ]}
    >
      <View
        className={`mx-4 rounded-lg px-4 py-3 shadow-lg ${
          isConnected ? 'bg-emerald-500' : 'bg-red-400'
        }`}
      >
        <Text className="text-center font-semibold text-white">
          {isConnected ? 'Connected to Internet' : 'No Internet Connection'}
        </Text>
      </View>
    </Animated.View>
  );
};
