import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import Animated, { AnimatedStyle } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const STICKY_HEADER_HEIGHT = 60;

type CollectionStickyHeaderProps = {
  title: string;
  animatedStyle: AnimatedStyle<ViewStyle>;
};

export default function CollectionStickyHeader({
  title,
  animatedStyle,
}: CollectionStickyHeaderProps) {
  return (
    <Animated.View style={[styles.stickyHeader, animatedStyle]}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.headerBar}>
          <Text style={styles.stickyTitle} numberOfLines={1}>
            {title}
          </Text>
          <View style={styles.placeholder} />
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: '#121212',
  },
  safeArea: {
    backgroundColor: '#121212',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: STICKY_HEADER_HEIGHT,
  },
  stickyTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginHorizontal: 8,
  },
  placeholder: {
    width: 40,
  },
});
