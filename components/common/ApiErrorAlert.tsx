import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useApiErrorStore } from '../../store/apiErrorStore';

export const ApiErrorAlert = () => {
  const { error, showAlert } = useApiErrorStore();
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (showAlert) {
      // Slide down smoothly
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

  const getErrorMessage = () => {
    if (!error) return 'An error occurred';

    if (error.type === 'network') {
      return error.message || 'Network Error: Unable to connect';
    } else if (error.type === 'server') {
      return `Server Error: ${error.status || 'Unknown'}`;
    } else {
      return error.message || 'Something went wrong';
    }
  };

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          position: 'absolute',
          top: insets.top,
          left: 0,
          right: 0,
          zIndex: 9998,
        },
      ]}
    >
      <View className="mx-4 rounded-lg bg-red-400 px-4 py-3 shadow-lg">
        <Text className="text-center font-semibold text-white">{getErrorMessage()}</Text>
      </View>
    </Animated.View>
  );
};
