import { ReactNode } from 'react';
import { Pressable, PressableProps, StyleSheet, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

type ButtonProps = PressableProps & {
  children: ReactNode;
  style?: ViewStyle;
  pressedScale?: number;
};

export default function Button({
  children,
  style,
  pressedScale = 0.95,
  onPress,
  ...props
}: ButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = (e: any) => {
    scale.value = withTiming(pressedScale, { duration: 100 });
    setTimeout(() => {
      scale.value = withTiming(1, { duration: 100 });
    }, 100);

    onPress?.(e);
  };

  return (
    <Pressable onPress={handlePress} {...props}>
      <Animated.View style={[styles.container, style, animatedStyle]}>{children}</Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    // Base container style
  },
});
